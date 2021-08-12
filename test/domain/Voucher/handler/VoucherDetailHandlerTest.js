const sandbox = require('sinon').createSandbox();
const assert = require('assert');

const VoucherDetailHandler = require('../../../../src/domain/Voucher/handler/VoucherDetailHandler');
const VoucherProviderCode = require('../../../../src/constant/VoucherProviderCode');
const Handler = require('../../../../src/model/Handler');

describe("Voucher Detail Handler Test", () => {
    afterEach(() => {
        sandbox.restore();
    });

    describe("getVoucherDetail", () => {
        it("should return true", async () => {
            sandbox.stub(Handler.prototype, 'handleRequest').resolves(true);

            const params = {
                type: VoucherProviderCode.GILA_DISKON
            }
            const result = await VoucherDetailHandler.getVoucherDetail(params);
            assert.strictEqual(result, true);
        })
    });
});
