#!/bin/env node
//  OpenShift sample Node application
var express = require('express');
var fs      = require('fs');
var app = express();
var mongoose = require('mongoose');


var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

var connection_string = '127.0.0.1:27017/blog';
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
  connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
  process.env.OPENSHIFT_APP_NAME;
}
mongoose.connect(connection_string);//('mongodb://'+server_ip_address+'/blog');


app.use(express.static('public'));
app.set('components','./src/components')
app.set('views','./src/views')
app.set('view engine','ejs');

app.listen(server_port, server_ip_address, function(){
  console.log("Listening on " + server_ip_address + ", server_port " + server_port)
});

app.createRoutes = function() {
    var navigation = fs.readFileSync(app.get('components')+'/mainNavigation.ejs','utf8');
    var footer = fs.readFileSync(app.get('components')+'/footer.ejs','utf8');
    var Entry = require('./src/models/entry');
    

    app.routes = { };
    
    app.routes['/'] = function(req, res) {
    res.setHeader('Content-Type', 'text/html');
        Entry.findOne({}, {}, { sort: { 'created_at' : -1 } }, function(err, entry) {
            if (err) throw err;

            // object of all the users
            //console.log(entry);
            res.render('index',{ nav : navigation, footer : footer, post : entry });
        });
    };
    
    app.routes['/404'] = function(req, res) {
    res.setHeader('Content-Type', 'text/html');
        res.render('404',{ nav : navigation, footer : footer }); 
    };
    
    app.routes['/about'] = function(req, res) {
    res.setHeader('Content-Type', 'text/html');
        res.render('about',{ nav : navigation, footer : footer }); 
    };
   
    app.routes['/blogs'] = function(req, res) {
    res.setHeader('Content-Type', 'text/html');
        Entry.find({}, function(err, entries) {
            if (err) throw err;
            res.render('blog-home-1',{ nav : navigation, footer : footer, posts : entries });
        });
    };
  
    app.routes['/blog/:id'] = function(req, res) {
    res.setHeader('Content-Type', 'text/html');
        Entry.findById(req.params.id, function(err, entries) {
            if (err) throw err;

            // object of all the users
            //console.log(entries);
            res.render('blog-post',{ nav : navigation, footer : footer, post : entries });
        });
        
    };
    
};
app.createRoutes();
for (var r in app.routes) {
    app.get(r, app.routes[r]);
}





