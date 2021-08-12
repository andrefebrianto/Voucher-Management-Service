const Assert = require('assert');

const VoucherCategory = require('../../src/model/VoucherCategory');

describe("Voucher Category Model Test", () => {
    describe("constructor", () => {
        it("should return category instance", () => {
            const voucherCategory = new VoucherCategory({name: "Fashion", createdAt: new Date(), updatedAt: new Date()});
            voucherCategory.validateValue();
            Assert.strictEqual(voucherCategory.name, "Fashion");
        });

        it("should throw an error", () => {
            try {
                const voucherCategory = new VoucherCategory({});
                voucherCategory.validateValue();
            } catch (error) {
                Assert.notDeepStrictEqual(error, null);
            }
        });
    })
});
