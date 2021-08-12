const ExtendedError = require('./ExtendedError');

class Handler {
    constructor(type, handler) {
        this.type = type;
        this.handler = handler;
    }

    setNextHandler(handler) {
        this.nextHandler = handler;
        return this.nextHandler;
    }

    handleRequest(params) {
        if (params['type'] && this.type == params['type']) {
            return this.handler(params);
        } else if (params['type'] && this.nextHandler) {
            return this.nextHandler.handleRequest(params);
        }
        throw new ExtendedError('Handler not available', 503);
    }
}

module.exports = Handler;
