const ErrorMessage = require("../constant/ErrorMessage");
const VoucherType = require("../constant/VoucherType");

class IssuedVoucher {
    constructor({voucherId, referenceId, categoryId, providerId, voucherType, name, value, price, margin, discount, term, description, issuedAt, usedAt,
        voucherCode, isUsed = false, expiredDate, createdAt, updatedAt }) {
        this.voucherId = voucherId;
        this.categoryId = categoryId;
        this.providerId = providerId;
        this.referenceId = referenceId;
        this.voucherType = voucherType;
        this.name = name;
        this.value = value;
        this.price = price;
        this.margin = margin;
        this.discount = discount;
        this.term = term;
        this.description = description;
        this.voucherCode = voucherCode;
        this.isUsed = isUsed;
        this.issuedAt = issuedAt;
        this.usedAt = usedAt;
        this.expiredAt = expiredDate;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    validateValue() {
        const errors = [];
    
        if (typeof this.voucherId !== "number") {
            errors.push(new Error("Voucher must have a voucher id"));
        }

        if (typeof this.categoryId !== "number") {
            errors.push(new Error("Voucher must have a category id"));
        }

        if (typeof this.providerId !== "number") {
            errors.push(new Error("Voucher must have a provider id"));
        }

        if (typeof this.referenceId !== "string") {
            errors.push(new Error("Voucher must have a reference id"));
        }

        if (!VoucherType.getEnumValue().includes(this.voucherType)) {
            errors.push(new Error("Voucher must have a defined voucher type"));
        }

        if (typeof this.name !== "string") {
            errors.push(new Error("Voucher must have a name"));
        }

        if (typeof this.value !== "number") {
            errors.push(new Error("Voucher must have value"));
        }

        if (typeof this.price !== "number") {
            errors.push(new Error("Voucher must have price"));
        }

        if (typeof this.margin !== "number") {
            errors.push(new Error("Voucher must have margin"));
        }

        if (typeof this.discount !== "number") {
            errors.push(new Error("Voucher must have discount"));
        }

        if (errors.length > 0) {
            const error = new Error(ErrorMessage.INVALID_PROPERTY_VALUE);
            error.data = errors;
            throw error;
        }
    }
}

module.exports = IssuedVoucher;
