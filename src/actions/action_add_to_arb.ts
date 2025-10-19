import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { getWorkspaceFolder } from "../helpers/workspace_management";

function toCamelCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .replace(/(?:^|\s)([a-zA-Z])/g, (_, c) => c.toUpperCase())
    .replace(/\s+/g, "")
    .replace(/^./, (c) => c.toLowerCase());
}

function isEnglishArb(filename: string): boolean {
  return /app_en\.arb|english\.arb|en\.arb/i.test(filename);
}

export class AddToArbProvider implements vscode.CodeActionProvider {
  provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range
  ): vscode.ProviderResult<vscode.CodeAction[]> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }
    const selectedText = editor.document.getText(editor.selection).trim();
    if (!selectedText || selectedText.length < 2) {
      return;
    }
    const action = new vscode.CodeAction(
      "Add to .arb localization files",
      vscode.CodeActionKind.QuickFix
    );
    action.command = {
      title: "Add to .arb localization files",
      command: "eazyflutter.addToArb",
      arguments: [selectedText],
    };
    return [action];
  }
}

export function registerCommandForAddToArb(context: vscode.ExtensionContext) {
  // Detect FVM usage
  function usesFvm(projectPath: string): boolean {
    return (
      fs.existsSync(path.join(projectPath, "fvm")) ||
      fs.existsSync(path.join(projectPath, ".fvm"))
    );
  }
  const disposable = vscode.commands.registerCommand(
    "eazyflutter.addToArb",
    async (selectedText: string) => {
      const workspaceFolder = await getWorkspaceFolder();
      if (!workspaceFolder) {
        vscode.window.showErrorMessage("No workspace folder found.");
        return;
      }
      // Find all .arb files
      const arbFiles: string[] = [];
      function walk(dir: string) {
        if (!fs.existsSync(dir)) {
          return;
        }
        for (const file of fs.readdirSync(dir)) {
          const fullPath = path.join(dir, file);
          if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
          } else if (file.endsWith(".arb")) {
            arbFiles.push(fullPath);
          }
        }
      }
      walk(workspaceFolder);

      // Identify English .arb files and others
      const englishArbs = arbFiles.filter(isEnglishArb);
      const otherArbs = arbFiles.filter((f) => !isEnglishArb(f));

      // If no English .arb file, create l10n/app_en.arb
      let englishArb = englishArbs.length > 0 ? englishArbs[0] : undefined;
      if (!englishArb) {
        const l10nDir = path.join(workspaceFolder, "lib", "l10n");
        if (!fs.existsSync(l10nDir)) {
          fs.mkdirSync(l10nDir, { recursive: true });
        }
        englishArb = path.join(l10nDir, "app_en.arb");
        fs.writeFileSync(englishArb, "{}", { flag: "wx" });
      }

      const key = toCamelCase(selectedText);

      // Always add value to all English .arb files
      for (const arb of englishArbs.length > 0 ? englishArbs : [englishArb]) {
        let englishJson: { [key: string]: string } = {};
        try {
          englishJson = JSON.parse(fs.readFileSync(arb, "utf8"));
        } catch {
          englishJson = {};
        }
        englishJson[key] = selectedText;
        fs.writeFileSync(arb, JSON.stringify(englishJson, null, 2));
      }

      // Add empty value to other .arb files
      for (const arb of otherArbs) {
        let json: { [key: string]: string } = {};
        try {
          json = JSON.parse(fs.readFileSync(arb, "utf8"));
        } catch {
          json = {};
        }
        json[key] = "";
        fs.writeFileSync(arb, JSON.stringify(json, null, 2));
      }

      // Replace selected string in code with the configured prefix + key
      const editor = vscode.window.activeTextEditor;
      if (editor && !editor.selection.isEmpty) {
        const config = vscode.workspace.getConfiguration("eazyflutter");
        const prefix = config.get<string>("localizationKeyPrefix") || "";
        await editor.edit((editBuilder) => {
          editBuilder.replace(editor.selection, `${prefix}${key}`);
        });
      }

      vscode.window.showInformationMessage(
        `Added "${selectedText}" to localization files as "${key}" and replaced in code.`
      );

      // Auto run l10n generate if enabled
      const config = vscode.workspace.getConfiguration("eazyflutter");
      const autoL10n = config.get<boolean>("autoL10nGenerate");
      if (autoL10n) {
        const useFvm = usesFvm(workspaceFolder);
        const l10nCmd = useFvm ? "fvm flutter gen-l10n" : "flutter gen-l10n";
        const terminal = vscode.window.createTerminal({
          name: "EazyFlutter l10n",
        });
        terminal.sendText(l10nCmd);
        terminal.show();
      }
    }
  );
  context.subscriptions.push(disposable);
}
