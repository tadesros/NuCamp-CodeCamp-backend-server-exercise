const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');

//Export specific passport plugin 
//Local Strategy requires callback User.authenticate
//User.authenticate -> Our mongoose authenticate 
exports.local = passport.use(new LocalStrategy(User.authenticate()));

//When using sessions need these
//User has to be grabbed from session and sent to user objecvt
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());