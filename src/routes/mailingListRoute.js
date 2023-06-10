module.exports = function(app, extras) {
  app.get('/mailing-list', function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.render('mailingList', {});
  });
};
