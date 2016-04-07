'use strict';

const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

// load up User model
const User = require('../app/models/user');

// auth variables
const configAuth = require('./auth');

module.exports = function(passport) {

	// Used to serialize the user for the section
	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser((id, done) => {
		User.findById(id, (err) => {
			done(err, user);
		});
	});

	// code for login (use('local-login', new LocalStategy))
    // code for signup (use('local-signup', new LocalStategy))
    
    //////////////
    // FACEBOOK //
    //////////////
    
    passport.use(
    	new FacebookStrategy({
			// pull in our app id and secret from our auth.js file
			clientID		: configAuth.facebookAuth.clientID,
			clientSecret	: configAuth.facebookAuth.clientSecret,
			callbackURL		: configAuth.facebookAuth.callbackURL
    	},

		(token, refreshToken, profile, done) => {
			// async
			process.nextTick(() => {
				User.findOne({ 'facebook.id' : profile.id }, (err, user) => {

				});
			});
		}
    ));

};
