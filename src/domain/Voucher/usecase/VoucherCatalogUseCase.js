const ExtendedError = require("../../../model/ExtendedError");
const {ERROR:HttpErrorCode} = require('../../../constant/HttpStatusCode');

class VoucherCatalogUseCase {
    constructor(queryRepo, voucherAggregator, globalConfig) {
        this.queryRepo = queryRepo;
        this.voucherAggregator = voucherAggregator;
        this.globalConfig = globalConfig;
    }

    async getActiveVouchers(userId, partnerCode, page, limit, id, categoryId) {
        const activeVouchers = await this.queryRepo.getActiveVouchers(page, limit, id, categoryId);
        const partnerProgram = await this.globalConfig.getActivePartnerProgram(partnerCode);
        const availableVouchers = [];

        for (const voucher of activeVouchers.data) {  
            try {
                const params = {
                    type: voucher.providerId,
                    userId,
                    voucherId: voucher.referenceId
                }
                const voucherDetail = await this.voucherAggregator.getVoucherDetail(params);
                const finalPrice = voucher.price + voucher.margin - voucher.discount;
                const priceInUnits = Math.ceil(finalPrice / partnerProgram.exchangeRate);

                const activeVoucher = {
                    ...voucherDetail,
                    ...voucher,
                    stock: voucher.stock || voucherDetail.stock,
                    description: voucher.description || voucherDetail.description,
                    term: voucher.term || voucherDetail.term,
                    imageUrl: voucher.imageUrl|| voucherDetail.imageUrl,
                    priceInUnits
                }
                availableVouchers.push(activeVoucher);
            } catch (error) {
                continue;
            }
        }

        if (availableVouchers.length === 0) {
            throw new ExtendedError("Voucher(s) not found", HttpErrorCode.NOT_FOUND)
        }

        return availableVouchers;
    }

    async getActiveVoucherDetail(userId, voucherId, partnerCode) {
        const activeVouchers = await this.queryRepo.getActiveVouchers(null, null, voucherId, null);
        const partnerProgram = await this.globalConfig.getActivePartnerProgram(partnerCode);

        //active voucher only return one voucher
        for (const voucher of activeVouchers.data) {        
            const params = {
                type: voucher.providerId,
                userId,
                voucherId: voucher.referenceId
            }
            const voucherDetail = await this.voucherAggregator.getVoucherDetail(params);
            const finalPrice = voucher.price + voucher.margin - voucher.discount;
            const priceInUnits = Math.ceil(finalPrice / partnerProgram.exchangeRate);
            const activeVoucher = {
                ...voucherDetail,
                ...voucher,
                stock: voucher.stock || voucherDetail.stock,
                description: voucher.description || voucherDetail.description,
                term: voucher.term || voucherDetail.term,
                imageUrl: voucher.imageUrl|| voucherDetail.imageUrl,
                priceInUnits
            }
            return activeVoucher;
        }
    }
}

module.exports = VoucherCatalogUseCase;
