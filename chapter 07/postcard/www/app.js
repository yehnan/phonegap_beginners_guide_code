var postcardTemplate = '<div class="postcard"><blockquote id="contents">' +
    '{{ text }}</blockquote><aside>{{ place }}</aside></div>';
function postcardMarkup(text, place) {
    return Mustache.to_html(postcardTemplate, {
        text: text, place: place
    });
}
function appendNewPostcard(text, place) {
    x$('#postcards-posted').top(postcardMarkup(text, place));
}

x$(document).on('DOMContentLoaded', function (e) {
    var content = 'This is a sample postcard, that I have written from sunny Vancouver.',
        location = 'Vancouver, B.C.';
    appendNewPostcard(content, location);
});

function handleNewPostcard() {
    var postcardBox = x$('textarea#postcardContents')[0],
        content = postcardBox.value;
    postcardBox.blur();
    navigator.geolocation.getCurrentPosition(function (resultsObj) 
    {
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

