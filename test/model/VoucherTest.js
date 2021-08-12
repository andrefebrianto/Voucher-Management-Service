const Assert = require('assert');

const Voucher = require('../../src/model/Voucher');
const VoucherStatus = require('../../src/constant/VoucherStatus');
const VoucherType = require('../../src/constant/VoucherType');

describe("Voucher Model Test", () => {
    describe("constructor", () => {
        it("should return voucher instance", () => {
            const voucher = new Voucher({name: "Fashion", value: 50000, price: 25000, margin: 2500, discount: 0, createdAt: new Date(), updatedAt: new Date(),
            status: VoucherStatus.ACTIVE, voucherType: VoucherType.TEXT_CODE});
            voucher.validateValue();
            Assert.strictEqual(voucher.name, "Fashion");
        });

        it("should throw an error", () => {
            try {
                const voucher = new Voucher({});
                voucher.validateValue();
            } catch (error) {
                Assert.notDeepStrictEqual(error, null);
            }
        });
    })
});
