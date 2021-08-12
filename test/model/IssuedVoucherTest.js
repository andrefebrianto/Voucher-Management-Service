const Assert = require('assert');

const IssuedVoucher = require('../../src/model/IssuedVoucher');
const VoucherStatus = require('../../src/constant/VoucherStatus');
const VoucherType = require('../../src/constant/VoucherType');

describe("Issued Voucher Model Test", () => {
    describe("constructor", () => {
        it("should return issued voucher instance", () => {
            const voucher = {
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
                issuedAt: new Date(),
                usedAt: null,
                expiredAt: null,
                createdAt: new Date(),
                updatedAt: new Date()
            }
            const issuedVoucher = new IssuedVoucher(voucher);
            issuedVoucher.validateValue();
            Assert.strictEqual(issuedVoucher.name, "Voucher Belanja");
        });

        it("should throw an error", () => {
            try {
                const issuedVoucher = new IssuedVoucher({});
                issuedVoucher.validateValue();
            } catch (error) {
                Assert.notDeepStrictEqual(error, null);
            }
        });
    })
});
