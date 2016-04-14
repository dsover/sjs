module.exports = function (app, extras) {
    app.get('/books', function (req, res) {
        res.setHeader('Content-Type', 'text/html');
        res.render('books', {
            nav: extras.navigation
            , footer: extras.footer
            , subscribeModal: extras.subscribeModal
        });
    });
}