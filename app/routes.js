module.exports = function(app, passport) {

	app.get('/', function(req, res) {
		res.render('index.ejs');
	});

	// route for login form
	
	/////////////////////
	// FACEBOOK ROUTES //
	/////////////////////

	// route for facebook authentication and login
	app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

	// handle the callback after facebook has authenticated the user
	app.get('/auth/facebook/callback',
		passport.authenticate('facebook', {
			successRedirect : 'feed',		// AKA set up subscription
			failureRedirect : '/'
		})
	);

	// Facebook
	app.post('/api/subscription/update/', function(req, res) {
		res.json({ message: 'subscribe to Facebook page' });
	});

	// Facebook
	app.get('/api/subscription/update/', function(req, res) {
		res.json({ message: 'subscribe to Facebook page' });
	});

	// route for logging out
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
};

// Route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if(req.isAuthenticated()) {
		return next();
	}

	// if they aren't, redirect the m to the home page
	res.redirect('/');
}