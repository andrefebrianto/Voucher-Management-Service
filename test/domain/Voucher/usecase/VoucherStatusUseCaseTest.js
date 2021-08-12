const sandbox = require('sinon').createSandbox();
const assert = require('assert');

const VoucherStatusUseCase = require('../../../../src/domain/Voucher/usecase/VoucherStatusUseCase');
const VoucherStatus = require('../../../../src/constant/VoucherStatus');
const VoucherType = require('../../../../src/constant/VoucherType');

describe("Voucher Status Use Case Test", () => {
    afterEach(() => {
        sandbox.restore();
    });

    const USER_ID = "60e56fb6094af7e6f521686c", TRANSACTION_ID = "1e36d29c-ab32-4d0d-9d99-a522d32b925f";
    const TRANSACTION = {
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
            expiredAt: "2021-06-30 23:59:59",
            createdAt: new Date(),
            updatedAt: new Date()
        },
        createdAt: new Date(),
        updatedAt: new Date()
    }

    describe("getVoucherStatus", () => {
        it("should return voucher status", async () => {
            const QueryRepoStub = {
                getUserTransactionById: sandbox.stub().resolves(TRANSACTION)
            }
            const voucherStatus = {
                expiredAt: "2021-06-30 23:59:59",
                isUsed: false
            }
            const VoucherAggregatorStub = {
                getVoucherStatus: sandbox.stub().resolves(voucherStatus)
            }

            const voucherStatusUseCase = new VoucherStatusUseCase(QueryRepoStub, VoucherAggregatorStub);
            const result = await voucherStatusUseCase.getVoucherStatus(USER_ID, TRANSACTION_ID);
            assert.deepStrictEqual(result, TRANSACTION);
        });
    });
});
