const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

const config = require('./config.js');

//Export specific passport plugin 
//Local Strategy requires callback User.authenticate
//User.authenticate -> Our mongoose authenticate 
exports.local = passport.use(new LocalStrategy(User.authenticate()));

//When using sessions need these
//User has to be grabbed from session and sent to user objecvt
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Function  exports function 
//user - object as first 
//expires in one hour 3600 seconds
//Default is never expires not recommended
exports.getToken = function (user) {
    return jwt.sign(user, config.secretKey, { expiresIn: 3600 });
};

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(
    new JwtStrategy(
        opts,
        (jwt_payload, done) => {
            //Output jwt object to view 
            console.log('JWT payload:', jwt_payload);
            //Find user as it is in the token
            User.findOne({ _id: jwt_payload._id }, (err, user) => {
                if (err) {

                    //No error, however, no user
                    //Could prompt for create new user
                    return done(err, false);
                } else if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
        }
    )
);

//Jwt - jason web token
exports.verifyUser = passport.authenticate('jwt', { session: false });