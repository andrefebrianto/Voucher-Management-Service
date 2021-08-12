const Assert = require('assert');

const Handler = require('../../src/model/Handler');
const ExtendedError = require('../../src/model/ExtendedError');
const VoucherProviderCode = require('../../src/constant/VoucherProviderCode');

describe("Handler Model Test", () => {
    describe("constructor", () => {
        it("should return handler instance", () => {
            const handler = new Handler(VoucherProviderCode.GILA_DISKON, function() {});
            Assert.strictEqual(handler.type, VoucherProviderCode.GILA_DISKON);
        });
    });

    describe("setNextHandler", () => {
        it("should add new chain", () => {
            const firstHandler = new Handler(VoucherProviderCode.GILA_DISKON, function() {});
            const secondHandler = new Handler(12, function() {});

            firstHandler.setNextHandler(secondHandler);
        });
    });

    describe("handleRequest", () => {
        const firstHandler = new Handler(VoucherProviderCode.GILA_DISKON, function() {return VoucherProviderCode.GILA_DISKON});
        const secondHandler = new Handler(12, function() {return 12});
        firstHandler.setNextHandler(secondHandler);

        it("should handle request", () => {
            const params = {
                type: VoucherProviderCode.GILA_DISKON
            }
            const result = firstHandler.handleRequest(params);
            Assert.strictEqual(result, VoucherProviderCode.GILA_DISKON);
        });

        it("should reject request", () => {
            try {
                const params = {
                    type: 404
                }
                const result = firstHandler.handleRequest(params);
            } catch (error) {
                Assert.deepStrictEqual(error, new ExtendedError('Handler not available', 503));
            }
        });
    });
});
