// Dependencies
const https = require('https');
const querystring = require('querystring');
const url = require('url');

// Defaults
const FACEBOOK_GRAPH_URL = 'graph.facebook.com';
const FACEBOOK_OAUTH_PATH = '/oauth/access_token';
const config = {};

// Configuration
/**
 * Set up initial Facebook App Parameters that are essential
 * for communicating between the app and the Facebook API.
 * This method should be called on system startup
 * @param  {Options} options [description]
 * @param {String} options.appId [description]
 * @param {String} options.appSecret [description]
 * @param {String} options.verifyToken [description]
 * @param {String} options.callbackUrl [description]
 */
function init(options) {
	config = {
		appId: options.appId,
		appSecret: options.appSecret,
		verifyToken: options.verifyToken,
		callbackUrl: options.callbackUrl
	};
};


/**
 * [authenticate description]
 * @param  {Function} callback [description]
 */
function authenticate(callback) {
	https.get({
		host: FACEBOOK_GRAPH_URL,
		path: `${FACEBOOK_OAUTH_PATH}?client_id=${config.appId}&client_secret=${config.appSecret}&grant_type=client_credentials`
	}, (res) => {
		var data = "";
		res.on('data', (chunk) => {
			data += chunk;
		}).on('end', () => {
			if (data.toString().indexOf("error") === -1) {
				var accessToken = data.split("=")[1];
				config.accessToken = accessToken;
				callback(null);
			} else {
				callback(data);
			}
		}).on('error', (e) => {
			callback(e.message);
		});
	});
};

/**
 * Subscribe specified object and fields
 * @param  {[type]}   object   [description]
 * @param  {[type]}   fields   [description]
 * @param  {Function} callback A callback method that acts on the response recieved
 * @param  {[type]}   scope    (optional) An alternative app ID
 */
function subscribe(object, fields, callback, scope) {
	var req = https.request({
		host: FACEBOOK_GRAPH_URL,
		port: 443,
		path: `/${(typeof scope !== 'undefined' ? scope : config.appId)}/subscriptions?access_token=${config.accessToken}`,
		method: 'POST'
	}, function(res) {
		var data = "";
		res.on('data', function(chunk) {
			data += chunk;
		}).on('end', function() {
			if (data.indexOf("error") === -1){
				callback(null);
			} else {
				callback(data);
			}
		}).on('error', function(e) {
			callback(e.message);
		});
	});

	req.write(querystring.stringify({
		'callback_url': config.callbackUrl,
		'object': object,
		'fields': fields,
		'verify_token': config.verifyToken
	}));

	req.end();
};


/**
 * Unsubscribe specified object and fields
 * @param  {Function} callback A callback method that acts on the response recieved
 * @param  {String}   scope    (optional) An alternative app ID
 */
function unSubscribe(callback, scope) {
	var req = https.request({
		host: FACEBOOK_GRAPH_URL,
		port: 443,
		path: `/${(typeof scope !== 'undefined' ? scope : config.appId)}'/subscriptions?access_token='${config.accessToken}`,
		method: 'DELETE'
	}, function(res) {
		var data = "";
		res.on('data', function(chunk) {
			data += chunk;
		}).on('end', function() {
			callback(JSON.parse(data));
		}).on('error', function(e) {
			callback(e.message);
		});
	});
	req.end();
};


/**
 * Verify handler for Facebook
 * @param  {Object} req Express request object
 * @param  {Object} res Express response object
 */
function verify(req, res) {
	console.log('Get verification request...');
	var url_parts = url.parse(req.url,true);
	var query = url_parts.query;
	if (query.hasOwnProperty('hub.verify_token')) {
		if (query['hub.verify_token'] !== config.verifyToken) {
			console.log('Invalid token.');	// make user aware the subscription token is invalid
			return res.send(404);
		}
		console.log('Verified');
		return res.send(query['hub.challenge']);
	}
	return res.send(query['hub.challenge']);	// respond with the correct challenge specified
};


/**
 * Retrieve the access token.
 * @return {String} Access token from the config
 */
function getAccessToken() {
	return config.accessToken;
};


// Retrieve current subscriptions
/**
 * Retrieve current Facebook Page Subscriptions
 * @param  {Function} callback A callback method that acts on the response recieved
 * @param  {[type]}   scope    (optional) An alternative app ID
 */
function getSubscriptions(callback, scope) {
	https.get({
		host: FACEBOOK_GRAPH_URL,
		path: `/${(typeof scope !== 'undefined' ? scope : config.appId)}?access_token=${getAccessToken()}`
	}, (res) => {
		let data = "";
		res.on('data', (chunk) => {
			data += chunk;
		}).on('end', () => {
			callback(JSON.parse(data));
		}).on('error', (e) => {
			callback(e.message);
		});
	});
};


// Retrieve feed from specified page
/**
 * [getPageFeed description]
 * @param  {Function} callback A callback method that acts on the response recieved
 * @param  {String}   page     Facebook Page ID
 * @param  {[type]}   query    (optional)
 */
function getPageFeed(callback, page, query) {
	queryString = query !== null ? '&' + querystring.stringify(query) : '';
	https.get({
		host: FACEBOOK_GRAPH_URL,
		path: `/${page}/feed?access_token=${getAccessToken()}${queryString}`
	}, (res) => {
		let data = '';
		res.on('data', (chunk) => {
			data += chunk;
		}).on('end', () => {
			callback(JSON.parse(data));
		}).on('error', (e) => {
			callback(e.message);
		});
	});
};

module.exports = {
	init: init,
	authenticate: authenticate,
	subscribe: subscribe,
	unSubscribe: unSubscribe,
	verify: verify,
	getAccessToken: getAccessToken,
	getSubscriptions: getSubscriptions,
	getPageFeed: getPageFeed
};
