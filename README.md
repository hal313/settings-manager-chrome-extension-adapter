# [settings-manager-chrome-extension-adapter](https://github.com/hal313/settings-manager-chrome-extension-adapter)

> A wrapper to adapt Chrome storage storage API (for extensions) to [settings-manager](https://github.com/hal313/settings-manager).

[![Build Status](http://img.shields.io/travis/hal313/settings-manager-chrome-extension-adapter/master.svg?style=flat-square)](https://travis-ci.org/hal313/settings-manager-chrome-extension-adapter)
[![NPM version](http://img.shields.io/npm/v/@hal313/settings-manager-chrome-extension-adapter.svg?style=flat-square)](https://www.npmjs.com/package/settings-manager-chrome-extension-adapter)
[![Dependency Status](http://img.shields.io/david/hal313/settings-manager-chrome-extension-adapter.svg?style=flat-square)](https://david-dm.org/hal313/settings-manager-chrome-extension-adapter)

## Introduction

A wrapper to adapt the Chrome storage API (for extensions) to the [settings-manager](https://github.com/hal313/settings-manager) API.

See an [example](https://hal313.github.io/settings-manager-example/) of the SettingsManager API with promises.

## Using

### API

> new SettingsManagerChromeExtensionAdapter([useSync][, path])

Creates a new ChromeExtensionSettingsManager instance. If `useSync` is falsey, then local storage will be used; otherwise, sync storage is used. The `path` string
specifies the key within storage.

> load()

Loads the settings. Returns a promise which resolves with the settings or rejects on failure.

> save(settings)

Saves the settings. Requires the settings to save and returns a promise which resolves on success or rejects on failure.

> clear()

Clears the settings. Returns a promise which resolves on success or rejects on failure.

### Importing

Depending on your environment, you may incorporate the SettingsManager:

| Style | File                                           | Import Statement                                                                                            | Instantiate                                                                                                                      |
| ----- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| ES5   | `SettingsManagerChromeExtensionAdapter.js`     | `<script src="SettingsManagerChromeExtensionAdapter.js"></script>`                                          | `var settingsManagerChromeExtensionAdapter = new SettingsManagerChromeExtensionAdapter.SettingsManagerChromeExtensionAdapter();` |
| CJS   | `SettingsManagerChromeExtensionAdapter.js`     | `<script src="SettingsManagerChromeExtensionAdapter.js"></script>`                                          | `var settingsManagerChromeExtensionAdapter = new SettingsManagerChromeExtensionAdapter.SettingsManager(ChromeExtensionAdapter);` |
| AMD   | `SettingsManagerChromeExtensionAdapter.js`     | `<script src="SettingsManagerChromeExtensionAdapter.js"></script>`                                          | `var settingsManagerChromeExtensionAdapter = new SettingsManagerChromeExtensionAdapter.SettingsManagerChromeExtensionAdapter();` |
| ES6   | `SettingsManagerChromeExtensionAdapter.es6.js` | `import { SettingsManagerChromeExtensionAdapter } from 'SettingsManagerChromeExtensionAdapter.js';`         | `let settingsManagerChromeExtensionAdapter = new SettingsManagerChromeExtensionAdapter();`                                       |

### Examples

The [GitHub Pages](https://hal313.github.io/settings-manager-chrome-extension-adapter/) documentation illustrates several examples.

## Developing

### Setup

```bash
npm install
```

### Building

A build will check the source code and place code in the `dist` directory.

```bash
npm run build
```

To run a build on source code changes:

```bash
npm run watch:build
```

To build distributable artifacts (which includes a minimized version):

```bash
npm run dist
```

### Running Tests

To run tests against the source code and dist folder (including coverage):

```bash
npm test
```

To run tests against the source code and dist folder (including coverage), with reload:

```bash
npm run test:watch
```

### Build a Release

This is a basic script which can be used to build and deploy (to NPM) the project.

```bash
npm run release
```

Releases to the NPM registry are handled by Travis CI. Pushing `master` to GitHub will trigger a build and deploy to the NPM registry. The release script will NOT push to the repository. When pushing, tags should be included:

```bash
git push --all && git push --tags
```
