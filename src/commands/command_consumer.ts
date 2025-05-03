import * as vscode from "vscode";
import { findFullWidgetRange } from "../helpers/common_helpers";

/// [registerCommandForConsumerQuickAction] registers the command for wrapping with Consumer
export function registerCommandForConsumerQuickAction({
  context,
  convertToCamelCase,
}: {
  context: vscode.ExtensionContext;
  convertToCamelCase: any;
}) {
  // Command for wrapping with Consumer
  const consumerCommand = vscode.commands.registerCommand(
    "consumerWrapper.wrapWithConsumer",
    async (document: vscode.TextDocument, range: vscode.Range) => {
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
        editBuilder.replace(
          range,
          `Consumer<${providerName}>(
                builder: (context, ${camelCaseProviderName}, _) {
                  return ${selectedText};
                },
              )`
        );
        ensureProviderImport(document);
      });

      // **Ensure `provider.dart` is imported**
    }
  );

  context.subscriptions.push(consumerCommand);
}


// Ensures `package:provider/provider.dart` is imported at the top.
function ensureProviderImport(document: vscode.TextDocument) {
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


