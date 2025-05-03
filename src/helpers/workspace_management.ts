import * as vscode from "vscode";

// Get workspace folder
export async function getWorkspaceFolder() {
  if (vscode.workspace.workspaceFolders) {
    return vscode.workspace.workspaceFolders[0].uri.fsPath;
  } else {
    const folderUri = await vscode.window.showOpenDialog({
      canSelectFolders: true,
      canSelectMany: false,
      openLabel: "Select Workspace Folder",
    });
    return folderUri ? folderUri[0].fsPath : "";
  }
}