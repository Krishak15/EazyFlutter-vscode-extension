# EazyFlutter - Flutter Widget Wrappers & Snippets

EazyFlutter is a VS Code extension that enhances Flutter development by providing quick actions (bulb menu) and snippets to streamline common widget-wrapping tasks. Additionally, it includes a **JSON to Dart** converter that automatically generates Dart models with `json_serializable`.

## Features

- **Wrap with Consumer<T>** - Quickly wrap a widget with `Consumer<T>` without manually typing the structure.
- **Auto Variable Naming** - Converts `ProviderType` to a lower camel case variable (e.g., `AppUserManagementProvider` → `appUserManagementProvider`).
- **Works via Quick Fix & Snippets** - Use **Cmd + .** (Mac) / **Ctrl + .** (Windows) or snippets for fast wrapping.
- **Snippets for Speed** - Type `wrapConsumer` + `Tab` to insert a `Consumer<T>` block instantly.
- **JSON to Dart Conversion** - Convert JSON input into a Dart model using `json_serializable` and save it in the `lib/models` folder automatically.

## Installation

1. Open **VS Code**.
2. Go to the **Extensions Marketplace** (`Cmd + Shift + X` / `Ctrl + Shift + X`).
3. Search for **"EazyFlutter"** and click **Install**.
4. You're ready to go.

## How to Use?

### Wrap Any Widget with `Consumer<T>` (Quick Fix)

- Hover over a widget.
- Press **`Cmd + .`** (Mac) / **`Ctrl + .`** (Windows).
- Click **"Wrap with Consumer<T>"** in the Quick Fix menu.
- Enter the **Provider Type**, and it automatically wraps the widget.

#### Example:
Before wrapping:
```dart
Text('Hello World')
```
After wrapping with **EazyFlutter**:
```dart
Consumer<AppUserManagementProvider>(
  builder: (context, appUserManagementProvider, _) {
    return Text('Hello World');
  },
)
```

### Use Snippets for Faster Wrapping

1. Type **`wrapConsumer`** inside your Dart file.
2. Press **Tab**, and it will generate:
```dart
Consumer<ProviderType>(
  builder: (context, provider, _) {
    return ChildWidget();
  },
)
```
3. Replace `ProviderType` with your actual provider (e.g., `AuthProvider`).

### JSON to Dart Conversion

1. Open the command palette (`Cmd + Shift + P` / `Ctrl + Shift + P`).
2. Search for **"Convert JSON to Dart"**.
3. Enter your JSON input.
4. Specify a **class name** for the Dart model.
5. The extension will:
   - Generate a Dart model with `json_serializable`.
   - Save it in `lib/models/{class_name}.dart`.
   - Ensure proper error handling and formatting.

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

This extension currently does not require any additional settings.

## Additional Resources

- [Flutter Consumer Documentation](https://pub.dev/documentation/provider/latest/provider/Consumer-class.html)
- [json_serializable Documentation](https://pub.dev/packages/json_serializable)
- [VS Code Extension API](https://code.visualstudio.com/api)
- [QuickType Module](https://www.npmjs.com/package/quicktype)

