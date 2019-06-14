// The script is loaded already

// Create the adapter
var settingsManagerChromeExtensionAdapter = new SettingsManagerChromeExtensionAdapter.SettingsManagerChromeExtensionAdapter();
// Create the settings manager instance
var settingsManager = new SettingsManager.SettingsManager(settingsManagerChromeExtensionAdapter);

// Start with a load
settingsManager.load(function onLoad(settings) {
    // Handle the load response and start a save
    onSettingsLoaded(settings);
    settingsManager.save({one: 1, two: 'two'}, function onSave() {
        // Handle the save response and start another load
        onSettingsSaved();
        settingsManager.load(function onLoad(settings) {
            // Handle the load response and start another save
            onSettingsLoaded(settings);
            settingsManager.save({three: 3, two: 2}, function onSave() {
                // Handle the save response and start another load
                onSettingsSaved();
                settingsManager.load(function onLoad(settings) {
                    // Handle the load response
                    onSettingsLoaded(settings);
                }, onError);
            }, onError);
        }, onError);
    }, onError);
}, onError);


// The results element
var resultsElement = document.getElementById('js-results-section');
// Handlers
function onSettingsLoaded(settings) {
    let element = document.createElement('code');
    element.append(document.createTextNode(`loaded: ${JSON.stringify(settings, null, 2)}\n`));
    resultsElement.append(element);
}
function onSettingsSaved() {
    let element = document.createElement('code');
    element.append(document.createTextNode(`saved\n`));
    resultsElement.append(element);
}
function onError(error) {
    let element = document.createElement('code');
    element.append(document.createTextNode(`error: ${error}\n`));
    resultsElement.append(element);
}
