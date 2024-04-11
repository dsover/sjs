module.exports = function (app, extras) {
  app.get("/gallery", function (req, res) {
    res.setHeader("Content-Type", "text/html");
    res.render("gallery", {});
  });
};
