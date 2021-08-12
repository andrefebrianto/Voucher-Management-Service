const ErrorMessage = require('../../../constant/ErrorMessage');
const {ERROR:HttpErrorCode} = require('../../../constant/HttpStatusCode')
const ExtendedError = require('../../../model/ExtendedError');
const VoucherCategory = require('../../../model/VoucherCategory');

class CategoryUseCase {
    constructor(commandRepo, queryRepo) {
        this.commandRepo = commandRepo;
        this.queryRepo = queryRepo;
    }

    async createCategory({name, imageUrl}) {
        try {
            const voucherCategory = new VoucherCategory({name, imageUrl, createdAt: new Date(), updatedAt: new Date()})
            voucherCategory.validateValue();
            return await this.commandRepo.insert(voucherCategory);
        } catch (error) {
            if (error.message === ErrorMessage.INVALID_PROPERTY_VALUE) {
                throw new ExtendedError(ErrorMessage.INVALID_INPUT_PARAMETER, HttpErrorCode.BAD_REQUEST);
            }
            throw error;
        }
    }

    async updateCategory({id, name, imageUrl}) {
        try {
            const voucherCategory = new VoucherCategory(await this.queryRepo.getById(id));
            if (name) {
                voucherCategory.name = name;
            }
            if (imageUrl) {
                voucherCategory.imageUrl = imageUrl;
            }
            voucherCategory.validateValue();
            return await this.commandRepo.update(voucherCategory);
        } catch (error) {
            if (error.message === ErrorMessage.INVALID_PROPERTY_VALUE) {
                throw new ExtendedError(ErrorMessage.INVALID_INPUT_PARAMETER, HttpErrorCode.BAD_REQUEST);
            }
            throw error;
        }
    }

    deleteCategory(id) {
        return this.commandRepo.softDelete(id);
    }

    getCategories(page, limit, id, name, orderBy, orderType) {
        return this.queryRepo.getAll(page, limit, id, name, orderBy, orderType);
    }

    countActiveVoucher(id) {
        return this.commandRepo.countActiveVoucher(id);
    }
}

module.exports = CategoryUseCase;
