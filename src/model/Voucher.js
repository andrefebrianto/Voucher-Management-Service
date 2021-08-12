const VoucherStatus = require("../constant/VoucherStatus");
const VoucherType = require("../constant/VoucherType");
const ErrorMessage = require("../constant/ErrorMessage");

class Voucher {
    constructor({id, referenceId, categoryId, providerId, name, value, price, margin, discount, status, voucherType, term, description, imageUrl, startDate, endDate, stock,
        deletedAt, createdAt, updatedAt }) {
        this.id = id;
        this.categoryId = categoryId;
        this.providerId = providerId;
        this.referenceId = referenceId;
        this.name = name;
        this.value = value;
        this.price = price;
        this.margin = margin;
        this.discount = discount;
        this.status = status;
        this.voucherType = voucherType;
        this.term = term;
        this.description = description;
        this.imageUrl = imageUrl;
        this.startDate = startDate;
        this.endDate = endDate;
        this.stock = stock;
        this.deletedAt = deletedAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    validateValue() {
        const errors = [];

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

        if (!VoucherStatus.getEnumValue().includes(this.status)) {
            errors.push(new Error("Voucher must have a defined status"));
        }

        if (!VoucherType.getEnumValue().includes(this.voucherType)) {
            errors.push(new Error("Voucher must have a defined voucher type"));
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

module.exports = Voucher;
