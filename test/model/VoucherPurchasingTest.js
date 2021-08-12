const Assert = require('assert');

const VoucherPurchasing = require('../../src/model/VoucherPurchasing');
const VoucherStatus = require('../../src/constant/VoucherStatus');
const VoucherType = require('../../src/constant/VoucherType');

describe("Voucher Purchasing Model Test", () => {
    describe("constructor", () => {
        it("should return voucher purchasing instance", () => {
            const transaction = {
                id: "60e2b487ed9efda3d259c6dc",
                userId: "60e2b48f2f898e013bfd26af",
                transactionId: "f870bc8e-5001-41c3-aef6-6b9edc07469c",
                voucher: {
                    voucherId: 123,
                    referenceId: "888",
                    categoryId: 1,
                    providerId: 2,
                    name: "Voucher Belanja",
                    value: 15000,
                    price: 8000,
                    margin: 3000,
                    discount: 1000,
                    status: VoucherStatus.ACTIVE,
                    voucherType: VoucherType.TEXT_CODE,
                    term: "Tukarkan voucher di merchant terdekat",
                    description: "Voucher belanja pakaian",
                    voucherCode: "vobtvKJgtyxGFHmh9FmA",
                    isUsed: false,
                    issuedAt: new Date(),
                    usedAt: null,
                    expiredAt: null,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                createdAt: new Date(),
                updatedAt: new Date()
            }
            const voucherPurchasing = new VoucherPurchasing(transaction);
            voucherPurchasing.validateValue();
            Assert.strictEqual(voucherPurchasing.voucher.name, "Voucher Belanja");
        });

        it("should throw an error", () => {
            try {
                const voucherPurchasing = new VoucherPurchasing({});
                voucherPurchasing.validateValue();
            } catch (error) {
                Assert.notDeepStrictEqual(error, null);
            }
        });
    })
});
