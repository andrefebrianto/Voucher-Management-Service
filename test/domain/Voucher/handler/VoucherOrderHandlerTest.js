const sandbox = require('sinon').createSandbox();
const assert = require('assert');

const VoucherOrderHandler = require('../../../../src/domain/Voucher/handler/VoucherOrderHandler');
const VoucherProviderCode = require('../../../../src/constant/VoucherProviderCode');
const Handler = require('../../../../src/model/Handler');

describe("Voucher Order Handler Test", () => {
    afterEach(() => {
        sandbox.restore();
    });

    describe("orderVoucher", () => {
        it("should return true", async () => {
            sandbox.stub(Handler.prototype, 'handleRequest').resolves(true);

            const params = {
                type: VoucherProviderCode.GILA_DISKON
            }
            const result = await VoucherOrderHandler.orderVoucher(params);
            assert.strictEqual(result, true);
        })
    });
});
