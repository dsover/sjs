module.exports = function(app, extras) {
  app.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    dates = [
      {
        date: "February 24 - 26",
        sup:"th",
        eventName:"ATL ComicCon",
        type:"Vendor",
        link:"https://atlcomicconvention.com/"
      },
      {
        date: "April 21 - 23",
        sup:"rd",
        eventName:"JordanCon",
        type:"Guest",
        link:"https://www.jordancon.org/"
      },
      {
        date: "September 1 - 3",
        sup:"rd",
        eventName:"Dragon Con",
        type:"Attendee",
        link:"https://www.dragoncon.org/"
      }
    ]

    res.render('index', {
      nav: extras.navigation,
      footer: extras.footer,
      dates: dates
    });
  });
};
