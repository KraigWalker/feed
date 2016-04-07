'use strict';

// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {
    'facebookAuth' : {
        'clientID'      : '584000811757193', // your App ID
        'clientSecret'  : '754e21e3c375eef1e84806dfeb3ce196', // your App Secret
        'callbackURL'   : 'http://localhost:3000/'
    }
};
