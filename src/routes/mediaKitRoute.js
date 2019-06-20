module.exports = function(app, extras) {
  app.get('/media-kit', function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.render('mediaKit', {
      nav: extras.navigation,
      footer: extras.footer
    });
  });
};
