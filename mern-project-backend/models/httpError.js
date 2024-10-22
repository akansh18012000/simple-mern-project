class HttpError extends Error {
    constructor(message, errorCode) {
        super(message); // Adds message key in the Error Object
        this.code = errorCode;  // Adds code key in the Error Object
    }
}

module.exports = HttpError