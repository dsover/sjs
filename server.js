#!/bin/env node

var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();
var ejs = require('ejs');

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.set('components', './src/components');
app.set('views', './src/views');
app.set('view engine', 'ejs');

app.listen(server_port, server_ip_address, function() {
  console.log('Listening on ' + server_ip_address + ', server_port ' + server_port);
});
var extras = {
  navigation: fs.readFileSync(app.get('components') + '/mainNavigation.ejs', 'utf8'),
  footer: fs.readFileSync(app.get('components') + '/footer.ejs', 'utf8')
};

require('./src/routes/index.js')(app, extras);

app.use(function(req, res, next) {
  res.status(400);
  res.render('404', {
    nav: extras.navigation,
    footer: extras.footer
  });
});
