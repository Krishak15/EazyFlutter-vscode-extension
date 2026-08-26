import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

/// [registerCommandForNewDartFile] registers the command for creating a new
/// Dart file from the Explorer's right-click context menu.
export function registerCommandForNewDartFile({
    context,
}: {
    context: vscode.ExtensionContext;
}) {
    const newDartFileCommand = vscode.commands.registerCommand(
        "eazyflutter.newDartFile",
        async (uri: vscode.Uri) => {
            let targetFolder: string | undefined = uri?.fsPath;

            if (!targetFolder) {
                const selectedPath = await getSelectedExplorerPath();
                if (selectedPath && fs.existsSync(selectedPath)) {
                    targetFolder = fs.statSync(selectedPath).isDirectory()
                        ? selectedPath
                        : path.dirname(selectedPath);
                }
            }

            if (!targetFolder) {
                vscode.window.showErrorMessage(
                    "Select a folder in the Explorer first, then try again."
                );
                return;
            }

            const rawName = await vscode.window.showInputBox({
                prompt: "Enter the new Dart file name",
                placeHolder: "my_widget",
                validateInput: (value) => {
                    if (!value || value.trim() === "") { return "Filename cannot be empty"; }
                    if (/[\\/:*?"<>|]/.test(value)) { return "Invalid file name"; }
                    return null;
                },
            });

            if (!rawName) {
                return;
            }

            const fileName = rawName.trim().endsWith(".dart")
                ? rawName.trim()
                : `${toSnakeCase(rawName)}.dart`;

            const targetPath = path.join(targetFolder, fileName);

            if (fs.existsSync(targetPath)) {
                vscode.window.showErrorMessage(`${fileName} already exists.`);
                return;
            }

            const className = toPascalCase(fileName.replace(".dart", ""));
            const content = `class ${className} {}`;

            fs.writeFileSync(targetPath, content, "utf8");

            const document = await vscode.workspace.openTextDocument(
                vscode.Uri.file(targetPath)
            );
            await vscode.window.showTextDocument(document);
        }
    );

    context.subscriptions.push(newDartFileCommand);
};

async function getSelectedExplorerPath(): Promise<string | undefined> {
    const previousClipboard = await vscode.env.clipboard.readText();
    try {
        await vscode.commands.executeCommand("copyFilePath");
        const copiedPath = (await vscode.env.clipboard.readText()).trim();
        return copiedPath.split("\n")[0]; // first line if multiple items selected
    } finally {
        await vscode.env.clipboard.writeText(previousClipboard);
    }
}

function toSnakeCase(input: string): string {
    return input
        .trim()
        .replace(/([a-z])([A-Z])/g, "$1_$2")
        .replace(/[\s-]+/g, "_")
        .toLowerCase();
}
function toPascalCase(input: string) {
    return input
        .split(/[_\-\s]+/)
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join("");
}

