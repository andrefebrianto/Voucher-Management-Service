const sandbox = require('sinon').createSandbox();
const assert = require('assert');

const VoucherStatusHandler = require('../../../../src/domain/Voucher/handler/VoucherStatusHandler');
const VoucherProviderCode = require('../../../../src/constant/VoucherProviderCode');
const Handler = require('../../../../src/model/Handler');

describe("Voucher Status Handler Test", () => {
    afterEach(() => {
        sandbox.restore();
    });

    describe("getVoucherStatus", () => {
        it("should return true", async () => {
            sandbox.stub(Handler.prototype, 'handleRequest').resolves(true);

            const params = {
                type: VoucherProviderCode.GILA_DISKON
            }
            const result = await VoucherStatusHandler.getVoucherStatus(params);
            assert.strictEqual(result, true);
        })
    });
});
