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
exports.registerCommandForConsumerQuickAction = registerCommandForConsumerQuickAction;
const vscode = __importStar(require("vscode"));
/// [registerCommandForConsumerQuickAction] registers the command for wrapping with Consumer
function registerCommandForConsumerQuickAction({ context, convertToCamelCase, findFullWidgetRange, ensureProviderImport, }) {
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
}
//# sourceMappingURL=command_consumer.js.map