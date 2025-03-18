"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const { quicktype, InputData, jsonInputForTargetLanguage, } = require("quicktype-core");
function activate(context) {
    // Register Wrap with Consumer Quick Fix
    const provider = vscode.languages.registerCodeActionsProvider("dart", new WrapWithConsumerProvider(), {
        providedCodeActionKinds: [vscode.CodeActionKind.Refactor],
    });
    context.subscriptions.push(provider);
    // Command for wrapping with Consumer
    const consumerCommand = vscode.commands.registerCommand("consumerWrapper.wrapWithConsumer", async (document, range) => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        let selectedText = editor.document.getText(editor.selection);
        if (!selectedText) {
            const startOffset = document.offsetAt(editor.selection.start);
            const widgetRange = findFullWidgetRange(document, startOffset);
            if (!widgetRange) {
                vscode.window.showErrorMessage("No valid widget selected.");
                return;
            }
            selectedText = document.getText(widgetRange);
            range = widgetRange;
        }
        // Ask for Provider type
        const providerName = await vscode.window.showInputBox({
            prompt: "Enter Provider Type (e.g., TestProvider)",
            placeHolder: "ProviderType",
        });
        if (!providerName) {
            vscode.window.showErrorMessage("Provider type is required!");
            return;
        }
        const camelCaseProviderName = convertToCamelCase(providerName);
        editor.edit((editBuilder) => {
            editBuilder.replace(range, `Consumer<${providerName}>(
            builder: (context, ${camelCaseProviderName}, _) {
              return ${selectedText};
            },
          )`);
            ensureProviderImport(document);
        });
        // **Ensure `provider.dart` is imported**
    });
    context.subscriptions.push(consumerCommand);
    // Register JSON to Dart command (using json-to-dart QuickType)
    const jsonToDartCommand = vscode.commands.registerCommand("jsonToDart.generateModel", async () => {
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
        }
        catch (error) {
            vscode.window.showErrorMessage(`Error: ${error}`);
        }
    });
    context.subscriptions.push(jsonToDartCommand);
    // Register JSON to Dart command (using quicktype)
    const quicktypeCommand = vscode.commands.registerCommand("extension.jsonToDart", async () => {
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
        if (!vscode.workspace.workspaceFolders ||
            vscode.workspace.workspaceFolders.length === 0) {
            vscode.window.showErrorMessage("No workspace folder found. Open a workspace first.");
            return;
        }
        // const workspaceFolder = vscode.workspace.workspaceFolders[0].uri.fsPath;
        const workspaceFolder = await getWorkspaceFolder();
        const fileNameContainsWordModel = containsModel(className);
        let fileName = "";
        if (fileNameContainsWordModel) {
            fileName = convertClassNameToFilename(className) + ".dart";
        }
        else {
            fileName = convertClassNameToFilename(className + "_model") + ".dart";
        }
        const modelsDir = path.join(workspaceFolder, "lib/models");
        // Ensure the models directory exists
        if (!fs.existsSync(modelsDir)) {
            fs.mkdirSync(modelsDir, { recursive: true });
        }
        // const outputPath = path.resolve(workspaceFolder, "lib/models", fileName);
        const outputPath = vscode.Uri.file(path.join(workspaceFolder, "lib/models", fileName)).fsPath;
        console.log("Resolved Output Path:", outputPath);
        const tempJsonPath = path.join(workspaceFolder, "eazyflutter_json_temp.json");
        fs.writeFileSync(tempJsonPath, jsonInput);
        console.log("Workspace Folder:", workspaceFolder);
        console.log("Models Path:", outputPath);
        console.log("Temp JSON Path:", tempJsonPath);
        try {
            await generateDartModel(tempJsonPath, className, outputPath);
            // Delete temporary json after generating model.
            fs.unlinkSync(tempJsonPath);
        }
        catch (e) {
            console.log(e);
        }
    });
    context.subscriptions.push(quicktypeCommand);
}
class WrapWithConsumerProvider {
    provideCodeActions(document, range) {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        const position = editor.selection.start;
        // Allow wrapping even if cursor is inside widget name
        if (!isCursorInsideWidget(document, position)) {
            return;
        }
        const action = new vscode.CodeAction("Wrap with Consumer<T>", vscode.CodeActionKind.Refactor);
        action.command = {
            title: "Wrap with Consumer<T>",
            command: "consumerWrapper.wrapWithConsumer",
            arguments: [document, range],
        };
        return [action];
    }
}
// Detect if cursor is inside a widget name
function isCursorInsideWidget(document, position) {
    const line = document.lineAt(position.line).text;
    const textBeforeCursor = line.substring(0, position.character);
    const textAfterCursor = line.substring(position.character);
    // Match a full widget name even if cursor is inside
    const widgetMatch = textBeforeCursor.match(/\b[A-Z][a-zA-Z0-9_]*$/) ||
        textAfterCursor.match(/^[A-Z][a-zA-Z0-9_]*/);
    return !!widgetMatch;
}
// Find full widget range to wrap
function findFullWidgetRange(document, cursorOffset) {
    const text = document.getText();
    // Move left to find the start of the widget
    let startOffset = cursorOffset;
    while (startOffset > 0 && /\w/.test(text[startOffset - 1])) {
        startOffset--;
    }
    let openBrackets = 0;
    let endOffset = cursorOffset;
    let insideString = false;
    for (let i = startOffset; i < text.length; i++) {
        const char = text[i];
        if (char === '"' || char === "'") {
            insideString = !insideString;
        }
        if (!insideString) {
            if (char === "(") {
                openBrackets++;
            }
            if (char === ")") {
                openBrackets--;
            }
        }
        if (openBrackets === 0 && char === ")") {
            endOffset = i + 1;
            break;
        }
    }
    if (openBrackets !== 0) {
        return undefined;
    }
    return new vscode.Range(document.positionAt(startOffset), document.positionAt(endOffset));
}
// Generate Dart model from JSON using quicktype
async function generateDartModel(jsonPath, className, outputPath) {
    try {
        const jsonData = fs.readFileSync(jsonPath, "utf-8");
        const jsonInput = jsonInputForTargetLanguage("dart");
        await jsonInput.addSource({ name: className, samples: [jsonData] });
        const inputData = new InputData();
        inputData.addInput(jsonInput);
        const result = await quicktype({
            inputData,
            lang: "dart",
            rendererOptions: {
                "just-types": false,
                "use-json-annotation": true,
            },
        });
        fs.writeFileSync(outputPath, result.lines.join("\n"), "utf-8");
    }
    catch (error) {
        console.error("Error generating Dart model:", error);
    }
}
// Get workspace folder
async function getWorkspaceFolder() {
    if (vscode.workspace.workspaceFolders) {
        return vscode.workspace.workspaceFolders[0].uri.fsPath;
    }
    else {
        const folderUri = await vscode.window.showOpenDialog({
            canSelectFolders: true,
            canSelectMany: false,
            openLabel: "Select Workspace Folder",
        });
        return folderUri ? folderUri[0].fsPath : "";
    }
}
// Convert class name to camelCase
function convertToCamelCase(input) {
    return input.charAt(0).toLowerCase() + input.slice(1);
}
// Convert class name to filename format
function convertClassNameToFilename(className) {
    return className.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
}
function containsModel(className) {
    return /model/i.test(className); // 'i' makes it case-insensitive
}
// Ensures `package:provider/provider.dart` is imported at the top.
/**
 * Ensures `package:provider/provider.dart` is imported at the top.
 */
function ensureProviderImport(document) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }
    const providerImport = `import 'package:provider/provider.dart';`;
    // Check if `provider.dart` is already imported
    const text = document.getText();
    if (text.includes(providerImport)) {
        return; // Already imported, do nothing
    }
    // Find first non-import line to insert the import
    const lines = text.split("\n");
    let insertPosition = 0;
    for (let i = 0; i < lines.length; i++) {
        if (!lines[i].trim().startsWith("import")) {
            insertPosition = i;
            break;
        }
    }
    const position = new vscode.Position(insertPosition, 0);
    // Insert the import statement
    editor.edit((editBuilder) => {
        editBuilder.insert(position, providerImport + "\n");
    });
}
function deactivate() { }
//# sourceMappingURL=extension.js.map