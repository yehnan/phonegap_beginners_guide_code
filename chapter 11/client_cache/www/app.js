var newsStory = "<h2>{{ title }}</h2><p>{{ body }}</p>";

x$(document).on('DOMContentLoaded', function () {
    var myDB = initializeDB();

    function renderStories(stories) {
        var storiesMarkup = "",
            storyHtml;

        stories.forEach(function (story) {
            storyHtml = Mustache.to_html(newsStory, story);
            storiesMarkup += storyHtml;
        });

        x$('#news-container').inner(storiesMarkup);
    }

    createStoryTable(myDB, function () {
        x$().xhr("http://localhost:4567/json", {
                async: true,
                callback: function () {
                    try {
                        var storiesArray =  
                        JSON.parse(this.responseText);
                        storiesArray.forEach(function (story) {
                            insertNewStory(myDB, story);
                        });
                        renderStories(storiesArray)
                    } catch (e) {
                        // 無法取得資料
                        getLastStories(myDB, function (stories) {
                            renderStories(stories);
                        })
                    }
                }
        });
    });
});


