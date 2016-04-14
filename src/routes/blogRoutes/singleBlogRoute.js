module.exports = function (app, extras) {
    app.get('/blog/:id',  function (req, res) {
        res.setHeader('Content-Type', 'text/html');
        extras.Entry.findById(req.params.id, function (err, post) {
            if (err) throw err;

            // object of all the users
            res.render('blog-post', {
                nav: extras.navigation
                , footer: extras.footer
                , subscribeModal: extras.subscribeModal
                , post: post
                , url: 'http://' + req.host + req.url
            });
        });

    });
}