const sandbox = require('sinon').createSandbox();
const assert = require('assert');
const apm = require('elastic-apm-node');

const VoucherProviderService = require('../../../../src/external-service/VoucherProvider/service/VoucherProviderService');
const HttpClient = require('../../../../src/util/http/HttpClient');

const {ERROR:HttpErrorCode} = require('../../../../src/constant/HttpStatusCode');
const ErrorMessage = require('../../../../src/constant/ErrorMessage');
const ExtendedError = require('../../../../src/model/ExtendedError');

describe("Voucher Provider Service Test", () => {
    beforeEach(() => {
        sandbox.stub(apm, 'captureError');
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("getVoucherDetail", () => {
        const USER_ID = "60e3cc6f305d22478e249498", VOUCHER_ID = 123;

        it("should return voucher detail", async () => {
            const response = {
                "status": "success",
                "message": [
                    "get voucher detail"
                ],
                "results": {
                    "id": 910,
                    "slug": "hei-cheese-promo-voucher-buy-1-get-1-free-flavored-drink",
                    "name": "Hei Cheese Promo Voucher Buy 1 Get 1 FREE [Flavored Drink]!",
                    "type": "special",
                    "max_used": 1,
                    "period": "day",
                    "total_stock": 250,
                    "current_stock": 241,
                    "expired_date": "2021-06-30 23:59:59",
                    "start_price": 36000,
                    "final_price": 18000,
                    "saving_value": 18000,
                    "total_likes": 0,
                    "last_liked": null,
                    "thumbnail": "https://s3.partner.com/images/vouchers/thumbnails/vouchers-hei-cheese-promo-voucher-buy-1-get-1-free-flavored-drink-1-1620200680.png",
                    "last_comment": [],
                    "ribbon": null,
                    "total_views": "53.8K"
                }
            }
            sandbox.stub(HttpClient, 'sendRequest').resolves(response);

            const result = await VoucherProviderService.getVoucherDetail(USER_ID, VOUCHER_ID);
            assert.deepStrictEqual(result, response.results);
        });

        it("should throw error (unexpected error)", async () => {
            const response = {
                "status": "error",
                "message": [
                    "The voucher id must be a number."
                ]
            }
            try {
                sandbox.stub(HttpClient, 'sendRequest').resolves(response);

                await VoucherProviderService.getVoucherDetail(USER_ID, VOUCHER_ID);
            } catch (error) {
                const expectedError = new ExtendedError(ErrorMessage.UNEXPECTED_RESPONSE, HttpErrorCode.FORBIDDEN);
                expectedError.data = response;
                assert.deepStrictEqual(error, expectedError);
            }
        });

        it("should throw error (internal server error)", async () => {
            const response = {
                "status": "error",
                "message": [
                    "The voucher id must be a number."
                ]
            }
            try {
                sandbox.stub(HttpClient, 'sendRequest').rejects(response);

                await VoucherProviderService.getVoucherDetail(USER_ID, VOUCHER_ID);
            } catch (error) {
                const expectedError = new ExtendedError(ErrorMessage.INTERNAL_SERVER_ERROR, HttpErrorCode.INTERNAL_ERROR);
                assert.deepStrictEqual(error, expectedError);
            }
        });
    });

    describe("orderVoucher", () => {
        const USER_ID = "60e3cc6f305d22478e249498", VOUCHER_ID = 123;

        it("should return voucher reservation", async () => {
            const response = {
                "status": "success",
                "message": [
                    "Berhasil membuat external voucher code"
                ],
                "results": {
                    "partner_user_id": 829,
                    "partner_id": 6,
                    "voucher_id": 909,
                    "voucher_code_id": 804011,
                    "external_voucher_code": "b3cc94be-c5c4-433f-a2c0-ff2aebcd1089",
                    "used_date": null,
                    "status": "1",
                    "created_at": "2021-05-17 11:06:55",
                    "id": 895,
                    "voucher_name": "Circle K Promo Combo Sosis Bakar [Beef] + Froster Mango Smoothie, Hanya Rp 15.000!",
                    "guest_id": "606c0350e451238e195eb6b0",
                    "is_used": false
                }
            }
            sandbox.stub(HttpClient, 'sendRequest').resolves(response);

            const result = await VoucherProviderService.orderVoucher(USER_ID, VOUCHER_ID);
            assert.deepStrictEqual(result, response.results);
        });

        it("should throw error (voucher expired)", async () => {
            const response = {
                "status": "error",
                "message": {
                    "voucher_id": [
                        "Voucher sudah expired"
                    ]
                }
            }
            try {
                sandbox.stub(HttpClient, 'sendRequest').resolves(response);
    
                await VoucherProviderService.orderVoucher(USER_ID, VOUCHER_ID);
            } catch (error) {
                const expectedError = new ExtendedError("Voucher expired", HttpErrorCode.NOT_FOUND);
                expectedError.data = response;
                assert.deepStrictEqual(error, expectedError);
            }
        });

        it("should throw error (unexpected response)", async () => {
            const response = {
                "status": "error",
                "message": {
                    "voucher_id": [
                        "Voucher harus berupa angka"
                    ]
                }
            }
            try {
                sandbox.stub(HttpClient, 'sendRequest').resolves(response);
    
                await VoucherProviderService.orderVoucher(USER_ID, VOUCHER_ID);
            } catch (error) {
                const expectedError = new ExtendedError(ErrorMessage.UNEXPECTED_RESPONSE, HttpErrorCode.FORBIDDEN);
                expectedError.data = response;
                assert.deepStrictEqual(error, expectedError);
            }
        });

        it("should throw error (internal server error)", async () => {
            const response = {
                "status": "error",
                "message": {
                    "voucher_id": [
                        "Voucher sudah expired"
                    ]
                }
            }
            try {
                sandbox.stub(HttpClient, 'sendRequest').rejects(response);
    
                await VoucherProviderService.orderVoucher(USER_ID, VOUCHER_ID);
            } catch (error) {
                const expectedError = new ExtendedError(ErrorMessage.INTERNAL_SERVER_ERROR, HttpErrorCode.INTERNAL_ERROR);
                assert.deepStrictEqual(error, expectedError);
            }
        });
    });

    describe("getVoucherStatus", () => {
        const VOUCHER_CODE = "b3cc94be-c5c4-433f-a2c0-ff2aebcd1089";

        it("should return voucher status", async () => {
            const response = {
                "status": "success",
                "message": [
                    "Berhasil mendapatkan voucher detail"
                ],
                "results": {
                    "id": 909,
                    "slug": "circle-k-promo-combo-sosis-bakar-beef-froster-mango-smoothie-hanya-rp-15000",
                    "name": "Circle K Promo Combo Sosis Bakar [Beef] + Froster Mango Smoothie, Hanya Rp 15.000!",
                    "type": "special",
                    "minimum_buy": null,
                    "max_used": 5,
                    "period": "day",
                    "total_stock": 2000,
                    "current_stock": 608,
                    "expired_date": "2021-06-30 23:59:59",
                    "start_price": 24000,
                    "final_price": 15000,
                    "saving_value": 9000,
                    "merchant_id": 976,
                    "merchant_name": "Circle K Indonesia",
                    "merchant_slug": "Circle-K-Indonesia",
                    "merchant_is_online": 0,
                    "merchant_image": "https://s3.partner.com/images/merchants/merchant-1591853926.jpg",
                    "is_favourite": 0,
                    "is_any_outlet": 1,
                    "total_review": 5,
                    "rate": 5,
                    "total_likes": 0,
                    "last_liked": null,
                    "thumbnail": "https://s3.partner.com/images/vouchers/thumbnails/vouchers-circle-k-promo-combo-sosis-tusuk-froster-mango-hanya-rp-15000-1-1619769960.jpeg",
                    "last_comment": [],
                    "ribbon": null,
                    "total_views": "61.2K",
                    "images": [
                        {
                            "id": 6641,
                            "image_url": "https://s3.partner.com/images/vouchers/vouchers-circle-k-promo-combo-sosis-tusuk-froster-mango-hanya-rp-15000-1-1619769960.jpeg"
                        }
                    ],
                    "categories": [
                        {
                            "object_id": 909,
                            "name": "Makanan",
                            "slug": "makanan"
                        }
                    ],
                    "is_used": false
                }
            }
            sandbox.stub(HttpClient, 'sendRequest').resolves(response);

            const result = await VoucherProviderService.getVoucherStatus(VOUCHER_CODE);
            assert.deepStrictEqual(result, response.results);
        });

        it("should throw error (unexpected error)", async () => {
            const response = {
                "status": "error",
                "message": [
                    "The voucher id must be a number."
                ]
            }
            try {
                sandbox.stub(HttpClient, 'sendRequest').resolves(response);

                await VoucherProviderService.getVoucherStatus(VOUCHER_CODE)
            } catch (error) {
                const expectedError = new ExtendedError(ErrorMessage.UNEXPECTED_RESPONSE, HttpErrorCode.FORBIDDEN);
                expectedError.data = response;
                assert.deepStrictEqual(error, expectedError);
            }
        });

        it("should throw error (internal server error)", async () => {
            const response = {
                "status": "error",
                "message": [
                    "The voucher id must be a number."
                ]
            }
            try {
                sandbox.stub(HttpClient, 'sendRequest').rejects(response);

                await VoucherProviderService.getVoucherStatus(VOUCHER_CODE);
            } catch (error) {
                const expectedError = new ExtendedError(ErrorMessage.INTERNAL_SERVER_ERROR, HttpErrorCode.INTERNAL_ERROR);
                assert.deepStrictEqual(error, expectedError);
            }
        });
    });
});
