# EazyFlutter - VS Code Extension for Flutter Development

EazyFlutter is a powerful VS Code extension designed to streamline Flutter development by offering quick actions, intelligent widget wrappers, and useful snippets. This extension simplifies common tasks such as wrapping widgets with `Consumer<T>`, generating getter and setter methods, and converting JSON data into Dart models using `json_serializable`.

## Features

### Commands

- **JSON to Dart Conversion** - Convert JSON input into a structured Dart model with `json_serializable`, automatically saving it in the appropriate folder.
- **Wrap with Consumer<T>** - A quick action available in the bulb menu that wraps widgets with a `Consumer<T>` for Provider-based state management.

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

- Hover over a widget in your Dart file.
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
2. Search for **"Convert JSON to Dart"**.
3. Enter your JSON data.
4. Provide a **class name** for the generated model.
5. The extension will:
   - Generate a Dart model with `json_serializable` annotations.
   - Save the file in `lib/models/{class_name}.dart`.
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

Currently, no additional configuration is required.

## Additional Resources

- [Flutter Consumer Documentation](https://pub.dev/documentation/provider/latest/provider/Consumer-class.html)
- [json_serializable Documentation](https://pub.dev/packages/json_serializable)
- [VS Code Extension API](https://code.visualstudio.com/api)
- [QuickType Module](https://www.npmjs.com/package/quicktype)

Enhance your Flutter development experience with **EazyFlutter** – making widget wrapping, state management, and JSON handling effortless!
