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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCommandForJsonConversion = registerCommandForJsonConversion;
const vscode_1 = __importDefault(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const json_convertor_1 = require("../utils/json_convertor");
const { jsonInputForTargetLanguage } = require("quicktype-core");
function registerCommandForJsonConversion({ context, findFullWidgetRange, getWorkspaceFolder, }) {
    // Register JSON to Dart command (using quicktype)
    const quicktypeCommand = vscode_1.default.commands.registerCommand("extension.jsonToDart", async () => {
        const jsonInput = await vscode_1.default.window.showInputBox({
            prompt: "Enter JSON data",
            placeHolder: '{ "name": "John", "age": 30 }',
        });
        if (!jsonInput) {
            return;
        }
        const className = await vscode_1.default.window.showInputBox({
            prompt: "Enter Dart class name",
            placeHolder: "AppUserDataModel",
        });
        if (!className) {
            return;
        }
        if (!vscode_1.default.workspace.workspaceFolders ||
            vscode_1.default.workspace.workspaceFolders.length === 0) {
            vscode_1.default.window.showErrorMessage("No workspace folder found. Open a workspace first.");
            return;
        }
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
        const outputPath = vscode_1.default.Uri.file(path.join(workspaceFolder, "lib/models", fileName)).fsPath;
        console.log("Resolved Output Path:", outputPath);
        const tempJsonPath = path.join(workspaceFolder, "eazyflutter_json_temp.json");
        fs.writeFileSync(tempJsonPath, jsonInput);
        console.log("Workspace Folder:", workspaceFolder);
        console.log("Models Path:", outputPath);
        console.log("Temp JSON Path:", tempJsonPath);
        try {
            await (0, json_convertor_1.generateDartModel)(tempJsonPath, className, outputPath, jsonInputForTargetLanguage);
            vscode_1.default.workspace
                .openTextDocument(vscode_1.default.Uri.file(outputPath))
                .then((document) => {
                vscode_1.default.window.showTextDocument(document);
            });
            // Delete temporary json after generating model.
            fs.unlinkSync(tempJsonPath);
        }
        catch (e) {
            console.log(e);
        }
    });
    context.subscriptions.push(quicktypeCommand);
}
// Convert class name to filename format
function convertClassNameToFilename(className) {
    return className.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
}
function containsModel(className) {
    return /model/i.test(className); // 'i' makes it case-insensitive
}
//# sourceMappingURL=command_json_conversion.js.map