module.exports = function (app, extras) {
    app.get('/blogs/:page', function (req, res) {
        res.setHeader('Content-Type', 'text/html');
        page = parseInt(req.params.page)
        limit = 10;
        offset = page * limit;
        extras.Entry.count({}, function (err, count) {
            if (err) throw err;
            extras.Entry.find({}, function (err, entries) {
                if (err) throw err;
                res.render('blog-home-1', {
                    nav: extras.navigation
                    , footer: extras.footer
                    , subscribeModal: extras.subscribeModal
                    , posts: entries
                    , curPage: page
                    , lastPage: ((count / limit) - 1)
                });
            }).limit(limit).skip(offset).sort('-created_at');
        })
    });
}