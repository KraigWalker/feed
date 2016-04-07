'use strict';

const fbsub = require('./lib/facebooksub.js');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const passport = require('passport');

const routes = require('./app/routes');
const app = express();

// Configure app to use bodyParser
// This allows us to get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 8080;		// set our port

////////////////////////
// ROUTES FOR OUR API //
////////////////////////
const router = express.Router();

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! Welcome to the Feed API!' });
});

router.post('/api/subscription/', function(req, res) {
    res.json({ message: 'subscribe to Facebook page' });
});

router.delete('/api/subscription/', function(req, res) {
    res.json({ message: 'subscribe to Facebook page' });
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// ===================================================
function startServer() {


	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions
	 require('./config/passport')(passport); // pass passport for configuration
	
	////////////////////////
	// Setup Facebook App //
	////////////////////////
	
	// Read config from config.json
	try {
		let obj;
		fs.readFile('config.json', 'utf8', (err, data) => {
  		
  		if (err) {
  			throw err;
  		}
  		obj = JSON.parse(data);
	});

	} catch (err) {
		console.log(err);
	}

	require('./app/routes.js')(app, passport); 

	app.listen(port);
	console.log(`Feed Aggregator started on Port${port}`);
}

startServer();
