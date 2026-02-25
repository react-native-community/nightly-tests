# Patch Instructions

This guide covers how to generate a patch file for your libraries. This is helpful in cases where you need to edit pod files, manifest files, etc.

## How to Generate a Patch File

### Step 1: Create a New Project

Clone this repository, then create a new project with the following command:

```sh
npx @react-native-community/cli@latest init RNApp --version nightly --skip-install --directory tmp/RNApp
```

### Step 2: Navigate to the Directory

```sh
cd tmp/RNApp
```

### Step 3: Make Necessary Changes

Make the necessary changes to the template.

### Step 4: Generate the Patch File

```sh
node ../../scripts/make-patch.js ../../patches/{libraryName}.patch
```

For example:

```sh
node ../../scripts/make-patch.js ../../patches/react-native-turbo-encryption.patch
```

This will generate a patch file in the `patches` folder.

**Note:** Remove any lock files like `yarn.lock`, `Podfile.lock`, or any generated files that are tracked before generating the patch file, as these can lead to an excessively long patch file.

### Step 5: Verify the Patch File

```sh
node ../../scripts/apply-patch.js ../../patches/{libraryName}.patch
```

For example:

```sh
node ../../scripts/apply-patch.js ../../patches/react-native-turbo-encryption.patch
```

### Step 6: Add the Patch File to `libraries.json`

```jsonc
"react-native-reanimated": {
  "description": "React Native's Animated library reimplemented",
  "installCommand": "react-native-reanimated@nightly react-native-worklets@nightly",
  "android": true,
  "ios": true,
  "maintainersUsernames": [],
  "notes": "",
  "patchFile": "patches/reanimated.patch" # <-- Path to patch file
}
```

### Step 7: Submit Your Changes

Push the changes and create a pull request. Your patch file is ready!
