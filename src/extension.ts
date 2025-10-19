import * as vscode from "vscode";
import { getWorkspaceFolder } from "./helpers/workspace_management";
import { registerCommandForConsumerQuickAction } from "./commands/command_consumer";
import { registerCommandForJsonConversion } from "./commands/command_json_conversion";
import { WrapWithConsumerProvider } from "./actions/action_wrap_with_consumer";
import {
  AddToArbProvider,
  registerCommandForAddToArb,
} from "./actions/action_add_to_arb";

export function activate(context: vscode.ExtensionContext) {
  // Register Wrap with Consumer Quick Fix
  const provider = vscode.languages.registerCodeActionsProvider(
    "dart",
    new WrapWithConsumerProvider(),
    {
      providedCodeActionKinds: [vscode.CodeActionKind.Refactor],
    }
  );
  context.subscriptions.push(provider);

  // Register Add to .arb Quick Fix
  const addToArbProvider = vscode.languages.registerCodeActionsProvider(
    "dart",
    new AddToArbProvider(),
    {
      providedCodeActionKinds: [vscode.CodeActionKind.QuickFix],
    }
  );
  context.subscriptions.push(addToArbProvider);

  registerCommandForAddToArb(context);

  /// [registerCommandForConsumerQuickAction] registers the command for wrapping with Consumer
  registerCommandForConsumerQuickAction({
    context,
    convertToCamelCase,
  });

  // Register JSON to Dart command (using quicktype)
  registerCommandForJsonConversion({
    context,
    getWorkspaceFolder,
  });
}

// Convert class name to camelCase
function convertToCamelCase(input: string): string {
  return input.charAt(0).toLowerCase() + input.slice(1);
}

export function deactivate() {}
