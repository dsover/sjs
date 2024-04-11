const dates = require("../data/dates");
const links = require("../data/links");
const panels = require("../data/panels");
module.exports = function (app, extras) {
  app.get("/", function (req, res) {
    res.setHeader("Content-Type", "text/html");
    res.render("index", {
      dates: dates,
      links: links,
      panels: panels,
    });
  });
};
