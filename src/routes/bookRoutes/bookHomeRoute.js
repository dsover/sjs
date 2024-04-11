module.exports = function(app, extras) {
  app.get('/books', function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.render('books/books', {});
  });
  app.get('/books/double-crossing-the-bridge', function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.render('books/double-crossing-the-bridge', {});
  });
  app.get('/books/fractured-fae', function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.render('books/fractured-fae', {});
  });
  app.get('/books/short-story-anthologies', function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.render('books/short-story-anthologies', {});
  });
  app.get('/books/non-fiction-anthologies', function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.render('books/non-fiction-anthologies', {});
  });
};
