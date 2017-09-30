var fs = require('fs');
var emailValidator = require("email-validator");
var ejs = require('ejs');




module.exports = function (app, extras) {
    app.get('/subscription/unsubscribe',  function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        var success = true;
        var subscriberEmailAddress = req.query.email_input.toLowerCase();
        if (!emailValidator.validate(subscriberEmailAddress)) {
            success = false;
            console.log("/subscription/unsubscribe invalid email "+ subscriberEmailAddress);
        } else {
            extras.Subscriber.find({
                email: subscriberEmailAddress
            }, function (err, subscriptions) {
                if (err) {
                    success = false;
                    console.log('/subscription/unsubscribe' + err);
                }
                if (subscriptions.length < 1) {
                    success = false;
                    console.log('/subscription/unsubscribe no matches')
                }
                subscriptions.forEach(function(sub){
                    sub.active=false;
                    sub.save();
                })
                if(success){
                    var goodByEmail = fs.readFileSync(app.get('components') + '/goodByEmail.ejs', 'utf8');
                    var nodemailer = require('nodemailer');
                    // create reusable transporter object using the default SMTP transport 
                    var transporter = nodemailer.createTransport('smtps://'+process.env.EMAIL_ACCOUNT+'%40gmail.com:'+process.env.EMAIL_PASS+'2@smtp.gmail.com');
                    // setup e-mail data with unicode symbols 
                    var mailOptions = {
                        from: "SarahJSover.com <sjsover@gmail.com>", // sender address
                        to: " <" + subscriberEmailAddress + ">", // comma separated list of receivers
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
                console.log("subscription unsubscribed?: " + success + "email:" + subscriberEmailAddress)
                res.json({
                    success: success
                });
            })
        }
    });
}