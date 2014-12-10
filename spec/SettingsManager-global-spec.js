/*global beforeEach,describe,it: true*/
/*global SettingsManager: true*/

// TODO: Also test amd and require

/**
 * @author: jghidiu
 * Date: 2014-12-08
 */

(function() {
    'use strict';

    beforeEach(function() {
        this.settingsManager = new SettingsManager();
    });

    describe('Lifecycle', function() {

        it('SettingsManager should exist as a global', function () {
            expect(SettingsManager).to.be.a('function');
        });

    });

})();
