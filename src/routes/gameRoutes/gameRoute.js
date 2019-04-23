module.exports = function(app, extras) {
  app.get('/game', function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.render('game', {
      nav: extras.navigation,
      footer: extras.footer
    });
  });
};
