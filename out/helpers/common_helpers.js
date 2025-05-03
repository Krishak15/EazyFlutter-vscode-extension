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
exports.findFullWidgetRange = findFullWidgetRange;
exports.isCursorInsideWidget = isCursorInsideWidget;
const vscode = __importStar(require("vscode"));
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
//# sourceMappingURL=common_helpers.js.map