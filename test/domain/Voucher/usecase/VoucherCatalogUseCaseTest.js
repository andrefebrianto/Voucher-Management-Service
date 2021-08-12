const sandbox = require('sinon').createSandbox();
const assert = require('assert');

const VoucherCatalogUseCase = require('../../../../src/domain/Voucher/usecase/VoucherCatalogUseCase');

describe("Voucher Catalog Use Case Test", () => {
    afterEach(() => {
        sandbox.restore();
    });

    const USER_ID = "60e56fb6094af7e6f521686c", PARTNER_CODE = "ABC";

    describe("getActiveVouchers", () => {
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
            },
            {
                "id": 42,
                "referenceId": "909",
                "categoryId": 6,
                "providerId": 3,
                "name": "Circle K Promo Combo Sosis Bakar [Beef] + Froster Mango Smoothie, Hanya Rp 15.000!",
                "value": 24000,
                "price": 15000,
                "margin": 2000,
                "discount": 0,
                "status": "ACTIVE",
                "term": null,
                "description": null,
                "imageUrl": null,
                "startDate": "2021-05-31T17:00:00.000Z",
                "endDate": "2021-12-30T17:00:00.000Z",
                "stock": null,
                "deletedAt": null,
                "createdAt": "2021-06-30T03:25:47.732Z",
                "updatedAt": "2021-06-30T03:27:06.378Z"
            },
            {
                "id": 43,
                "referenceId": "912",
                "categoryId": 7,
                "providerId": 3,
                "name": "Circle K Promo Voucher Instance HS Gel 90 ML Diskon 50%!",
                "value": 21000,
                "price": 10500,
                "margin": 1000,
                "discount": 0,
                "status": "ACTIVE",
                "term": null,
                "description": null,
                "imageUrl": "https://s3.partner.com/images/vouchers/thumbnails/vouchers-circle-k-promo-voucher-instance-hs-gel-90-ml-diskon-50-1624375737.jpg",
                "startDate": "2021-05-31T17:00:00.000Z",
                "endDate": "2021-12-30T17:00:00.000Z",
                "stock": 10,
                "deletedAt": null,
                "createdAt": "2021-07-01T07:11:36.789Z",
                "updatedAt": "2021-07-01T09:04:28.194Z"
            }
        ]

        const ACTIVE_PARTNER_PROGRAM = {
            "id": "30",
            "partnerCode": "IDH",
            "exchangeRate": 10,
            "minimumAmountPerTransaction": null,
            "maximumAmountPerTransaction": null,
            "maximumTransactionAmountPerDay": null,
            "maximumTransactionAmountPerMonth": null,
            "startDate": "2021-03-17T17:00:00.000Z",
            "endDate": "2021-12-30T17:00:00.000Z"
        }

        it("should return active voucher", async () => {
            const QueryRepoStub = {
                getActiveVouchers: sandbox.stub().resolves({data: ACTIVE_VOUCHERS})
            }
            const GlobalConfigStub = {
                getActivePartnerProgram: sandbox.stub().resolves(ACTIVE_PARTNER_PROGRAM)
            }
            const voucherDetail = {
                name: "Circle K Promo Combo Sosis Bakar [Beef] + Froster Mango Smoothie, Hanya Rp 15.000!",
                stock: 1000,
                expiredDate: "2021-06-30 23:59:59",
                value: 24000,
                price: 12000,
                description: "Sosis bakar dan froster mango smoothie",
                term: "Tukarkan di Circle K terdekat",
                imageUrl: "https://imageurl.com"
            }
            const VoucherAggregator = {
                getVoucherDetail: function () {}
            }
            const VoucherAggregatorStub = sandbox.stub(VoucherAggregator, 'getVoucherDetail');
            VoucherAggregatorStub.onFirstCall().resolves(voucherDetail);
            VoucherAggregatorStub.onSecondCall().resolves(voucherDetail);
            VoucherAggregatorStub.onThirdCall().rejects();
            const voucherCatalogUseCase = new VoucherCatalogUseCase(QueryRepoStub, VoucherAggregator, GlobalConfigStub);
            const result = await voucherCatalogUseCase.getActiveVouchers(USER_ID, PARTNER_CODE);
            const expectedResult = [
                {
                    name: 'Circle K Promo Combo Sosis Bakar [Beef] + Froster Mango Smoothie, Hanya Rp 15.000!',
                    stock: 20,
                    expiredDate: '2021-06-30 23:59:59',
                    value: 24000,
                    price: 15000,
                    description: 'Paket sosis bakar dan forster mango smoothie',
                    term: 'Tukarkan di kasir Circle K terdekat',
                    imageUrl: 'https://s3.partner.com/images/vouchers/thumbnails/vouchers-circle-k-promo-combo-sosis-tusuk-froster-mango-hanya-rp-15000-1-1619769960.jpeg',
                    id: 41,
                    referenceId: '909',
                    categoryId: 6,
                    providerId: 3,
                    margin: 2000,
                    discount: 0,
                    status: 'ACTIVE',
                    startDate: '2021-05-31T17:00:00.000Z',
                    endDate: '2021-12-30T17:00:00.000Z',
                    deletedAt: null,
                    createdAt: '2021-06-30T03:25:47.732Z',
                    updatedAt: '2021-06-30T03:27:06.378Z',
                    priceInUnits: 1700
                },
                {
                    name: 'Circle K Promo Combo Sosis Bakar [Beef] + Froster Mango Smoothie, Hanya Rp 15.000!',
                    stock: 1000,
                    expiredDate: '2021-06-30 23:59:59',
                    value: 24000,
                    price: 15000,
                    description: 'Sosis bakar dan froster mango smoothie',
                    term: 'Tukarkan di Circle K terdekat',
                    imageUrl: 'https://imageurl.com',
                    id: 42,
                    referenceId: '909',
                    categoryId: 6,
                    providerId: 3,
                    margin: 2000,
                    discount: 0,
                    status: 'ACTIVE',
                    startDate: '2021-05-31T17:00:00.000Z',
                    endDate: '2021-12-30T17:00:00.000Z',
                    deletedAt: null,
                    createdAt: '2021-06-30T03:25:47.732Z',
                    updatedAt: '2021-06-30T03:27:06.378Z',
                    priceInUnits: 1700
                }
            ]
            assert.deepStrictEqual(result, expectedResult);
        });
    });

    describe("getActiveVoucherDetail", () => {
        const ACTIVE_PARTNER_PROGRAM = {
            "id": "30",
            "partnerCode": "IDH",
            "exchangeRate": 10,
            "minimumAmountPerTransaction": null,
            "maximumAmountPerTransaction": null,
            "maximumTransactionAmountPerDay": null,
            "maximumTransactionAmountPerMonth": null,
            "startDate": "2021-03-17T17:00:00.000Z",
            "endDate": "2021-12-30T17:00:00.000Z"
        }

        it("should return active voucher detail (using term, desription, stock, and url from database)", async () => {
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
            const QueryRepoStub = {
                getActiveVouchers: sandbox.stub().resolves({data: ACTIVE_VOUCHERS})
            }
            const GlobalConfigStub = {
                getActivePartnerProgram: sandbox.stub().resolves(ACTIVE_PARTNER_PROGRAM)
            }
            const voucherDetail = {
                name: "Circle K Promo Combo Sosis Bakar [Beef] + Froster Mango Smoothie, Hanya Rp 15.000!",
                stock: 1000,
                expiredDate: "2021-06-30 23:59:59",
                value: 24000,
                price: 12000,
                description: "Sosis bakar dan froster mango smoothie",
                term: "Tukarkan di Circle K terdekat",
                imageUrl: "https://imageurl.com"
            }
            const VoucherAggregator = {
                getVoucherDetail: function () {}
            }
            const VoucherAggregatorStub = sandbox.stub(VoucherAggregator, 'getVoucherDetail');
            VoucherAggregatorStub.onFirstCall().resolves(voucherDetail);
            VoucherAggregatorStub.onSecondCall().resolves(voucherDetail);
            VoucherAggregatorStub.onThirdCall().rejects();
            const voucherCatalogUseCase = new VoucherCatalogUseCase(QueryRepoStub, VoucherAggregator, GlobalConfigStub);
            const result = await voucherCatalogUseCase.getActiveVoucherDetail(USER_ID, 41, PARTNER_CODE);
            const expectedResult = {
                name: 'Circle K Promo Combo Sosis Bakar [Beef] + Froster Mango Smoothie, Hanya Rp 15.000!',
                stock: 20,
                expiredDate: '2021-06-30 23:59:59',
                value: 24000,
                price: 15000,
                description: 'Paket sosis bakar dan forster mango smoothie',
                term: 'Tukarkan di kasir Circle K terdekat',
                imageUrl: 'https://s3.partner.com/images/vouchers/thumbnails/vouchers-circle-k-promo-combo-sosis-tusuk-froster-mango-hanya-rp-15000-1-1619769960.jpeg',
                id: 41,
                referenceId: '909',
                categoryId: 6,
                providerId: 3,
                margin: 2000,
                discount: 0,
                status: 'ACTIVE',
                startDate: '2021-05-31T17:00:00.000Z',
                endDate: '2021-12-30T17:00:00.000Z',
                deletedAt: null,
                createdAt: '2021-06-30T03:25:47.732Z',
                updatedAt: '2021-06-30T03:27:06.378Z',
                priceInUnits: 1700
            }
            assert.deepStrictEqual(result, expectedResult);
        });

        it("should return active voucher detail (using term, desription, stock, and url from database)", async () => {
            const ACTIVE_VOUCHERS = [
                {
                    "id": 42,
                    "referenceId": "909",
                    "categoryId": 6,
                    "providerId": 3,
                    "name": "Circle K Promo Combo Sosis Bakar [Beef] + Froster Mango Smoothie, Hanya Rp 15.000!",
                    "value": 24000,
                    "price": 15000,
                    "margin": 2000,
                    "discount": 0,
                    "status": "ACTIVE",
                    "term": null,
                    "description": null,
                    "imageUrl": null,
                    "startDate": "2021-05-31T17:00:00.000Z",
                    "endDate": "2021-12-30T17:00:00.000Z",
                    "stock": null,
                    "deletedAt": null,
                    "createdAt": "2021-06-30T03:25:47.732Z",
                    "updatedAt": "2021-06-30T03:27:06.378Z"
                }
            ]
            const QueryRepoStub = {
                getActiveVouchers: sandbox.stub().resolves({data: ACTIVE_VOUCHERS})
            }
            const GlobalConfigStub = {
                getActivePartnerProgram: sandbox.stub().resolves(ACTIVE_PARTNER_PROGRAM)
            }
            const voucherDetail = {
                name: "Circle K Promo Combo Sosis Bakar [Beef] + Froster Mango Smoothie, Hanya Rp 15.000!",
                stock: 1000,
                expiredDate: "2021-06-30 23:59:59",
                value: 24000,
                price: 12000,
                description: "Sosis bakar dan froster mango smoothie",
                term: "Tukarkan di Circle K terdekat",
                imageUrl: "https://imageurl.com"
            }
            const VoucherAggregator = {
                getVoucherDetail: function () {}
            }
            const VoucherAggregatorStub = sandbox.stub(VoucherAggregator, 'getVoucherDetail');
            VoucherAggregatorStub.onFirstCall().resolves(voucherDetail);
            VoucherAggregatorStub.onSecondCall().resolves(voucherDetail);
            VoucherAggregatorStub.onThirdCall().rejects();
            const voucherCatalogUseCase = new VoucherCatalogUseCase(QueryRepoStub, VoucherAggregator, GlobalConfigStub);
            const result = await voucherCatalogUseCase.getActiveVoucherDetail(USER_ID, 42, PARTNER_CODE);
            const expectedResult = {
                name: 'Circle K Promo Combo Sosis Bakar [Beef] + Froster Mango Smoothie, Hanya Rp 15.000!',
                stock: 1000,
                expiredDate: '2021-06-30 23:59:59',
                value: 24000,
                price: 15000,
                description: 'Sosis bakar dan froster mango smoothie',
                term: 'Tukarkan di Circle K terdekat',
                imageUrl: 'https://imageurl.com',
                id: 42,
                referenceId: '909',
                categoryId: 6,
                providerId: 3,
                margin: 2000,
                discount: 0,
                status: 'ACTIVE',
                startDate: '2021-05-31T17:00:00.000Z',
                endDate: '2021-12-30T17:00:00.000Z',
                deletedAt: null,
                createdAt: '2021-06-30T03:25:47.732Z',
                updatedAt: '2021-06-30T03:27:06.378Z',
                priceInUnits: 1700
            }
            assert.deepStrictEqual(result, expectedResult);
        });
    });
});
