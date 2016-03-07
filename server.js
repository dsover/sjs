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
//            var Entry = require('./src/models/entry');
//
//            var entry1 = new Entry({
//              title: 'Samual Post',
//              content: "<p>Well, the way they make shows is, they make one show. That show's called a pilot. Then they show that show to the people who make shows, and on the strength of that one show they decide if they're going to make more shows. Some pilots get picked and become television programs. Some don't, become nothing. She starred in one of the ones that became nothing. </p><p>Your bones don't break, mine do. That's clear. Your cells react to bacteria and viruses differently than mine. You don't get sick, I do. That's also clear. But for some reason, you and I react the exact same way to water. We swallow it too fast, we choke. We get some in our lungs, we drown. However unreal it may seem, we are connected, you and I. We're on the same curve, just on opposite ends. </p><p>Normally, both your asses would be dead as fucking fried chicken, but you happen to pull this shit while I'm in a transitional period so I don't wanna kill you, I wanna help you. But I can't give you this case, it don't belong to me. Besides, I've already been through too much shit this morning over this case to hand it over to your dumb ass. </p>"
//            });
//
//            entry1.save(function(err) {
//              if (err) throw err;
//
//              console.log('entry saved successfully!');
//            });
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





