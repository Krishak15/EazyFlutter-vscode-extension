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
exports.AddToArbProvider = void 0;
exports.registerCommandForAddToArb = registerCommandForAddToArb;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const workspace_management_1 = require("../helpers/workspace_management");
function toCamelCase(str) {
    return str
        .replace(/[^a-zA-Z0-9 ]/g, "")
        .replace(/(?:^|\s)([a-zA-Z])/g, (_, c) => c.toUpperCase())
        .replace(/\s+/g, "")
        .replace(/^./, (c) => c.toLowerCase());
}
function isEnglishArb(filename) {
    return /app_en\.arb|english\.arb|en\.arb/i.test(filename);
}
class AddToArbProvider {
    provideCodeActions(document, range) {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        const selectedText = editor.document.getText(editor.selection).trim();
        if (!selectedText || selectedText.length < 2) {
            return;
        }
        const action = new vscode.CodeAction("Add to .arb localization files", vscode.CodeActionKind.QuickFix);
        action.command = {
            title: "Add to .arb localization files",
            command: "eazyflutter.addToArb",
            arguments: [selectedText],
        };
        return [action];
    }
}
exports.AddToArbProvider = AddToArbProvider;
function registerCommandForAddToArb(context) {
    const disposable = vscode.commands.registerCommand("eazyflutter.addToArb", async (selectedText) => {
        const workspaceFolder = await (0, workspace_management_1.getWorkspaceFolder)();
        if (!workspaceFolder) {
            vscode.window.showErrorMessage("No workspace folder found.");
            return;
        }
        // Find all .arb files
        const arbFiles = [];
        function walk(dir) {
            if (!fs.existsSync(dir)) {
                return;
            }
            for (const file of fs.readdirSync(dir)) {
                const fullPath = path.join(dir, file);
                if (fs.statSync(fullPath).isDirectory()) {
                    walk(fullPath);
                }
                else if (file.endsWith(".arb")) {
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
            let englishJson = {};
            try {
                englishJson = JSON.parse(fs.readFileSync(arb, "utf8"));
            }
            catch {
                englishJson = {};
            }
            englishJson[key] = selectedText;
            fs.writeFileSync(arb, JSON.stringify(englishJson, null, 2));
        }
        // Add empty value to other .arb files
        for (const arb of otherArbs) {
            let json = {};
            try {
                json = JSON.parse(fs.readFileSync(arb, "utf8"));
            }
            catch {
                json = {};
            }
            json[key] = "";
            fs.writeFileSync(arb, JSON.stringify(json, null, 2));
        }
        // Replace selected string in code with the key
        const editor = vscode.window.activeTextEditor;
        if (editor && !editor.selection.isEmpty) {
            await editor.edit((editBuilder) => {
                editBuilder.replace(editor.selection, key);
            });
        }
        vscode.window.showInformationMessage(`Added "${selectedText}" to localization files as "${key}" and replaced in code.`);
    });
    context.subscriptions.push(disposable);
}
//# sourceMappingURL=action_add_to_arb.js.map