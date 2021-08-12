const Assert = require('assert');

const ExtendedError = require('../../src/model/ExtendedError');

describe("Extended Error Model Test", () => {
    describe("constructor", () => {
        it("should return extended error instance", () => {
            const extendedError = new ExtendedError("Extended error", 123);
            Assert.strictEqual(extendedError.code, 123);
        });
    });
});
