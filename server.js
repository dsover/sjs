#!/bin/env node

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const ejs = require('ejs');

const server_port = process.env.OPENSHIFT_NODEJS_PORT || 3000;
const server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

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
const extras = {
  // header: fs.readFileSync(app.get('components') + '/xxheader.ejs', 'utf8'),
  // navigation: fs.readFileSync(app.get('components') + '/xxmainNavigation.ejs', 'utf8'),
  // footer: fs.readFileSync(app.get('components') + '/XXfooter.ejs', 'utf8')
};

require('./src/routes/index.js')(app, extras);

app.use(function(req, res, next) {
  res.status(400);
  res.render('404', {
    // nav: extras.navigation,
    // footer: extras.footer
  });
});
