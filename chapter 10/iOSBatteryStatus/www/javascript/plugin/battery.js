var Battery = function() {
    return {
        get: function(property, successCallback, errorCallback) {
            PhoneGap.exec(successCallback, errorCallback,  
            'Battery', 'get', [ property ]);
        }
    }
};
PhoneGap.addConstructor(function() {
    if (!window.plugins) window.plugins = {};
    window.plugins.battery = new Battery();
});
