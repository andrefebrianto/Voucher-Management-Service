const Apm = require('elastic-apm-node');
const Config = require('config');

//Utilities
const Logger = require('../util/logger/console/Logger');
const ResponseWrapper = require('../util/http/ReponseWrapper');
const PostgreSqlConnectionPool = require('../util/database/PostgreSQL/PostgreSQL');

//Repositories
const VoucherProviderCommandRepo = require('../domain/VoucherProvider/repository/command/command')
const VoucherProviderQueryRepo = require('../domain/VoucherProvider/repository/query/query');

//Use Cases
const VoucherProviderUseCase = require('../domain/VoucherProvider/usecase/VoucherProviderUseCase');

//Enums
const {ERROR:ErrorCode, SUCCESS:SuccessCode} = require('../constant/HttpStatusCode');

class VoucherProviderHttpController {
    static async createVoucherProvider(request, response) {
        try {
            const voucherProviderCommandRepo = new VoucherProviderCommandRepo(PostgreSqlConnectionPool.getConnection(Config.get("postgreSqlVoucher")));
            const voucherProviderUseCase = new VoucherProviderUseCase(voucherProviderCommandRepo);

            await voucherProviderUseCase.createVoucherProvider(request.body);
            ResponseWrapper.response(response, true, null, "Voucher provider created", SuccessCode.CREATED);
        } catch (error) {
            if (error.code) {
                ResponseWrapper.response(response, false, null, error.message, error.code);
                return;
            }
            Logger.error('VoucherProviderHttpController:createVoucherProvider', 'Error create voucher provider', error);
            Apm.captureError(error);
            ResponseWrapper.response(response, false, null, 'Internal server error', ErrorCode.INTERNAL_ERROR);
        }
    }

    static async updateVoucherProvider(request, response) {
        try {
            const {id} = request.params;
            const {name} = request.body;

            const voucherProviderCommandRepo = new VoucherProviderCommandRepo(PostgreSqlConnectionPool.getConnection(Config.get("postgreSqlVoucher")));
            const voucherProviderQueryRepo = new VoucherProviderQueryRepo(PostgreSqlConnectionPool.getConnection(Config.get("postgreSqlVoucher")));
            const voucherProviderUseCase = new VoucherProviderUseCase(voucherProviderCommandRepo, voucherProviderQueryRepo);

            await voucherProviderUseCase.updateVoucherProvider({id, name});
            ResponseWrapper.response(response, true, null, "Voucher provider updated", SuccessCode.OK);
        } catch (error) {
            if (error.code) {
                ResponseWrapper.response(response, false, null, error.message, error.code);
                return;
            }
            Logger.error('VoucherProviderHttpController:updateVoucherProvider', 'Error update voucher provider', error);
            Apm.captureError(error);
            ResponseWrapper.response(response, false, null, 'Internal server error', ErrorCode.INTERNAL_ERROR);
        }
    }

    static async deleteVoucherProvider(request, response) {
        try {
            const {id} = request.params;

            const voucherProviderCommandRepo = new VoucherProviderCommandRepo(PostgreSqlConnectionPool.getConnection(Config.get("postgreSqlVoucher")));
            const voucherProviderUseCase = new VoucherProviderUseCase(voucherProviderCommandRepo);

            await voucherProviderUseCase.deleteVoucherProvider(id);
            ResponseWrapper.response(response, true, null, "Voucher provider deleted", SuccessCode.OK);
        } catch (error) {
            if (error.code) {
                ResponseWrapper.response(response, false, null, error.message, error.code);
                return;
            }
            Logger.error('VoucherProviderHttpController:deleteVoucherProvider', 'Error delete voucher provider', error);
            Apm.captureError(error);
            ResponseWrapper.response(response, false, null, 'Internal server error', ErrorCode.INTERNAL_ERROR);
        }
    }

    static async getVoucherProvider(request, response) {
        try {
            const {page, limit, id, name, orderBy, orderType} = request.query;

            const voucherProviderQueryRepo = new VoucherProviderQueryRepo(PostgreSqlConnectionPool.getConnection(Config.get("postgreSqlVoucher")));
            const voucherProviderUseCase = new VoucherProviderUseCase(null, voucherProviderQueryRepo);

            const categories = await voucherProviderUseCase.getVoucherProviders(page, limit, id, name, orderBy, orderType);
            ResponseWrapper.response(response, true, categories, "Voucher provider(s) retrieved", SuccessCode.OK);
        } catch (error) {
            if (error.code) {
                ResponseWrapper.response(response, false, null, error.message, error.code);
                return;
            }
            Logger.error('VoucherProviderHttpController:getVoucherProvider', 'Error get voucher provider', error);
            Apm.captureError(error);
            ResponseWrapper.response(response, false, null, 'Internal server error', ErrorCode.INTERNAL_ERROR);
        }
    }

    static async getCountActiveVoucher(request, response) {
        try {
            const {id} = request.params;
            console.log("\nhttp-controller : ", id)
            const voucherProviderCommandRepo = new VoucherProviderCommandRepo(PostgreSqlConnectionPool.getConnection(Config.get("postgreSqlVoucher")));
            const voucherProviderUseCase = new VoucherProviderUseCase(voucherProviderCommandRepo);

            const count = await voucherProviderUseCase.countActiveVoucher(id);
            ResponseWrapper.response(response, true, count, "Success get count active voucher with referencing provider id", SuccessCode.OK);
        } catch (error) {
            if (error.code) {
                ResponseWrapper.response(response, false, null, error.message, error.code);
                return;
            }
            Logger.error('VoucherCategoryHttpController:deleteVoucherCategory', 'Error get count active voucher with referencing provider id', error);
            Apm.captureError(error);
            ResponseWrapper.response(response, false, null, 'Internal server error', ErrorCode.INTERNAL_ERROR);
        }
    }

}

module.exports = VoucherProviderHttpController;
