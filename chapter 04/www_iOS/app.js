var screens = ['red', 'green', 'refactor'];

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
		
		newScreenEle.style.webkitTransform = 'translate(0px,0px)';
		oldScreenEle.style.webkitTransform = 'translate(-320px,0px)';
    }
});

document.addEventListener('DOMContentLoaded', function () {
    function emptyClicker() {};

    screens.forEach(function (screenId) {
        document.getElementById(screenId).addEventListener('click', emptyClicker);
    });
});
