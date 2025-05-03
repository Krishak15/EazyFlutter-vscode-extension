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
exports.WrapWithConsumerProvider = void 0;
const vscode = __importStar(require("vscode"));
const common_helpers_1 = require("../helpers/common_helpers");
class WrapWithConsumerProvider {
    provideCodeActions(document, range) {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        const position = editor.selection.start;
        // Allow wrapping even if cursor is inside widget name
        if (!(0, common_helpers_1.isCursorInsideWidget)(document, position)) {
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
exports.WrapWithConsumerProvider = WrapWithConsumerProvider;
//# sourceMappingURL=action_wrap_with_consumer.js.map