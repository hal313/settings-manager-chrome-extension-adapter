/*global beforeEach,describe,it: true*/
/*global ChromeExtensionSettingsManager: true*/

/**
 * @author: jghidiu
 * Date: 2014-12-08
 */

(function() {
    'use strict';

    beforeEach(function() {
        this.chromeExtensionSettingsManager = new ChromeExtensionSettingsManager();
    });

    describe('Lifecycle', function() {

        it('ChromeExtensionSettingsManager should exist as a global', function () {
            expect(ChromeExtensionSettingsManager).to.be.a('function');
        });

    });

})();
