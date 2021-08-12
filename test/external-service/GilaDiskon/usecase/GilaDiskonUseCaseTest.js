const sandbox = require('sinon').createSandbox();
const assert = require('assert');

const VoucherProviderUseCase = require('../../../../src/external-service/VoucherProvider/usecase/VoucherProviderUseCase');
const VoucherProviderService = require('../../../../src/external-service/VoucherProvider/service/VoucherProviderService');

describe("Voucher Provider Use Case Test", () => {
    afterEach(() => {
        sandbox.restore();
    });

    describe("getVoucherDetail", () => {
        const PARAMS = {
            userId: "60e3cc6f305d22478e249498",
            voucherId: 910
        }

        it("should return voucher detail", async () => {
            const voucherDetail = {
                "id": 910,
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
                "description": "",
                "term": "",
                "total_likes": 0,
                "last_liked": null,
                "thumbnail": "https://s3.partner.com/images/vouchers/thumbnails/vouchers-hei-cheese-promo-voucher-buy-1-get-1-free-flavored-drink-1-1620200680.png",
                "last_comment": [],
                "ribbon": null,
                "total_views": "53.8K"
            }
            sandbox.stub(VoucherProviderService, 'getVoucherDetail').resolves(voucherDetail);

            const result = await VoucherProviderUseCase.getVoucherDetail(PARAMS);
            const expectedResult = {
                name: voucherDetail.name,
                stock: voucherDetail.total_stock,
                expiredDate: voucherDetail.expired_date,
                value: voucherDetail.start_price,
                price: voucherDetail.final_price,
                description: voucherDetail.description,
                term: voucherDetail.term,
                imageUrl: voucherDetail.thumbnail
            }
            assert.deepStrictEqual(result, expectedResult);
        });
    });

    describe("orderVoucher", () => {
        const PARAMS = {
            userId: "60e3cc6f305d22478e249498",
            voucherId: 910
        }

        it("should return voucher reservation result", async () => {
            const reservationResult = {
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
            sandbox.stub(VoucherProviderService, 'orderVoucher').resolves(reservationResult);
            const voucherStatus = {
                expiredDate: "2021-07-01 23:59:59",
                isUsed: false
            }
            sandbox.stub(VoucherProviderUseCase, 'getVoucherStatus').resolves(voucherStatus);

            const result = await VoucherProviderUseCase.orderVoucher(PARAMS);
            const expectedResult = {
                name: reservationResult.voucher_name,
                voucherId: reservationResult.voucher_id,
                voucherCode: reservationResult.external_voucher_code,
                issuedAt: reservationResult.created_at,
                expiredAt: voucherStatus.expiredAt,
                isUsed: voucherStatus.isUsed
            }
            assert.deepStrictEqual(result, expectedResult);
        });
    });

    describe("getVoucherStatus", () => {
        const PARAMS = {
            voucherCode: "216be373-7800-42c2-93a7-0f984d436dc3"
        }

        it("should return voucher status", async () => {
            const voucherStatus = {
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
            sandbox.stub(VoucherProviderService, 'getVoucherStatus').resolves(voucherStatus);

            const result = await VoucherProviderUseCase.getVoucherStatus(PARAMS);
            const expectedResult = {
                expiredAt: voucherStatus.expired_date,
                isUsed: voucherStatus.is_used
            }
            assert.deepStrictEqual(result, expectedResult);
        });
    });
});
