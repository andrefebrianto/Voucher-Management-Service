const Assert = require('assert');

const VoucherProvider = require('../../src/model/VoucherProvider');

describe("Voucher Provider Model Test", () => {
    describe("constructor", () => {
        it("should return voucher instance", () => {
            const voucherProvider = new VoucherProvider({name: "Ultra Voucher", createdAt: new Date(), updatedAt: new Date()});
            voucherProvider.validateValue();
            Assert.strictEqual(voucherProvider.name, "Ultra Voucher");
        });

        it("should throw an error", () => {
            try {
                const voucherProvider = new VoucherProvider({});
                voucherProvider.validateValue();
            } catch (error) {
                Assert.notDeepStrictEqual(error, null);
            }
        });
    })
});
