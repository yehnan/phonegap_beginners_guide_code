    var aFoodDetail = {
       foodName: "cereal",
       timeOfDay: function () {
            return this.foodName.length > 7 ? "evening" : "morning";
       }
    }
    var storedTemplate = null;

    function renderOurTemplate(view, callback) {
        function doRender(template, view) {
            callback(Mustache.to_html(template, view))
        }

        if (storedTemplate) {
            doRender(storedTemplate, view);
        } else {
            var req = new XMLHttpRequest();
            req.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200 || this.status == 0) {
                        storedTemplate = this.responseText;
                        doRender(storedTemplate, view);
                    } else {
                        console.log("something went wrong");
                    }
                }
            }
            req.open("GET", "food_detail.mustache", true);
            req.send();
        }
    }

    // performs a get request for url
    // passes the response text to callback
    function getXHR(url, callback) {
        var req = new XMLHttpRequest();
        req.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200 || this.status == 0) {
                    callback(this.responseText);
                } else {
                    console.log('something went wrong');
                }
            }
        }
        req.open('GET', url, true);
        req.send();
    }

    function parseAndLog(JSONstring) {
        var JSONobj = JSON.parse(JSONstring);
    }

    function getLatestResult(JSONstring) {
        var twitterPayload = JSON.parse(JSONstring);
        var latestResult = twitterPayload.results[0];

        return latestResult;
    }

    document.addEventListener("DOMContentLoaded", function () {
        var foodList = document.getElementById('foodList');
        var foodField = document.getElementById('foodName');
        var l = window.localStorage.length;
        var i = 0;
        var storedFoodName;

        var defaultStyle = {
            'font-weight': '',
            'color': ''
        }

        function addNewFoodItem(foodName, foodKey) {
            x$('#foodList').bottom('<li id="' + foodKey+ '">' 
                + foodName + ' <span class="deleter"></span></li>');
            x$('li:last-child').css({
                'font-weight': 'bold',
                'color': 'white'
            });
            x$('li:nth-last-of-type(n+2)').css(defaultStyle);

            aFoodDetail.foodName = foodName;
            renderOurTemplate(aFoodDetail, function (markup) {
                x$("#foodDescription").inner(markup);
            });
        }

        for (i; i < l; i++) {
            storedFoodName = window.localStorage.key(i);
            if (storedFoodName.match(/^food[.]/))
                addNewFoodItem(window.localStorage.getItem(storedFoodName), storedFoodName);
        }
        x$('li').css(defaultStyle);
        drawDashboard(x$('li').length);

        x$("#foodForm").on("submit", function (evt) {
            evt.preventDefault();
            var newFood = foodField.value;
            var foodKey = "food." + (window.localStorage.length + 1);

            if (isFruit(newFood)) {
               showAndPlayVideo();
            } else {
                addNewFoodItem(newFood, foodKey);
                drawDashboard(x$('li').length);
                window.localStorage.setItem(foodKey, newFood);
            }

            foodField.value = "";
            return false;
        });

        var scroller = new iScroll('foodList');
    });

    x$(document).on("click", function (evt) {
        if (evt.target.tagName == "LI") {
            var foodSubject = evt.target.innerText;
            var foodSearch = encodeURIComponent(foodSubject);
            var twitterUrl = "http://search.twitter.com/search.json?q=" + foodSearch;

            getXHR(twitterUrl, function (response) {
                var latestTweet = getLatestResult(response);
                showTweetModal(latestTweet, foodSubject);
            })
        } else if (x$(evt.target).hasClass('deleter')) {
            var listIem = x$(evt.target.parentNode);
            var storageKey = listIem[0].id;

            listIem.remove();
            window.localStorage.removeItem(storageKey);
            drawDashboard(x$('li').length);
        } else if (evt.target.id == "modal") {
            hideTweetModal();
        }
    }, false);

    function showTweetModal(tweetObject, searchTerm) {
        x$("#modal #search_term").inner(searchTerm);
        x$("#modal #tweet").inner(tweetObject.text);
        x$("#modal #author").inner(tweetObject.from_user);

        x$("#modal").css({
            "-webkit-transform":"translate3d(0,0,0)",
            "-webkit-transition-timing-function":"ease-in"
        });
    }

    function hideTweetModal() {
        x$("#modal").css({
            "-webkit-transform":"translate3d(0,600px,0)",
            "-webkit-transition-timing-function":"ease-out"
        });
    }

    function isFruit(foodName) {
        var fruits = ['apple','orange','peach','raspberry'];
        var i = 0;

        for (i; i<fruits.length; i++)
            if (fruits[i]==foodName) return true;

        return false;
    }

    var videoTag = '<video id="sampleVideo" width="240" height="135"' +
        'autobuffer src="phonegap-video.mp4" controls></video>';

    function showAndPlayVideo() {
        if (!x$('#sampleVideo').length) {
            x$('#noVideo').inner(videoTag);
            x$('#sampleVideo')[0].play();
            x$('#sampleVideo').on('click', function () {
                this.pause();
            }).on('pause', function () {
                x$(this).remove();
            });
        }
    }

    function drawCircle(color, offset) {
        var canvas = x$('#myCanvas')[0];
        var ctx = canvas.getContext('2d');

        var x = 25, y = 35 + (30 * offset), rd = 10;

        ctx.beginPath();
        ctx.arc(x, y, rd, 0, Math.PI * 2, false);
        ctx.closePath();

        ctx.fillStyle = color;
        ctx.fill();
    }

    function drawDashboard(length) {
        // double-tilde forces integer division in JavaScript
        var reds = ~~(length / 5);
        var yellows = length % 5;
        var count = 0, i;

        var canvas = x$('#myCanvas')[0];
        canvas.width = canvas.width;

        for (i=0; i < reds; i++) {
            drawCircle('red', count++);
        }

        for (i=0; i < yellows; i++) {
            drawCircle('yellow', count++);
        }
    }

document.addEventListener('touchmove', function (e) {
    e.preventDefault();
});
