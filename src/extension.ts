import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  // Register Quick Fix for Dart files
  const provider = vscode.languages.registerCodeActionsProvider(
    "dart",
    new WrapWithConsumerProvider(),
    {
      providedCodeActionKinds: [vscode.CodeActionKind.Refactor],
    }
  );

  context.subscriptions.push(provider);

  // Register the command for wrapping with Consumer
  const disposable = vscode.commands.registerCommand(
    "consumerWrapper.wrapWithConsumer",
    async (document: vscode.TextDocument, range: vscode.Range) => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;

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
      const wrappedText = `Consumer<${providerName}>(\n  builder: (context, ${camelCaseProviderName}, _) {\n    return ${selectedText};\n  },\n)`;

      editor.edit((editBuilder) => {
        editBuilder.replace(
          editor.selection.isEmpty ? range : editor.selection,
          wrappedText
        );
      });
    }
  );

  context.subscriptions.push(disposable);
}

class WrapWithConsumerProvider implements vscode.CodeActionProvider {
  provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range
  ): vscode.ProviderResult<vscode.CodeAction[]> {
    const action = new vscode.CodeAction(
      "Wrap with Consumer<T>",
      vscode.CodeActionKind.Refactor
    );

    action.command = {
      title: "Wrap with Consumer<T>",
      command: "consumerWrapper.wrapWithConsumer",
      arguments: [document, range], // Pass range correctly
    };

    return [action];
  }
}

function convertToCamelCase(input: string): string {
  return input.charAt(0).toLowerCase() + input.slice(1);
}

export function deactivate() {}
