module.exports = function(app, extras) {
    app.get('/privacy-policy', function(req, res) {
        res.setHeader('Content-Type', 'text/html');
        res.render('privacy-policy', {});
    });
};
