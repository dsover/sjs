var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var subcriberSchema = new Schema({
    fullName: String
    , email: String
    , active: Boolean
    , created_at: Date
    , updated_at: Date
});
subcriberSchema.pre('save', function (next) {
    // get the current date
    var currentDate = new Date();

    // change the updated_at field to current date
    this.updated_at = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.created_at) {
        this.created_at = currentDate;
    }
    
    //make email lowercase
    this.email = this.email.toLowerCase()
    next();
});
// the schema is useless so far
// we need to create a model using it
var Subscriber = mongoose.model('Subscriber', subcriberSchema);

// make this available to our users in our Node applications
module.exports = Subscriber;