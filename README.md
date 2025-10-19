# EazyFlutter - VS Code Extension for Flutter Development

EazyFlutter is a powerful VS Code extension designed to streamline Flutter development by offering quick actions, intelligent widget wrappers, and useful snippets. This extension simplifies common tasks such as wrapping widgets with `Consumer<T>`, generating getter and setter methods, and converting JSON data into Dart models using `json_serializable`.

## Features

### Localization Quick Fix (l10n)

#### Add Strings to .arb Localization Files

EazyFlutter makes it easy to manage your Flutter localization workflow:

1. **Select a String**: Highlight any string literal in your Dart code that you want to localize.
2. **Trigger the Quick Fix**: Press **Cmd+.** (Mac) or **Ctrl+.** (Windows/Linux) to open the light bulb menu, then select **"Add to .arb localization files"**.
3. **Automatic Key Generation**: The extension generates a camelCase key from your string (e.g., `"This is a sample"` → `thisIsASample`).
4. **.arb File Management**:
   - If English .arb file(s) exist (e.g., `app_en.arb`, `english.arb`, `en.arb`), the key and value are added there:  
     `"thisIsASample": "This is a sample"`
   - In other .arb files, the key is added with an empty value:  
     `"thisIsASample": ""`
   - If no .arb files exist, a `lib/l10n/app_en.arb` file is created automatically.
5. **Code Replacement**: The selected string in your Dart code is replaced with the generated key, optionally prefixed (see below).
6. **l10n Generation (Optional)**: If enabled, the extension will automatically run the correct localization generation command after updating .arb files (see below).

#### Example Workflow

Suppose you have this code:

```dart
Text('You have reached your contact view limit')
```

After using the Quick Fix, your `app_en.arb` will have:

```json
{
  "youHaveReachedYourContactViewLimit": "You have reached your contact view limit"
}
```

And your Dart code will be updated to:

```dart
Text(AppLocalizations.of(context).youHaveReachedYourContactViewLimit)
```

_(Prefix is configurable, see below)_

#### Configuration Options

- **Localization Key Prefix**: In VS Code settings, search for `EazyFlutter: Localization Key Prefix`. Set this to the prefix you want before the key in your code (e.g., `AppLocalizations.of(context).` or `Localizations.locale.`). Leave blank for just the key.

- **Auto L10n Generate**: Enable `EazyFlutter: Auto L10n Generate` to automatically run the correct localization generation command after .arb updates:
  - If your project uses FVM (detected by a `fvm` or `.fvm` directory), the extension runs:
    ```sh
    fvm flutter gen-l10n
    ```
  - Otherwise, it runs:
    ```sh
    flutter gen-l10n
    ```
  - The command is executed in a new VS Code terminal named "EazyFlutter l10n".

#### Why Use This?

- **No more manual .arb editing**: Add and sync translations with a single action.
- **Consistent key naming**: Keys are generated in camelCase from your strings.
- **Flexible code integration**: Use any localization prefix pattern your project requires.
- **Automated l10n workflow**: Keep your generated Dart localization files up to date with zero hassle.

### Commands

- **JSON to Dart Conversion** - Convert JSON input into a structured Dart model with `json_serializable`, automatically saving it in the model folder (You can move it to your desired directory after).
- **Wrap with Consumer<T>** - A quick action is available that wraps widgets with a `Consumer` for Provider-based state management.

### Snippets

- **Wrap with Consumer<T>** - Insert a `Consumer<T>` block instantly using a snippet.
- **Generate Getters and Setters** - Quickly create getter and setter methods for multiple data types, improving code efficiency.

## Installation

1. Open **VS Code**.
2. Navigate to the **Extensions Marketplace** (`Cmd + Shift + X` / `Ctrl + Shift + X`).
3. Search for **"EazyFlutter"** and click **Install**.
4. The extension is now ready for use.

## How to Use

### Wrap a Widget with `Consumer<T>` (Quick Fix)

- Select a widget in your Dart file.
- Press **`Cmd + .`** (Mac) / **`Ctrl + .`** (Windows).
- Select **"Wrap with Consumer<T>"**.
- Enter the **Provider Type**, and the extension automatically wraps the widget.

#### Example:

**Before:**

```dart
Text('Hello World')
```

**After:**

```dart
Consumer<AppUserManagementProvider>(
  builder: (context, appUserManagementProvider, _) {
    return Text('Hello World');
  },
)
```

### Using Snippets

#### Wrap with `Consumer<T>`

1. Type **`wrapConsumer`** inside your Dart file.
2. Press **Tab**, and it expands into:

```dart
Consumer<ProviderType>(
  builder: (context, provider, _) {
    return ChildWidget();
  },
)
```

3. Replace `ProviderType` with the actual provider class (e.g., `AuthProvider`).

#### Generate Getters and Setters

- Use snippets to create getter and setter methods for multiple data types, reducing manual coding effort.

##### Example:

**Before:**

```dart
String _name;
```

**After using snippet:**

`getSetString` then Enter

Result

```dart
String _name;

String get name => _name;

set name(String value) {
  _name = value;
}
```

### JSON to Dart Conversion

1. Open the command palette (`Cmd + Shift + P` / `Ctrl + Shift + P`).
2. Search for **"EazyFlutter: JSON to Dart"**.
3. Enter your JSON data.
4. Provide a **Class name** for the generated model.
5. The extension will:
   - Generate a Dart model with `json_serializable` annotations.
   - Save the file in `lib/models/`.
   - Ensure proper formatting and error handling.

#### Example:

**Input JSON:**

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Generated Dart Model:**

```dart
import 'package:json_annotation/json_annotation.dart';

part 'user_model.g.dart';

@JsonSerializable()
class UserModel {
  final int id;
  final String name;
  final String email;

  UserModel({required this.id, required this.name, required this.email});

  factory UserModel.fromJson(Map<String, dynamic> json) => _$UserModelFromJson(json);
  Map<String, dynamic> toJson() => _$UserModelToJson(this);
}
```

## Extension Settings

### Localization Settings

- **Localization Key Prefix**: Configure a prefix to use before the key when replacing in code (e.g., `Applocalization.locale.`).
- **Auto L10n Generate**: Enable to automatically run the correct localization generation command after .arb updates. The extension detects FVM and uses `fvm flutter gen-l10n` if available, otherwise `flutter gen-l10n`.

## Additional Resources

- [Flutter Consumer Documentation](https://pub.dev/documentation/provider/latest/provider/Consumer-class.html)
- [json_serializable Documentation](https://pub.dev/packages/json_serializable)
- [VS Code Extension API](https://code.visualstudio.com/api)
- [QuickType Module](https://www.npmjs.com/package/quicktype)

Enhance your Flutter development experience with **EazyFlutter** – making widget wrapping, state management, and JSON handling effortless!
