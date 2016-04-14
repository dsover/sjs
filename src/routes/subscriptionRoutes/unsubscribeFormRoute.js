module.exports = function (app, extras) {
    app.get('/subscription/unsubscribeForm', function (req, res) {
        res.setHeader('Content-Type', 'text/html');
        res.render('unsubscribe', {
            nav: extras.navigation
            , footer: extras.footer
            , subscribeModal: extras.subscribeModal
        });
    });
}