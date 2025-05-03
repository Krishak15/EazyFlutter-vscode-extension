import * as vscode from "vscode";
import { isCursorInsideWidget } from "../helpers/common_helpers";
export class WrapWithConsumerProvider implements vscode.CodeActionProvider {
  provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range
  ): vscode.ProviderResult<vscode.CodeAction[]> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    const position = editor.selection.start;

    // Allow wrapping even if cursor is inside widget name
    if (!isCursorInsideWidget(document, position)) {
      return;
    }

    const action = new vscode.CodeAction(
      "Wrap with Consumer<T>",
      vscode.CodeActionKind.Refactor
    );

    action.command = {
      title: "Wrap with Consumer<T>",
      command: "consumerWrapper.wrapWithConsumer",
      arguments: [document, range],
    };

    return [action];
  }
}