const Config = require('config');
const VoucherProviderService = require('../service/VoucherProviderService');
const REDEEM_URL = Config.get("VoucherProviderClientConfig.voucherRedeemUrl");

class VoucherProviderUseCase {
    static async getVoucherDetail(params) {
        const { userId, voucherId } = params;
        const voucherDetail = await VoucherProviderService.getVoucherDetail(userId, voucherId);
        return {
            name: voucherDetail.name,
            stock: voucherDetail.total_stock,
            expiredDate: voucherDetail.expired_date,
            value: voucherDetail.start_price,
            price: voucherDetail.final_price,
            description: voucherDetail.description,
            term: voucherDetail.term,
            imageUrl: voucherDetail.thumbnail
        }
    }

    static async orderVoucher(params) {
        const { userId, voucherId } = params;
        const reservationResult = await VoucherProviderService.orderVoucher(userId, voucherId);
        const voucherStatus = await VoucherProviderUseCase.getVoucherStatus({voucherCode: reservationResult.external_voucher_code});
        return {
            name: reservationResult.voucher_name,
            voucherId: reservationResult.voucher_id,
            voucherCode: reservationResult.external_voucher_code,
            issuedAt: reservationResult.created_at,
            expiredAt: voucherStatus.expiredAt,
            isUsed: voucherStatus.isUsed
        }
    }

    static async getVoucherStatus(params) {
        const { voucherCode } = params;
        const voucherStatus = await VoucherProviderService.getVoucherStatus(voucherCode);
        return {
            expiredAt: voucherStatus.expired_date,
            isUsed: voucherStatus.is_used
        }
    }
}

module.exports = VoucherProviderUseCase;
