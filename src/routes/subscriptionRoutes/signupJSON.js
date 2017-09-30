var fs = require('fs');
var emailValidator = require("email-validator");
var ejs = require('ejs');

module.exports = function (app, extras) {
    app.get('/subscription/signup', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        var subscriberEmailAddress = req.query.email_input.toLowerCase();
        var success = true;
        console.log('bob')
        if (!emailValidator.validate(subscriberEmailAddress)) {
            success = false;
            console.log("/subscription/signup invalid email "+ subscriberEmailAddress);
        } else {
            extras.Subscriber.find({
                email: subscriberEmailAddress
            }, function (err, subscriptions) {
                if (err) {
                    success = false;
                    console.log('/subscription/signup' + err);
                }
                if (subscriptions.length < 1) {
                    var newSubscription = new extras.Subscriber({
                        fullName: req.query.name_input
                        , email: subscriberEmailAddress
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
            var transporter = nodemailer.createTransport('smtps://'+process.env.EMAIL_ACCOUNT+'%40gmail.com:'+process.env.EMAIL_PASS+'@smtp.gmail.com');
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
        console.log("subscription saved?: " + success + "name: " + req.query.name_input + "email: " + subscriberEmailAddress)
        res.json({
            success: success
        });
    });
}