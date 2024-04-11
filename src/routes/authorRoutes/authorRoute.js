module.exports = function (app, extras) {
  app.get("/author", function (req, res) {
    res.setHeader("Content-Type", "text/html");
    res.render("author", {});
  });
};
