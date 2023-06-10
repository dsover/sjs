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
  app.get('/books/jordan-con-anthology', function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.render('books/jordan-con-anthology', {});
  });
  app.get('/books/putting-the-fact-in-fantasy', function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.render('books/putting-the-fact-in-fantasy', {});
  });
};
