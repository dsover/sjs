(function (i, s, o, g, r, a, m) {
  i["GoogleAnalyticsObject"] = r;
  (i[r] =
    i[r] ||
    function () {
      (i[r].q = i[r].q || []).push(arguments);
    }),
    (i[r].l = 1 * new Date());
  (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
  a.async = 1;
  a.src = g;
  m.parentNode.insertBefore(a, m);
})(
  window,
  document,
  "script",
  "https://www.google-analytics.com/analytics.js",
  "ga"
);

ga("create", "UA-76195972-1", "auto");
ga("send", "pageview");

let burger = document.getElementById("burger"),
  nav = document.getElementById("main-nav"),
  slowmo = document.getElementById("slowmo");

if (burger) {
  burger.addEventListener("click", function (e) {
    this.classList.toggle("is-open");
    nav.classList.toggle("is-open");
  });
} else {
  console.log("No burger");
}

if (slowmo) {
  slowmo.addEventListener("click", function (e) {
    this.classList.toggle("is-slowmo");
  });
} else {
  console.log("No slowmo");
}
