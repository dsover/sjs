module.exports = function(app, extras) {
  app.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.render('index', {
      nav: extras.navigation,
      footer: extras.footer
    });
  });
};
