(function() {
    var Battery = function() {
        return {
            get: function(property, successCallback, errorCallback) {
                PhoneGap.exec(successCallback, errorCallback, 'Battery', 'get', [ property ]);
            }
        }
    };

    PhoneGap.addConstructor(function() {
        // add plugin to window.plugins
        PhoneGap.addPlugin('battery', new Battery());

        // register plugin on native side
        phonegap.PluginManager.addPlugin('Battery', 'com.phonegap.plugins.Battery');
    });
})();
