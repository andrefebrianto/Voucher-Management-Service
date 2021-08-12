class VoucherOrderUseCase {
    constructor(voucherCatalog, voucherOrderAggregator, commandRepoCatalog, commandRepoTransaction) {
        this.voucherCatalog = voucherCatalog;
        this.voucherOrderAggregator = voucherOrderAggregator;
        this.commandRepoCatalog = commandRepoCatalog;
        this.commandRepoTransaction = commandRepoTransaction;
    }

    async orderVoucher(userId, voucherId, transactionId, partnerCode) {
        const activeVouchers = await this.voucherCatalog.getActiveVoucherDetail(userId, voucherId, partnerCode);
        const params = {
            type: activeVouchers.providerId,
            userId,
            voucherId: activeVouchers.referenceId
        }
        const reservation = await this.voucherOrderAggregator.orderVoucher(params);
        const voucherOrder = {
            userId,
            transactionId,
            isPurchaseSuccess: true,
            voucher: {
                ...reservation,
                ...activeVouchers,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        };
        const voucherTransaction = await this.commandRepoTransaction.insert(voucherOrder);
        await this.commandRepoCatalog.decreaseStock(activeVouchers.id, 1);
        return voucherTransaction;
    }
}

module.exports = VoucherOrderUseCase;
