var screens = ['red', 'green', 'refactor'];
var hasHardwareAcceleration = false;

document.addEventListener('click', function (evt) {
    if (evt.target.getAttribute('class') == 'screen') {
        var oldScreenEle = evt.target;
        var oldScreen = oldScreenEle.id;
        var newScreen, newScreenEle;

        screens.forEach(function (screenId, i) {
            if (screenId == oldScreen) {
                if ((i+1)<screens.length) {
                    newScreen = screens[i+1];
                } else {
                    newScreen = screens[0];
                }
                newScreenEle = document.getElementById(newScreen);
            }
        });

		if (hasHardwareAcceleration) {
		    newScreenEle.style.webkitTransform = 'translate(0px,0px)';
		    oldScreenEle.style.webkitTransform = 'translate(-320px,0px)';
		} else {
		    newScreenEle.style.display = 'block';
		    oldScreenEle.style.display = 'none';
		}
    }
});

document.addEventListener('DOMContentLoaded', function () {
    hasHardwareAcceleration = !!(navigator.userAgent.match("iPhone"));
    function emptyClicker() {};

    screens.forEach(function (screenId) {
        var screenEle = document.getElementById(screenId);
        if (!hasHardwareAcceleration) {
            screenEle.style.webkitTransform = 'translate(0px,0px)';
            if (screenId != 'red') {
                screenEle.style.display = 'none';
            }
        }
        screenEle.addEventListener('click', emptyClicker);
    });
});
