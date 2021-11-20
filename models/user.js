//Import
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//Import
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    admin: {
        type: Boolean,
        default: false
    }
});

//Plug in the Local Mongoose
userSchema.plugin(passportLocalMongoose);



//Export the model from this module 
//Model has name User-> collection named users and the schema
module.exports = mongoose.model('User', userSchema);