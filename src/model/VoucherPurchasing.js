const IssuedVoucher = require('./IssuedVoucher');
const ErrorMessage = require("../constant/ErrorMessage");

class VoucherPurchasing {
    constructor({userId, transactionId, voucher, isPurchaseSuccess = false, createdAt, updatedAt }) {
        this.userId = userId;
        this.transactionId = transactionId;
        if (voucher) {
            this.voucher = new IssuedVoucher(voucher);
        }
        this.isPurchaseSuccess = isPurchaseSuccess;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    validateValue() {
        if (this.voucher) {
            this.voucher.validateValue();
        }

        const errors = [];

        if (!this.userId) {
            errors.push(new Error("Voucher must have a user id"));
        }

        if (typeof this.transactionId !== "string") {
            errors.push(new Error("Voucher must have a transaction id"));
        }

        if (errors.length > 0) {
            const error = new Error(ErrorMessage.INVALID_PROPERTY_VALUE);
            error.data = errors;
            throw error;
        }
    }
}

module.exports = VoucherPurchasing;
