const jwt = require('jsonwebtoken');
const HttpError = require('../models/httpError');

const checkAuth = (req, res, next) => {
    // For Options Call made by the browser to Server to check the Methods available on the Server, we do not require the token.
    if (req.method === 'OPTIONS') {
        next();
    }
    try {
        // Header Names are case insensitive
        token = req?.headers?.authorization?.split(' ')[1] // Authorization : 'Bearer Token'
        const decodedToken = jwt.verify(token, `${process.env.JWT_KEY}`);
        req.userData = {userId: decodedToken.userId};
        next();
    } catch (error) {
        // This error will come up if the authorization header has not been set.
        return(new HttpError('Authentication Failed', 500))
    }
}

module.exports = checkAuth