# EazyFlutter Extension Development

## Project structure

- `package.json` contains the extension manifest, commands, settings, snippets, and scripts.
- `src/extension.ts` activates the extension and registers its commands and code actions.
- `src/commands/` contains command implementations such as JSON conversion and Dart file creation.
- `src/actions/` contains Dart code actions such as localization and `Consumer<T>` wrapping.
- `snippets/dart-snippets.json` contains the Dart snippets contributed by the extension.

## Get up and running

1. Run `npm install` to install dependencies.
2. Press `F5` to open a new Extension Development Host window.
3. Test the commands and code actions in a Dart or Flutter workspace.

The extension contributes these commands:

- **EazyFlutter: JSON to Dart** from the Command Palette.
- **EazyFlutter: New Dart File** from a folder's Explorer context menu.
- **Wrap with Consumer<T>** from the Dart editor code action menu.

## Build and lint

Run the following commands from the project root:

```sh
npm run compile
npm run lint
```

Use `npm run watch` during development to recompile TypeScript as files change.

## Run tests

Run `npm test` to compile the extension and launch the VS Code extension test runner. The test files are located in `src/test/`.

## Further reading

- [VS Code Extension API](https://code.visualstudio.com/api)
- [Extension manifest reference](https://code.visualstudio.com/api/references/extension-manifest)
- [Publishing extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
