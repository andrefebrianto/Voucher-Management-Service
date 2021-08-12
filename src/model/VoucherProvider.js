const ErrorMessage = require('../constant/ErrorMessage');

class VoucherProvider {
    constructor({id, name, createdAt, updatedAt, deletedAt}) {
        this.id = id;
        this.name = name;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
    }

    validateValue() {
        const errors = [];

        if (typeof this.name !== "string") {
            errors.push(new Error("Voucher provider must have a name"));
        }

        if (!this.createdAt) {
            errors.push(new Error("Voucher must have a creation timestamp"));
        }

        if (!this.updatedAt) {
            errors.push(new Error("Voucher must have a update timestamp"));
        }

        if (errors.length > 0) {
            const error = new Error(ErrorMessage.INVALID_PROPERTY_VALUE);
            error.data = errors;
            throw error;
        }
    }
}

module.exports = VoucherProvider;
