#!/bin/env node

var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();
var mongoose = require('mongoose');
var emailValidator = require("email-validator");
var ejs = require('ejs');

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

var connection_string = '127.0.0.1:27017/blog';
if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
    connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
        process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
        process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
        process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
        process.env.OPENSHIFT_APP_NAME;
}
mongoose.connect(connection_string); //('mongodb://'+server_ip_address+'/blog');


app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


app.set('components', './src/components')
app.set('views', './src/views')
app.set('view engine', 'ejs');

app.listen(server_port, server_ip_address, function () {
    console.log("Listening on " + server_ip_address + ", server_port " + server_port)
});

app.createRoutes = function () {
    var navigation = fs.readFileSync(app.get('components') + '/mainNavigation.ejs', 'utf8');
    var footer = fs.readFileSync(app.get('components') + '/footer.ejs', 'utf8');
    var subscribeModal = fs.readFileSync(app.get('components') + '/subscribeModal.ejs', 'utf8');
    var Entry = require('./src/models/entry');
    var Subscriber = require('./src/models/subscriber');


    app.routes = {};

    app.routes['/'] = function (req, res) {
        res.setHeader('Content-Type', 'text/html');
        Entry.findOne({}, {}, {
            sort: {
                'created_at': -1
            }
        }, function (err, entry) {
            if (err) throw err;
            // object of all the users
            res.render('index', {
                nav: navigation
                , footer: footer
                , subscribeModal: subscribeModal
                , post: entry
            });
        });
    };

    app.routes['/author'] = function (req, res) {
        res.setHeader('Content-Type', 'text/html');
        res.render('author', {
            nav: navigation
            , footer: footer
            , subscribeModal: subscribeModal
        });
    };

    app.routes['/blogs/:page'] = function (req, res) {
        res.setHeader('Content-Type', 'text/html');
        page = parseInt(req.params.page)
        limit = 10;
        offset = page * limit;
        Entry.count({}, function (err, count) {
            if (err) throw err;
            Entry.find({}, function (err, entries) {
                if (err) throw err;
                res.render('blog-home-1', {
                    nav: navigation
                    , footer: footer
                    , subscribeModal: subscribeModal
                    , posts: entries
                    , curPage: page
                    , lastPage: ((count / limit) - 1)
                });
            }).limit(limit).skip(offset).sort('-created_at');
        })
    };

    app.routes['/blog/:id'] = function (req, res) {
        res.setHeader('Content-Type', 'text/html');
        Entry.findById(req.params.id, function (err, entries) {
            if (err) throw err;

            // object of all the users
            res.render('blog-post', {
                nav: navigation
                , footer: footer
                , subscribeModal: subscribeModal
                , post: entries
                , url: 'http://' + req.host + req.url
            });
        });

    };
    app.routes['/books'] = function (req, res) {
        res.setHeader('Content-Type', 'text/html');
        res.render('books', {
            nav: navigation
            , footer: footer
            , subscribeModal: subscribeModal
        });
    };
    app.routes['/subscription/unsubscribeForm'] = function (req, res) {
        res.setHeader('Content-Type', 'text/html');
        res.render('unsubscribe', {
            nav: navigation
            , footer: footer
            , subscribeModal: subscribeModal
        });
    }
    app.routes['/subscription/signup'] = function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        var success = true;
        if (!emailValidator.validate(req.query.email_input)) {
            success = false;
            console.log("/subscription/signup invalid email "+ req.query.email_input);
        } else {
            Subscriber.find({
                email: req.query.email_input
            }, function (err, subscriptions) {
                if (err) {
                    success = false;
                    console.log('/subscription/signup' + err);
                }
                if (subscriptions.length < 1) {
                    var newSubscription = new Subscriber({
                        fullName: req.query.name_input
                        , email: req.query.email_input
                        , active: true
                    });
                    newSubscription.save(function (err) {
                        if (err) {
                            console.log('/subscription/signup' + err)
                            success = false;
                        }
                    });
                }else{
                    subscriptions.forEach(function (sub) {
                        sub.active = true;
                        sub.save();
                    });                    
                }
            })        
        }
        if(success){
            var welcomeEmail = fs.readFileSync(app.get('components') + '/welcomeEmail.ejs', 'utf8');
            var nodemailer = require('nodemailer');
            // create reusable transporter object using the default SMTP transport 
            var transporter = nodemailer.createTransport('smtps://sjsover%40gmail.com:Dr3amer2@smtp.gmail.com');
            // setup e-mail data with unicode symbols 
            var mailOptions = {
                from: "SarahJSover.com <sjsover@gmail.com>", // sender address
                to: req.query.name_input + " <" + req.query.email_input + ">", // comma separated list of receivers
                subject: "Welcome to my blog", // Subject line
                html: ejs.render(welcomeEmail, {
                        name: req.query.name_input
                    }) // html body 
            };
            // send mail with defined transport object 
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    return console.log('/subscription/signup' + error);
                }
                console.log('/subscription/signup Message sent: ' + info.response);
            });
        }
        console.log("subscription saved?: " + success + "name:" + req.query.name_input + "email:" + req.query.email_input)
        res.json({
            success: true
        });
    };
    app.routes['/subscription/unsubscribe'] = function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        var success = true;
        if (!emailValidator.validate(req.query.email_input)) {
            success = false;
            console.log("/subscription/unsubscribe invalid email "+ req.query.email_input);
            res.json({
                success: success
            });
        } else {
            Subscriber.find({
                email: req.query.email_input
            }, function (err, subscriptions) {
                if (err) {
                    success = false;
                    console.log('/subscription/unsubscribe' + err);
                }
                if (subscriptions.length < 1) {
                    success = false;
                    console.log('/subscription/unsubscribe no matches')
                    res.json({
                        success: success
                    })
                }
                subscriptions.forEach(function(sub){
                    sub.active=false;
                    sub.save();
                })
                if(success){
                    var goodByEmail = fs.readFileSync(app.get('components') + '/goodByEmail.ejs', 'utf8');
                    var nodemailer = require('nodemailer');
                    // create reusable transporter object using the default SMTP transport 
                    var transporter = nodemailer.createTransport('smtps://sjsover%40gmail.com:Dr3amer2@smtp.gmail.com');
                    // setup e-mail data with unicode symbols 
                    var mailOptions = {
                        from: "SarahJSover.com <sjsover@gmail.com>", // sender address
                        to: " <" + req.query.email_input + ">", // comma separated list of receivers
                        subject: "Sorry to see you leave", // Subject line
                        html: ejs.render(goodByEmail, {
                                name: req.query.name_input
                            }) // html body 
                    };
                    // send mail with defined transport object 
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            return console.log('/subscription/unsubscribe' + error);
                        }
                        console.log('/subscription/unsubscribe Message sent: ' + info.response);
                    });
                }
                console.log("subscription unsubscribed?: " + success + "email:" + req.query.email_input)
                res.json({
                    success: success
                });
            })
        }

    }

    app.routes['*'] = function (req, res) {
        res.setHeader('Content-Type', 'text/html');
        res.render('404', {
            nav: navigation
            , footer: footer
            , subscribeModal: subscribeModal
        });
    };


};
app.createRoutes();
for (var r in app.routes) {
    app.get(r, app.routes[r]);
}