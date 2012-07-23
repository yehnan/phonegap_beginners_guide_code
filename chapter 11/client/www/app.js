var newsStory = "<h2>{{ title }}</h2><p>{{ body }}</p>";

x$(document).on('DOMContentLoaded', function () {
    x$().xhr("http://localhost:4567/json", function () {
        var storiesArray = JSON.parse(this.responseText),
            storiesMarkup = "",
            storyHtml;

        storiesArray.forEach(function (story) {
            storyHtml = Mustache.to_html(newsStory, story);
            storiesMarkup += storyHtml;
        });

        x$('#news-container').inner(storiesMarkup);
    });
});
