import vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { generateDartModel } from "../utils/json_convertor";

const { jsonInputForTargetLanguage } = require("quicktype-core");

export function registerCommandForJsonConversion({
  context,
  getWorkspaceFolder,
}: {
  context: vscode.ExtensionContext;
  getWorkspaceFolder: any;
}) {
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

      if (
        !vscode.workspace.workspaceFolders ||
        vscode.workspace.workspaceFolders.length === 0
      ) {
        vscode.window.showErrorMessage(
          "No workspace folder found. Open a workspace first."
        );
        return;
      }

      const workspaceFolder = await getWorkspaceFolder();

      const fileNameContainsWordModel = containsModel(className);

      let fileName = "";

      if (fileNameContainsWordModel) {
        fileName = convertClassNameToFilename(className) + ".dart";
      } else {
        fileName = convertClassNameToFilename(className + "_model") + ".dart";
      }

      const modelsDir = path.join(workspaceFolder, "lib/models");

      // Ensure the models directory exists
      if (!fs.existsSync(modelsDir)) {
        fs.mkdirSync(modelsDir, { recursive: true });
      }

      const outputPath = vscode.Uri.file(
        path.join(workspaceFolder, "lib/models", fileName)
      ).fsPath;
      console.log("Resolved Output Path:", outputPath);

      const tempJsonPath = path.join(
        workspaceFolder,
        "eazyflutter_json_temp.json"
      );
      fs.writeFileSync(tempJsonPath, jsonInput);

      console.log("Workspace Folder:", workspaceFolder);
      console.log("Models Path:", outputPath);
      console.log("Temp JSON Path:", tempJsonPath);

      try {
        await generateDartModel(
          tempJsonPath,
          className,
          outputPath,
          jsonInputForTargetLanguage
        );

        vscode.workspace
          .openTextDocument(vscode.Uri.file(outputPath))
          .then((document) => {
            vscode.window.showTextDocument(document);
          });

        // Delete temporary json after generating model.
        fs.unlinkSync(tempJsonPath);
      } catch (e) {
        console.log(e);
      }
    }
  );
  context.subscriptions.push(quicktypeCommand);
}

// Convert class name to filename format
function convertClassNameToFilename(className: string): string {
  return className.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
}

function containsModel(className: string): boolean {
  return /model/i.test(className); // 'i' makes it case-insensitive
}
