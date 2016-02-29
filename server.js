#!/bin/env node
//  OpenShift sample Node application
var express = require('express');
var fs      = require('fs');
var app = express();

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

app.listen(server_port, server_ip_address, function(){
  console.log("Listening on " + server_ip_address + ", server_port " + server_port)
});

app.createRoutes = function() {
    app.routes = { };
    app.routes['/'] = function(req, res) {
    res.setHeader('Content-Type', 'text/html');
        res.send(fs.readFileSync('./index.html'));
    };
};
app.createRoutes();
for (var r in app.routes) {
    app.get(r, app.routes[r]);
}
