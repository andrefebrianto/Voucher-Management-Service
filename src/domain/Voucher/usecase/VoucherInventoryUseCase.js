const ErrorMessage = require('../../../constant/ErrorMessage');
const {ERROR:HttpErrorCode} = require('../../../constant/HttpStatusCode')
const ExtendedError = require('../../../model/ExtendedError');
const Voucher = require('../../../model/Voucher');

class VoucherInventoryUseCase {
    constructor(commandRepo, queryRepo) {
        this.commandRepo = commandRepo;
        this.queryRepo = queryRepo;
    }

    async createVoucher({referenceId, categoryId, providerId, name, value, price, margin, discount, status, voucherType, term, description, imageUrl, startDate,
        endDate, stock}) {
            try {
            const voucher = new Voucher({referenceId, categoryId, providerId, name, value, price, margin, discount, status, voucherType, term, description, imageUrl,
                startDate, endDate, stock, createdAt: new Date(), updatedAt: new Date()});
            voucher.validateValue();
            return await this.commandRepo.insert(voucher);
        } catch (error) {
            if (error.message === ErrorMessage.INVALID_PROPERTY_VALUE) {
                throw new ExtendedError(ErrorMessage.INVALID_INPUT_PARAMETER, HttpErrorCode.BAD_REQUEST);
            }
            throw error;
        }
    }

    async updateVoucher({id, referenceId, categoryId, providerId, name, value, price, margin, discount, status, voucherType, term, description, imageUrl, startDate,
        endDate, stock}) {
            try {
            const voucher = new Voucher(await this.queryRepo.getById(id));
    
            this.setTermAndDescription(voucher, term, description);
            this.setPrice(voucher, value, price, margin, discount);
            this.setPeriod(voucher, startDate, endDate);
    
            if (referenceId) {
                voucher.referenceId = referenceId;
            }
            if (categoryId) {
                voucher.categoryId = categoryId;
            }
            if (providerId) {
                voucher.providerId = providerId;
            }
            if (name) {
                voucher.name = name;
            }
            if (status) {
                voucher.status = status;
            }
            if (voucherType) {
                voucher.voucherType = voucherType;
            }
            if (imageUrl) {
                voucher.imageUrl = imageUrl;
            }
            if (stock) {
                voucher.stock = stock;
            }
            voucher.validateValue();
            return await this.commandRepo.update(voucher);
        } catch (error) {
            if (error.message === ErrorMessage.INVALID_PROPERTY_VALUE) {
                throw new ExtendedError(ErrorMessage.INVALID_INPUT_PARAMETER, HttpErrorCode.BAD_REQUEST);
            }
            throw error;
        }
    }

    deleteVoucher(id) {
        return this.commandRepo.softDelete(id);
    }

    getVouchers(page, limit, id, filter, orderBy, orderType) {
        return this.queryRepo.getVouchers(page, limit, id, filter, orderBy, orderType);
    }

    setTermAndDescription(voucher, term, description){
        if (term) {
            voucher.term = term;
        }
        if (description) {
            voucher.description = description;
        }
    }

    setPrice(voucher, value, price, margin, discount) {
        if (value) {
            voucher.value = value;
        }
        if (price) {
            voucher.price = price;
        }
        if (margin) {
            voucher.margin = margin;
        }
        if (discount) {
            voucher.discount = discount;
        }
    }

    setPeriod(voucher, startDate, endDate) {
        if (startDate) {
            voucher.startDate = startDate;
        }
        if (endDate) {
            voucher.endDate = endDate;
        }
    }
}

module.exports = VoucherInventoryUseCase;
