const ErrorMessage = require('../../../constant/ErrorMessage');
const {ERROR:HttpErrorCode} = require('../../../constant/HttpStatusCode')
const ExtendedError = require('../../../model/ExtendedError');
const VoucherProvider = require('../../../model/VoucherProvider');

class VoucherProviderUseCase {
    constructor(commandRepo, queryRepo) {
        this.commandRepo = commandRepo;
        this.queryRepo = queryRepo;
    }

    async createVoucherProvider({name}) {
        try {
            const voucherProvider = new VoucherProvider({name, createdAt: new Date(), updatedAt: new Date()})
            voucherProvider.validateValue();
            return await this.commandRepo.insert(voucherProvider);
        } catch (error) {
            if (error.message === ErrorMessage.INVALID_PROPERTY_VALUE) {
                throw new ExtendedError(ErrorMessage.INVALID_INPUT_PARAMETER, HttpErrorCode.BAD_REQUEST);
            }
            throw error;
        }
    }

    async updateVoucherProvider({id, name}) {
        try {
            const voucherProvider = new VoucherProvider(await this.queryRepo.getById(id));
            if (name) {
                voucherProvider.name = name;
            }
            voucherProvider.validateValue();
            return await this.commandRepo.update(voucherProvider);
        } catch (error) {
            if (error.message === ErrorMessage.INVALID_PROPERTY_VALUE) {
                throw new ExtendedError(ErrorMessage.INVALID_INPUT_PARAMETER, HttpErrorCode.BAD_REQUEST);
            }
            throw error;
        }
    }

    deleteVoucherProvider(id) {
        return this.commandRepo.softDelete(id);
    }

    countActiveVoucher(id) {
        console.log("\nVoucherProviderUseCase : ", id)
        return this.commandRepo.countActiveVoucher(id);
    }

    getVoucherProviders(page, limit, id, name, orderBy, orderType) {
        return this.queryRepo.getAll(page, limit, id, name, orderBy, orderType);
    }


}

module.exports = VoucherProviderUseCase;
