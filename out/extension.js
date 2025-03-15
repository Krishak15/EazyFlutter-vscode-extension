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
function activate(context) {
    // Register Quick Fix for Dart files
    const provider = vscode.languages.registerCodeActionsProvider("dart", new WrapWithConsumerProvider(), {
        providedCodeActionKinds: [vscode.CodeActionKind.Refactor],
    });
    context.subscriptions.push(provider);
    // Register the command for wrapping with Consumer
    const disposable = vscode.commands.registerCommand("consumerWrapper.wrapWithConsumer", async (document, range) => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        let selectedText = editor.document.getText(editor.selection);
        // If no explicit selection, use the hovered range
        if (!selectedText && range) {
            selectedText = document.getText(range);
        }
        if (!selectedText) {
            vscode.window.showErrorMessage("No widget selected.");
            return;
        }
        // Ask user for the Provider type
        const providerName = await vscode.window.showInputBox({
            prompt: "Enter Provider Type (e.g., AppUserManagementProvider)",
            placeHolder: "ProviderType",
        });
        if (!providerName) {
            vscode.window.showErrorMessage("Provider type is required!");
            return;
        }
        const camelCaseProviderName = convertToCamelCase(providerName);
        // Wrap the widget
        const wrappedText = `Consumer<${providerName}>(\n  builder: (context, ${camelCaseProviderName}, _) {\n    return ${selectedText};\n  },\n  child: Consumer<${providerName}>(\n    builder: (context, ${camelCaseProviderName}, _) {\n    return ${selectedText};\n  },\n)`;
        editor.edit((editBuilder) => {
            editBuilder.replace(editor.selection.isEmpty ? range : editor.selection, wrappedText);
        });
    });
    context.subscriptions.push(disposable);
}
class WrapWithConsumerProvider {
    provideCodeActions(document, range) {
        const action = new vscode.CodeAction("Wrap with Consumer<T>", vscode.CodeActionKind.Refactor);
        action.command = {
            title: "Wrap with Consumer<T>",
            command: "consumerWrapper.wrapWithConsumer",
            arguments: [document, range], // Pass range correctly
        };
        return [action];
    }
}
function convertToCamelCase(input) {
    return input.charAt(0).toLowerCase() + input.slice(1);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map