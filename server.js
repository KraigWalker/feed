const fbsub = require('./lib/fbsub');
const express = require('express');
const bodyParser = require('body-parser');

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

router.post('/subscription/', function(req, res) {
    res.json({ message: 'subscribe to Facebook page' });
});

router.delete('/subscription/', function(req, res) {
    res.json({ message: 'subscribe to Facebook page' });
});

// Facebook
router.post('/subscription/update/', function(req, res) {
    res.json({ message: 'subscribe to Facebook page' });
});

// Facebook
router.get('/subscription/update/', function(req, res) {
    res.json({ message: 'subscribe to Facebook page' });
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log(`Feed Aggregator started on Port${port}`);
