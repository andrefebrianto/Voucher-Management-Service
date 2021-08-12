class VoucherCatalogUseCase {
    constructor(mongodbQueryRepo, voucherAggregator) {
        this.mongodbQueryRepo = mongodbQueryRepo;
        this.voucherAggregator = voucherAggregator;
    }

    async getVoucherStatus(userId, transactionId) {
        const voucherTransaction = await this.mongodbQueryRepo.getUserTransactionById(userId, transactionId);

        const params = {
            type: voucherTransaction.voucher.providerId,
            voucherCode: voucherTransaction.voucher.voucherCode
        }
        const voucherStatus = await this.voucherAggregator.getVoucherStatus(params);

        return { ...voucherTransaction, voucher: {...voucherTransaction.voucher, ...voucherStatus} };
    }
}

module.exports = VoucherCatalogUseCase;
