#!/bin/env node

var ejs = require('ejs');
var fs = require('fs');
var goodByEmail = fs.readFileSync('./src/components/newBlogEmail.ejs', 'utf8');

var nodemailer = require('nodemailer');
//var xoauth2 = require('xoauth2');

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

var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail"
    ,auth: {
        XOAuth2:{
            user:"sjsover@gmail.com"
            ,clientId:"791607229764-ktlqk4i8jle4mad0atiogulb2n3pqtg0.apps.googleusercontent.com"
            ,clientSecret:"rS6ElTlLVOZrbexj7a5o1KRm"
            ,refreshToken:"1/jrFPgfRrc3sWp1SQhT_je8djQFb6ZEtva2ZqT6D_cvd90RDknAdJa_sgfheVM0XT"
        }
    }
});

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
        for (var i = 0; i < subscribers.length; i++) {
            var x = subscribers[i];
            var mailOptions = {
                from: "SarahJSover.com <sjsover@gmail.com>", // sender address
                to: "<alexsover@gmail.com>",//x.email, // comma separated list of receivers
                subject: "New Blog From Sarah J Sover:  " + title, // Subject line
                generateTextFromHTML: true,
                html: ejs.render(goodByEmail, {
                        title: title
                        , entry: entry.substring(0, 750) + '...'
                        , link: link
                    }) // html body 
            };
            //send mail with defined transport object 
            smtpTransport.sendMail(mailOptions, function (error, info) {
                if (error) {
                    return console.log('/subscription/unsubscribe' + error);
                }
                console.log('/subscription/unsubscribe Message sent: ' + JSON.stringify(info));
            });
            console.log("test")

        }
        db.disconnect();
    });
});
