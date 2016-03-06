#!/bin/env node
//  OpenShift sample Node application
var express = require('express');
var fs      = require('fs');
var app = express();

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

app.use(express.static('public'));
app.set('components','./src/components')
app.set('views','./src/views')
app.set('view engine','ejs');

app.listen(server_port, server_ip_address, function(){
  console.log("Listening on " + server_ip_address + ", server_port " + server_port)
});
//var lor = 

app.createRoutes = function() {
    var navigation = fs.readFileSync(app.get('components')+'/mainNavigation.ejs','utf8');
    
    var post = { 
        "_id" : "56dba5eeb0d222c346927d17", 
        "title" : "title1", 
        "date" : 1457235438625, 
        "content" : "<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus, vero, obcaecati, aut, error quam sapiente nemo saepe quibusdam sit excepturi nam quia corporis eligendi eos magni recusandae laborum minus inventore?</p><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus, vero, obcaecati, aut, error quam sapiente nemo saepe quibusdam sit excepturi nam quia corporis eligendi eos magni recusandae laborum minus inventore?</p><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus, vero, obcaecati, aut, error quam sapiente nemo saepe quibusdam sit excepturi nam quia corporis eligendi eos magni recusandae laborum minus inventore?</p><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus, vero, obcaecati, aut, error quam sapiente nemo saepe quibusdam sit excepturi nam quia corporis eligendi eos magni recusandae laborum minus inventore?</p><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus, vero, obcaecati, aut, error quam sapiente nemo saepe quibusdam sit excepturi nam quia corporis eligendi eos magni recusandae laborum minus inventore?</p><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus, vero, obcaecati, aut, error quam sapiente nemo saepe quibusdam sit excepturi nam quia corporis eligendi eos magni recusandae laborum minus inventore?</p><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus, vero, obcaecati, aut, error quam sapiente nemo saepe quibusdam sit excepturi nam quia corporis eligendi eos magni recusandae laborum minus inventore?</p><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus, vero, obcaecati, aut, error quam sapiente nemo saepe quibusdam sit excepturi nam quia corporis eligendi eos magni recusandae laborum minus inventore?</p>" };
        
    app.routes = { };
    
    app.routes['/'] = function(req, res) {
    res.setHeader('Content-Type', 'text/html');
        res.render('index',{ nav : navigation,post : post }); 
    };
    
    app.routes['/404'] = function(req, res) {
    res.setHeader('Content-Type', 'text/html');
        res.render('404',{ nav : navigation }); 
    };
    
    app.routes['/about'] = function(req, res) {
    res.setHeader('Content-Type', 'text/html');
        res.render('about',{ nav : navigation }); 
    };
   
    app.routes['/blogs'] = function(req, res) {
    res.setHeader('Content-Type', 'text/html');
        res.render('blog-home-1',{ nav : navigation }); 
    };
  
    app.routes['/blog'] = function(req, res) {
    res.setHeader('Content-Type', 'text/html');
        res.render('blog-post',{ nav : navigation, post : post });
    };
    
};
app.createRoutes();
for (var r in app.routes) {
    app.get(r, app.routes[r]);
}
