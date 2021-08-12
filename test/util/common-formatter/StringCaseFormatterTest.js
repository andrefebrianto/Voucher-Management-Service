const assert = require('assert');

const StringCaseFormatter = require('../../../src/util/common-formatter/StringCaseFormatter');

describe("String Case Formatter Test", () => {
    describe("uppering", () => {
        it("should return upper case for inserted text", () => {
            const upperCaseText = StringCaseFormatter.uppering("undefined");
            assert.strictEqual(upperCaseText, "UNDEFINED");
        });

        it("should return null for empty text", () => {
            const upperCaseText = StringCaseFormatter.uppering(null);
            assert.strictEqual(upperCaseText, null);
        });
    });

    describe("lowering", () => {
        it("should return lower case for inserted text", () => {
            const lowerCaseText = StringCaseFormatter.lowering("UNDEFINED");
            assert.strictEqual(lowerCaseText, "undefined");
        });

        it("should return null for empty text", () => {
            const lowerCaseText = StringCaseFormatter.lowering(null);
            assert.strictEqual(lowerCaseText, null);
        });
    });
});
