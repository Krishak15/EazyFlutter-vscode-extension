
import * as vscode from "vscode";

// Find full widget range to wrap
export function findFullWidgetRange(
  document: vscode.TextDocument,
  cursorOffset: number
): vscode.Range | undefined {
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

  return new vscode.Range(
    document.positionAt(startOffset),
    document.positionAt(endOffset)
  );
}


 // Detect if cursor is inside a widget name
 export function isCursorInsideWidget(
  document: vscode.TextDocument,
  position: vscode.Position
): boolean {
  const line = document.lineAt(position.line).text;
  const textBeforeCursor = line.substring(0, position.character);
  const textAfterCursor = line.substring(position.character);

  // Match a full widget name even if cursor is inside
  const widgetMatch =
    textBeforeCursor.match(/\b[A-Z][a-zA-Z0-9_]*$/) ||
    textAfterCursor.match(/^[A-Z][a-zA-Z0-9_]*/);

  return !!widgetMatch;
}

