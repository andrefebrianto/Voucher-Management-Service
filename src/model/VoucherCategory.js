const ErrorMessage = require("../constant/ErrorMessage");

class VoucherCategory {
    constructor({id, name, imageUrl, createdAt, updatedAt, deletedAt}) {
        this.id = id;
        this.name = name;
        this.imageUrl = imageUrl;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
    }

    validateValue() {
        const errors = [];

        if (!this.name) {
            errors.push(new Error("Category must have a name"));
        }

        if (!this.createdAt) {
            errors.push(new Error("Category must have a creation timestamp"));
        }

        if (!this.updatedAt) {
            errors.push(new Error("Category must have a update timestamp"));
        }

        if (errors.length > 0) {
            const error = new Error(ErrorMessage.INVALID_PROPERTY_VALUE);
            error.data = errors;
            throw error;
        }
    }
}

module.exports = VoucherCategory;
