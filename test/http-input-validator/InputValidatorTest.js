const sandbox = require('sinon').createSandbox();

const inputValidator = require('../../src/http-input-validator/InputValidator');

describe("Input Validator Test", () => {
    afterEach(() => {
        sandbox.restore();
    });

    const response = {
        status: function() {
            return {
                json: sandbox.stub().resolves()
            }
        }
    }

    it("should forward function", () => {
        const request = {
            body: {},
            header: {},
            params: {}
        };

        inputValidator(request, response, sandbox.stub());
    });
});
