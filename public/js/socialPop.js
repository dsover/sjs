$(document).ready(function () {
    $(".pop").click(function (e) {
        e.preventDefault();
        var href = $(e.target).attr('href');
        window.open(href, "tweet", "height=300,width=550,resizable=1")
    });
});