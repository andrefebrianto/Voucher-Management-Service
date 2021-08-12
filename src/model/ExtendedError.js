class ExtendedError extends Error {
    constructor (message, code) {
        super(message);

        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
        this.code = code;
    }
}

module.exports = ExtendedError;
