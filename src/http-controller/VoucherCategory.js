const Apm = require('elastic-apm-node');
const Config = require('config');

//Utilities
const Logger = require('../util/logger/console/Logger');
const ResponseWrapper = require('../util/http/ReponseWrapper');
const PostgreSqlConnectionPool = require('../util/database/PostgreSQL/PostgreSQL');

//Repositories
const VoucherCategoryCommandRepo = require('../domain/VoucherCategory/repository/command/command')
const VoucherCategoryQueryRepo = require('../domain/VoucherCategory/repository/query/query');

//Use Cases
const VoucherCategoryUseCase = require('../domain/VoucherCategory/usecase/VoucherCategoryUseCase');

//Enums
const {ERROR:ErrorCode, SUCCESS:SuccessCode} = require('../constant/HttpStatusCode');

class VoucherCategoryHttpController {
    static async createVoucherCategory(request, response) {
        try {
            const {name, imageUrl} = request.body;

            const voucherCategoryCommandRepo = new VoucherCategoryCommandRepo(PostgreSqlConnectionPool.getConnection(Config.get("postgreSqlVoucher")));
            const voucherCategoryUseCase = new VoucherCategoryUseCase(voucherCategoryCommandRepo);

            await voucherCategoryUseCase.createCategory({name, imageUrl});
            ResponseWrapper.response(response, true, null, "Voucher category created", SuccessCode.CREATED);
        } catch (error) {
            if (error.code) {
                ResponseWrapper.response(response, false, null, error.message, error.code);
                return;
            }
            Logger.error('VoucherCategoryHttpController:createVoucherCategory', 'Error create voucher category', error);
            Apm.captureError(error);
            ResponseWrapper.response(response, false, null, 'Internal server error', ErrorCode.INTERNAL_ERROR);
        }
    }

    static async updateVoucherCategory(request, response) {
        try {
            const {id} = request.params;
            const {name, imageUrl} = request.body;

            const voucherCategoryCommandRepo = new VoucherCategoryCommandRepo(PostgreSqlConnectionPool.getConnection(Config.get("postgreSqlVoucher")));
            const voucherCategoryQueryRepo = new VoucherCategoryQueryRepo(PostgreSqlConnectionPool.getConnection(Config.get("postgreSqlVoucher")));
            const voucherCategoryUseCase = new VoucherCategoryUseCase(voucherCategoryCommandRepo, voucherCategoryQueryRepo);

            await voucherCategoryUseCase.updateCategory({id, name, imageUrl});
            ResponseWrapper.response(response, true, null, "Voucher category updated", SuccessCode.OK);
        } catch (error) {
            if (error.code) {
                ResponseWrapper.response(response, false, null, error.message, error.code);
                return;
            }
            Logger.error('VoucherCategoryHttpController:updateVoucherCategory', 'Error update voucher category', error);
            Apm.captureError(error);
            ResponseWrapper.response(response, false, null, 'Internal server error', ErrorCode.INTERNAL_ERROR);
        }
    }

    static async deleteVoucherCategory(request, response) {
        try {
            const {id} = request.params;

            const voucherCategoryCommandRepo = new VoucherCategoryCommandRepo(PostgreSqlConnectionPool.getConnection(Config.get("postgreSqlVoucher")));
            const voucherCategoryUseCase = new VoucherCategoryUseCase(voucherCategoryCommandRepo);

            await voucherCategoryUseCase.deleteCategory(id);
            ResponseWrapper.response(response, true, null, "Voucher category deleted", SuccessCode.OK);
        } catch (error) {
            if (error.code) {
                ResponseWrapper.response(response, false, null, error.message, error.code);
                return;
            }
            Logger.error('VoucherCategoryHttpController:deleteVoucherCategory', 'Error delete voucher category', error);
            Apm.captureError(error);
            ResponseWrapper.response(response, false, null, 'Internal server error', ErrorCode.INTERNAL_ERROR);
        }
    }

    static async getVoucherCategory(request, response) {
        try {
            const {page, limit, id, name, orderBy, orderType} = request.query;

            const voucherCategoryQueryRepo = new VoucherCategoryQueryRepo(PostgreSqlConnectionPool.getConnection(Config.get("postgreSqlVoucher")));
            const voucherCategoryUseCase = new VoucherCategoryUseCase(null, voucherCategoryQueryRepo);

            const categories = await voucherCategoryUseCase.getCategories(page, limit, id, name, orderBy, orderType);
            ResponseWrapper.response(response, true, categories, "Voucher category(s) retrieved", SuccessCode.OK);
        } catch (error) {
            if (error.code) {
                ResponseWrapper.response(response, false, null, error.message, error.code);
                return;
            }
            Logger.error('VoucherCategoryHttpController:createVoucherCategory', 'Error get voucher category', error);
            Apm.captureError(error);
            ResponseWrapper.response(response, false, null, 'Internal server error', ErrorCode.INTERNAL_ERROR);
        }
    }

    static async getCountActiveVoucher(request, response) {
        try {
            const {id} = request.params;

            const voucherCategoryCommandRepo = new VoucherCategoryCommandRepo(PostgreSqlConnectionPool.getConnection(Config.get("postgreSqlVoucher")));
            const voucherCategoryUseCase = new VoucherCategoryUseCase(voucherCategoryCommandRepo);

            const count = await voucherCategoryUseCase.countActiveVoucher(id);
            ResponseWrapper.response(response, true, count, "Success get count active voucher with referencing category id", SuccessCode.OK);
        } catch (error) {
            if (error.code) {
                ResponseWrapper.response(response, false, null, error.message, error.code);
                return;
            }
            Logger.error('VoucherCategoryHttpController:deleteVoucherCategory', 'Error get count active voucher with referencing category id', error);
            Apm.captureError(error);
            ResponseWrapper.response(response, false, null, 'Internal server error', ErrorCode.INTERNAL_ERROR);
        }
    }
}

module.exports = VoucherCategoryHttpController;
