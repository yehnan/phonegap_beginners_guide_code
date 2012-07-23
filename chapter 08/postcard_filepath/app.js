var postcardTemplate = '<div class="postcard"><blockquote class="contents">' +
    '{{ text }}</blockquote><aside>{{ place }}</aside></div>';

function postcardMarkup(text, place) {
    return Mustache.to_html(postcardTemplate, {
        text: text, place: place
    });
}

function appendNewPostcard(text, place) {
    x$('#postcards-posted').top(postcardMarkup(text, place));
    bindLongTouchListener();
}

var longTouch = {
    element: null,
    since: null
}

function longTouchHandler(ele) {
    navigator.camera.getPicture(function (img) {
        try {
            x$(ele).top('<img src="' + img + '">');
        } catch(e) {
            alert(e);
        }
    }, function (e) {
        alert('camera failure!');
    }, {
        quality: 50,
        sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
        destinationType: navigator.camera.DestinationType.FILE_URI
    });
}

var touchHandlers = {
    start: function (e) {
        var now = +(new Date());
        longTouch.element = e.target;
        longTouch.since = now;
    },
    end: function (e) {
        var now = +(new Date()), duration;
        if (longTouch.element == e.target) {
            duration = now - longTouch.since;
            if (duration > 500) longTouchHandler(e.target);
            longTouch = {};
        }
    }
}

function bindLongTouchListener() {
    x$('div.postcard:first-child')
        .on('touchstart', touchHandlers.start)
        .on('touchend',   touchHandlers.end);
}

x$(document).on('DOMContentLoaded', function (e) {
    var content = 'This is a sample postcard, that I have written from sunny Vancouver.',
        location = 'Vancouver, B.C.';

    appendNewPostcard(content, location);

    x$('#newPostcard').on('submit', function () {
        handleNewPostcard();
        return false;
    });
});

function handleNewPostcard() {
    var postcardBox = x$('textarea#postcardContents')[0],
        content = postcardBox.value;

    postcardBox.blur();
    navigator.geolocation.getCurrentPosition(function (resultsObj) {
        var latlng = positionToLatLongString(resultsObj);

        getHumanLocation(latlng, function (placename) {
            appendNewPostcard(content, placename);
        });
    }, function () {
        appendNewPostcard(content, 'Terra Incognita');
    });
    postcardBox.value = '';
}

function positionToLatLongString(pos) {
    return pos.coords.latitude + ',' + pos.coords.longitude;
}

function urlForLatLong(latlng) {
    return 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + 
        latlng + '&sensor=true';
}

function getHumanLocation(latlng, callback) {
    x$().xhr(urlForLatLong(latlng), function (e) {
        var data = JSON.parse(this.responseText);

        if (data.status != "OK") {
            return callback("Terra Incognita");
        }

        var result = data.results[0],
            output,
            locality = '',
            region = '',
            country = '';

        result.address_components.forEach(function (part) {
            if (part.types.indexOf('locality') >= 0) {
               locality = part.long_name; 
            } else if (part.types.indexOf('administrative_area_level_1') >= 0) {
                region = part.short_name;
            } else if (part.types.indexOf('country') >= 0) {
                country = part.long_name;
            }
        });

        output = [locality, region, country].join(', ');

        callback(output);
    });
}

var canPrompt = true;

function shakeHandler() {
    var msg = 'Would you like to delete your last postcard?';

    if (canPrompt && confirm(msg)) {
        x$('div.postcard:first-child').remove();
    }

    canPrompt = false;

    window.setTimeout(function () {
        canPrompt = true;
    }, 5000);
}

x$(document).on('deviceready', function () {
    var previousReading = {
        x: null,
        y: null,
        z: null
    }

    navigator.accelerometer.watchAcceleration(function (reading) {
        var changes = {},
            bound = 3;

        if (previousReading.x !== null) {
            changes.x = Math.abs(previousReading.x, reading.x);
            changes.y = Math.abs(previousReading.y, reading.y);
            changes.z = Math.abs(previousReading.z, reading.z);
        }

        if (changes.x > bound && changes.y > bound && changes.z > bound) {
            shakeHandler();
        }

        previousReading = {
            x: reading.x,
            y: reading.y,
            z: reading.z
        }

	}, null, { frequency: 300 });
});
