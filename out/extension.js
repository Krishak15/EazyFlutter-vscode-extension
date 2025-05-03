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
const workspace_management_1 = require("./helpers/workspace_management");
const command_consumer_1 = require("./commands/command_consumer");
const command_json_conversion_1 = require("./commands/command_json_conversion");
const action_wrap_with_consumer_1 = require("./actions/action_wrap_with_consumer");
function activate(context) {
    // Register Wrap with Consumer Quick Fix
    const provider = vscode.languages.registerCodeActionsProvider("dart", new action_wrap_with_consumer_1.WrapWithConsumerProvider(), {
        providedCodeActionKinds: [vscode.CodeActionKind.Refactor],
    });
    context.subscriptions.push(provider);
    /// [registerCommandForConsumerQuickAction] registers the command for wrapping with Consumer
    (0, command_consumer_1.registerCommandForConsumerQuickAction)({
        context,
        convertToCamelCase,
    });
    // Register JSON to Dart command (using quicktype)
    (0, command_json_conversion_1.registerCommandForJsonConversion)({
        context,
        getWorkspaceFolder: workspace_management_1.getWorkspaceFolder,
    });
}
// Convert class name to camelCase
function convertToCamelCase(input) {
    return input.charAt(0).toLowerCase() + input.slice(1);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map