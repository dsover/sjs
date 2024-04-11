module.exports = function (app, extras) {
  app.get("/articles", function (req, res) {
    res.setHeader("Content-Type", "text/html");
    res.render("articles", {});
  });
};
