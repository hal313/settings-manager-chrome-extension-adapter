# [settings-manager-chrome-extension](https://github.com/hal313/settings-manager-chrome-extension)

> A wrapper to adapt Chrome storage sync API (for extensions) around [settings-manager](https://github.com/hal313/settings-manager).

[![Build Status](http://img.shields.io/travis/hal313/settings-manager/master.svg?style=flat-square)](https://travis-ci.org/hal313/settings-manager-chrome-extension)
[![NPM version](http://img.shields.io/npm/v/settings-manager-chrome-extension.svg?style=flat-square)](https://www.npmjs.com/package/settings-manager-chrome-extension)
[![Dependency Status](http://img.shields.io/david/hal313/settings-manager-chrome-extension.svg?style=flat-square)](https://david-dm.org/hal313/settings-manager-chrome-extension)

## Introduction
A wrapper to make the Chrome storage sync API (for extensions) compilant with the [settings-manager](https://github.com/hal313/settings-manager) API.

## Setup
```
npm install -g grunt
npm install
```

### Building
A build will generate usable artifacts in the `dist/`. Invoke a build like so:
```
npm run dist
```

### Running Tests
To run tests against the source code while watching for file changes:
```
npm run test:watch
```

To run tests against the distributable code:
```
npm run test:all
```

To run coverage reports:
```
npm run coverage
```

## API:

> new ChromeExtensionSettingsManager()

Creates a new ChromeExtensionSettingsManager instance. The instance will find `chrome` in the global namespace

> load([success][, error])

Loads the settings. Takes a success callback and an error callback. The value passed into the settings callback represents the value from the backing store.

> save(settings[, success][, error])

Saves the settings. Requires the settings to save and takes an optional callback for the success or error status.

> clear([success][, error]])

Clears the settings. Takes an optional callback for the success or error status.

# Deploying
This is a basic script which can be used to build and deploy (to NPM) the project.

```
export VERSION=0.0.16
git checkout -b release/$VERSION
npm run dist
npm version --no-git-tag-version patch
git add package*
git commit -m 'Version bump'
npx auto-changelog -p
git add CHANGELOG.md
git commit -m 'Updated changelog'
git add dist/
git commit -m 'Generated artifacts'
git checkout master
git merge --no-ff release/$VERSION
git tag -a -m 'Tagged for release' $VERSION
git branch -d release/$VERSION
git checkout develop
git merge --no-ff master
git push --all && git push --tags
```