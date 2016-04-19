#!/bin/env node

var ejs = require('ejs');
var fs = require('fs');
var goodByEmail = fs.readFileSync('./src/components/newBlogEmail.ejs', 'utf8');

var nodemailer = require('nodemailer');
var mongoose = require('mongoose');
var Entry = require('./src/models/entry');
var Subscriber = require('./src/models/subscriber');
var connection_string = '127.0.0.1:27017/blog';
if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
    connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
        process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
        process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
        process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
        process.env.OPENSHIFT_APP_NAME;
}
var db = mongoose.connect(connection_string); //('mongodb://'+server_ip_address+'/blog');

Entry.findOne({}, {}, {
    sort: {
        'created_at': -1
    }
}, function (err, entry) {
    if (err) throw err;

    var blog_id = entry._id;
    var title = entry.title;
    var entry = entry.content;
    var link = '<a href="http://www.sarahjsover.com/blog/' + blog_id + '">Read More</a>'
    Subscriber.find({}, function (err, subscribers) {
        // create reusable transporter object using the default SMTP transport 
        var transporter = nodemailer.createTransport('smtps://sjsover%40gmail.com:Dr3amer2@smtp.gmail.com');
        for (var i = 0; i < subscribers.length; i++) {
            var x = subscribers[i];
            var mailOptions = {
                from: "SarahJSover.com <sjsover@gmail.com>", // sender address
                to: x.email, // comma separated list of receivers
                subject: "New Blog From Sarah J Sover:  " + title, // Subject line
                html: ejs.render(goodByEmail, {
                        title: title
                        , entry: entry.substring(0, 750) + '...'
                        , link: link
                    }) // html body 
            };
            //send mail with defined transport object 
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    return console.log('/subscription/unsubscribe' + error);
                }
                console.log('/subscription/unsubscribe Message sent: ' + info.response);
            });

        }
        db.disconnect();
    });
});