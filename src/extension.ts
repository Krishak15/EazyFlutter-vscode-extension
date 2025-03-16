import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";
const { generate } = require("json-to-dart");

export function activate(context: vscode.ExtensionContext) {
  // Register Wrap with Consumer Quick Fix
  const provider = vscode.languages.registerCodeActionsProvider(
    "dart",
    new WrapWithConsumerProvider(),
    {
      providedCodeActionKinds: [vscode.CodeActionKind.Refactor],
    }
  );
  context.subscriptions.push(provider);

  // Command for wrapping with Consumer
  const consumerCommand = vscode.commands.registerCommand(
    "consumerWrapper.wrapWithConsumer",
    async (document: vscode.TextDocument, range: vscode.Range) => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }

      let selectedText = editor.document.getText(editor.selection);
      if (!selectedText && range) {
        selectedText = document.getText(range);
      }

      if (!selectedText) {
        vscode.window.showErrorMessage("No widget selected.");
        return;
      }

      // Ask for Provider type
      const providerName = await vscode.window.showInputBox({
        prompt: "Enter Provider Type (e.g., AppUserManagementProvider)",
        placeHolder: "ProviderType",
      });

      if (!providerName) {
        vscode.window.showErrorMessage("Provider type is required!");
        return;
      }

      const camelCaseProviderName = convertToCamelCase(providerName);

      const wrappedText = `Consumer<${providerName}>(\n  builder: (context, ${camelCaseProviderName}, _) {\n    return ${selectedText};\n  },\n)`;

      editor.edit((editBuilder) => {
        editBuilder.replace(
          editor.selection.isEmpty ? range : editor.selection,
          wrappedText
        );
      });
    }
  );
  context.subscriptions.push(consumerCommand);

  // Register JSON to Dart command (using json-to-dart QuickType)
  const jsonToDartCommand = vscode.commands.registerCommand(
    "jsonToDart.generateModel",
    async () => {
      try {
        const jsonInput = await vscode.window.showInputBox({
          prompt: "Enter JSON to convert to Dart model",
          placeHolder: "Paste JSON here",
        });
        if (!jsonInput) {
          vscode.window.showErrorMessage("No JSON input provided.");
          return;
        }

        const className = await vscode.window.showInputBox({
          prompt: "Enter the class name for the Dart model",
          placeHolder: "Example: WeatherDataModel",
        });
        if (!className) {
          vscode.window.showErrorMessage("Class name is required.");
          return;
        }

        const dartModel = generate(jsonInput, className);
        if (!dartModel) {
          vscode.window.showErrorMessage("Error generating Dart model.");
          return;
        }

        saveAndOpenFile(className, dartModel);
      } catch (error) {
        vscode.window.showErrorMessage(`Error: ${error}`);
      }
    }
  );
  context.subscriptions.push(jsonToDartCommand);

  // Register JSON to Dart command (using quicktype)
  const quicktypeCommand = vscode.commands.registerCommand(
    "extension.jsonToDart",
    async () => {
      const jsonInput = await vscode.window.showInputBox({
        prompt: "Enter JSON data",
        placeHolder: '{ "name": "John", "age": 30 }',
      });
      if (!jsonInput) {
        return;
      }

      const className = await vscode.window.showInputBox({
        prompt: "Enter Dart class name",
        placeHolder: "AppUserDataModel",
      });
      if (!className) {
        return;
      }

      // const workspaceFolder =
      //   vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
      // if (!workspaceFolder) {
      //   vscode.window.showErrorMessage("No workspace folder found.");
      //   return;
      // }

      if (
        !vscode.workspace.workspaceFolders ||
        vscode.workspace.workspaceFolders.length === 0
      ) {
        vscode.window.showErrorMessage(
          "No workspace folder found. Open a workspace first."
        );
        return;
      }

      // const workspaceFolder = vscode.workspace.workspaceFolders[0].uri.fsPath;
      const workspaceFolder = await getWorkspaceFolder();
      const fileName = convertClassNameToFilename(className) + ".dart";

      const modelsDir = path.join(workspaceFolder, "lib/models");

      // Ensure the models directory exists
      if (!fs.existsSync(modelsDir)) {
        fs.mkdirSync(modelsDir, { recursive: true });
      }

      // const outputPath = path.resolve(workspaceFolder, "lib/models", fileName);
      const outputPath = vscode.Uri.file(
        path.join(workspaceFolder, "lib/models", fileName)
      ).fsPath;
      console.log("Resolved Output Path:", outputPath);

      const tempJsonPath = path.join(workspaceFolder, "temp.json");
      fs.writeFileSync(tempJsonPath, jsonInput);

      console.log("Workspace Folder:", workspaceFolder);
      console.log("Models Path:", outputPath);
      console.log("Temp JSON Path:", tempJsonPath);

      //Command for generating Dart model from provided JSON
      const command = `quicktype --lang dart --src "${tempJsonPath}" --use-json-annotation --out "${outputPath}"`;

      exec(command, (error, stdout, stderr) => {
        if (error) {
          vscode.window.showErrorMessage(`Error: ${stderr}`);
          return;
        }
        vscode.window.showInformationMessage(`Dart model saved: ${outputPath}`);
        vscode.workspace.openTextDocument(outputPath).then((doc) => {
          vscode.window.showTextDocument(doc);
        });
        fs.unlinkSync(tempJsonPath);
      });
    }
  );
  context.subscriptions.push(quicktypeCommand);
}

class WrapWithConsumerProvider implements vscode.CodeActionProvider {
  provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range
  ): vscode.ProviderResult<vscode.CodeAction[]> {
    const action = new vscode.CodeAction(
      "Wrap with Consumer<T>",
      vscode.CodeActionKind.Refactor
    );
    action.command = {
      title: "Wrap with Consumer<T>",
      command: "consumerWrapper.wrapWithConsumer",
      arguments: [document, range],
    };
    return [action];
  }
}

async function getWorkspaceFolder() {
  if (vscode.workspace.workspaceFolders) {
    return vscode.workspace.workspaceFolders[0].uri.fsPath;
  } else {
    const folderUri = await vscode.window.showOpenDialog({
      canSelectFolders: true,
      canSelectMany: false,
      openLabel: "Select Workspace Folder",
    });
    return folderUri ? folderUri[0].fsPath : "";
  }
}

getWorkspaceFolder().then((workspacePath) => {
  if (!workspacePath) {
    vscode.window.showErrorMessage("No workspace selected!");
    return;
  }
  console.log("Workspace Path:", workspacePath);
});

function convertToCamelCase(input: string): string {
  return input.charAt(0).toLowerCase() + input.slice(1);
}

function convertClassNameToFilename(className: string): string {
  return className.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
}

async function saveAndOpenFile(className: string, content: string) {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    vscode.window.showErrorMessage("No workspace folder found.");
    return;
  }

  const workspacePath = workspaceFolders[0].uri.fsPath;
  const modelsPath = vscode.Uri.file(`${workspacePath}/lib/models`);
  const filePath = vscode.Uri.file(
    `${workspacePath}/lib/models/${convertClassNameToFilename(className)}.dart`
  );

  await vscode.workspace.fs.createDirectory(modelsPath);
  await vscode.workspace.fs.writeFile(filePath, Buffer.from(content, "utf8"));
  vscode.window.showInformationMessage(
    `Dart model saved as ${convertClassNameToFilename(className)}.dart`
  );

  const document = await vscode.workspace.openTextDocument(filePath);
  vscode.window.showTextDocument(document);
}

export function deactivate() {}
