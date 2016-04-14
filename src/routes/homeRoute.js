module.exports = function (app, extras) {
    app.get('/', function (req, res) {
        res.setHeader('Content-Type', 'text/html');
        extras.Entry.findOne({}, {}, {
            sort: {
                'created_at': -1
            }
        }, function (err, entry) {
            if (err) throw err;
            // object of all the users
            res.render('index', {
                nav: extras.navigation
                , footer: extras.footer
                , subscribeModal: extras.subscribeModal
                , post: entry
            });
        });
    });

}