const sandbox = require('sinon').createSandbox();
const assert = require('assert');

const VoucherOrderUseCase = require('../../../../src/domain/Voucher/usecase/VoucherOrderUseCase');
const VoucherPurchasing = require('../../../../src/model/VoucherPurchasing');

describe("Voucher Order Use Case Test", () => {
    afterEach(() => {
        sandbox.restore();
    });

    const USER_ID = "60e56fb6094af7e6f521686c", TRANSACTION_ID = "1e36d29c-ab32-4d0d-9d99-a522d32b925f", VOUCHER_ID = 123, PARTNER_CODE = "ABC";

    describe("orderVoucher", () => {
        const ACTIVE_VOUCHERS = [
            {
                "id": 41,
                "referenceId": "909",
                "categoryId": 6,
                "providerId": 3,
                "name": "Circle K Promo Combo Sosis Bakar [Beef] + Froster Mango Smoothie, Hanya Rp 15.000!",
                "value": 24000,
                "price": 15000,
                "margin": 2000,
                "discount": 0,
                "status": "ACTIVE",
                "term": "Tukarkan di kasir Circle K terdekat",
                "description": "Paket sosis bakar dan forster mango smoothie",
                "imageUrl": "https://s3.partner.com/images/vouchers/thumbnails/vouchers-circle-k-promo-combo-sosis-tusuk-froster-mango-hanya-rp-15000-1-1619769960.jpeg",
                "startDate": "2021-05-31T17:00:00.000Z",
                "endDate": "2021-12-30T17:00:00.000Z",
                "stock": 20,
                "deletedAt": null,
                "createdAt": "2021-06-30T03:25:47.732Z",
                "updatedAt": "2021-06-30T03:27:06.378Z"
            }
        ]

        it("should return voucher order", async () => {
            const voucherOrder = {
                name: "Circle K Promo Combo Sosis Bakar [Beef] + Froster Mango Smoothie, Hanya Rp 15.000!",
                voucherId: 41,
                voucherCode: "38bfca35-4000-4432-9340-b08575b9c4e4",
                issuedAt: new Date()
            }
            const CatalogUseCaseStub = {
                getActiveVoucherDetail: sandbox.stub().resolves({data: ACTIVE_VOUCHERS})
            }
            const CommandTransactionRepoStub = {
                insert: sandbox.stub().resolves(new VoucherPurchasing({userId: USER_ID, transactionId: TRANSACTION_ID, voucher: {...ACTIVE_VOUCHERS[0], ...voucherOrder} }))
            }
            const CommandCatalogRepoStub = {
                decreaseStock: sandbox.stub().resolves(true)
            }
            const VoucherAggregatorStub = {
                orderVoucher: sandbox.stub().resolves(voucherOrder)
            }

            const voucherOrderUseCase = new VoucherOrderUseCase(CatalogUseCaseStub, VoucherAggregatorStub, CommandCatalogRepoStub, CommandTransactionRepoStub);
            const result = await voucherOrderUseCase.orderVoucher(USER_ID, VOUCHER_ID, TRANSACTION_ID, PARTNER_CODE);
            const expectedResult = new VoucherPurchasing({userId: USER_ID, transactionId: TRANSACTION_ID, voucher: {...ACTIVE_VOUCHERS[0], ...voucherOrder} });
            assert.deepStrictEqual(result, expectedResult);
        });
    });
});
