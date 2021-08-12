const Apm = require('elastic-apm-node');
const Config = require('config');

//Utilities
const Logger = require('../util/logger/console/Logger');
const ResponseWrapper = require('../util/http/ReponseWrapper');
const PostgreSqlConnectionPool = require('../util/database/PostgreSQL/PostgreSQL');
const MongoDbConnectionPool = require('../util/database/MongoDb/connection');

//Repositories
const VoucherSqlCommandRepo = require('../domain/Voucher/repository/command/sqlCommand')
const VoucherMongoCommandRepo = require('../domain/Voucher/repository/command/mongoDbCommand')
const VoucherSqlQueryRepo = require('../domain/Voucher/repository/query/sqlQuery');
const VoucherMongoQueryRepo = require('../domain/Voucher/repository/query/mongoDbQuery');

//Use Cases
const VoucherInventoryUseCase = require('../domain/Voucher/usecase/VoucherInventoryUseCase');
const VoucherCatalogUseCase = require('../domain/Voucher/usecase/VoucherCatalogUseCase');
const VoucherOrderUseCase = require('../domain/Voucher/usecase/VoucherOrderUseCase');
const VoucherStatusUseCase = require('../domain/Voucher/usecase/VoucherStatusUseCase');
const GlobalConfigUseCase = require('../external-service/GlobalConfig/usecase/GlobalConfigUseCase');

//Chain Handler
const VoucherDetailHandler = require('../domain/Voucher/handler/VoucherDetailHandler');
const VoucherOrderHandler = require('../domain/Voucher/handler/VoucherOrderHandler');
const VoucherStatusHandler = require('../domain/Voucher/handler/VoucherStatusHandler');

//Enums
const {ERROR:ErrorCode, SUCCESS:SuccessCode} = require('../constant/HttpStatusCode');

class VoucherHttpController {
    static async createVoucher(request, response) {
        try {
            const voucherSqlCommandRepo = new VoucherSqlCommandRepo(PostgreSqlConnectionPool.getConnection(Config.get("postgreSqlVoucher")));
            const voucherInventoryUseCase = new VoucherInventoryUseCase(voucherSqlCommandRepo);

            await voucherInventoryUseCase.createVoucher(request.body);
            ResponseWrapper.response(response, true, null, "Voucher created", SuccessCode.CREATED);
        } catch (error) {
            if (error.code) {
                ResponseWrapper.response(response, false, null, error.message, error.code);
                return;
            }
            Logger.error('VoucherHttpController:createVoucher', 'Error create voucher', error);
            Apm.captureError(error);
            ResponseWrapper.response(response, false, null, 'Internal server error', ErrorCode.INTERNAL_ERROR);
        }
    }

    static async updateVoucher(request, response) {
        try {
            const {id} = request.params;

            const voucherSqlCommandRepo = new VoucherSqlCommandRepo(PostgreSqlConnectionPool.getConnection(Config.get("postgreSqlVoucher")));
            const voucherSqlQueryRepo = new VoucherSqlQueryRepo(PostgreSqlConnectionPool.getConnection(Config.get("postgreSqlVoucher")));
            const voucherInventoryUseCase = new VoucherInventoryUseCase(voucherSqlCommandRepo, voucherSqlQueryRepo);

            await voucherInventoryUseCase.updateVoucher({id, ... request.body});
            ResponseWrapper.response(response, true, null, "Voucher updated", SuccessCode.OK);
        } catch (error) {
            if (error.code) {
                ResponseWrapper.response(response, false, null, error.message, error.code);
                return;
            }
            Logger.error('VoucherHttpController:updateVoucher', 'Error update voucher', error);
            Apm.captureError(error);
            ResponseWrapper.response(response, false, null, 'Internal server error', ErrorCode.INTERNAL_ERROR);
        }
    }

    static async deleteVoucher(request, response) {
        try {
            const {id} = request.params;

            const voucherSqlCommandRepo = new VoucherSqlCommandRepo(PostgreSqlConnectionPool.getConnection(Config.get("postgreSqlVoucher")));
            const voucherInventoryUseCase = new VoucherInventoryUseCase(voucherSqlCommandRepo);

            await voucherInventoryUseCase.deleteVoucher(id);
            ResponseWrapper.response(response, true, null, "Voucher deleted", SuccessCode.OK);            
        } catch (error) {
            if (error.code) {
                ResponseWrapper.response(response, false, null, error.message, error.code);
                return;
            }
            Logger.error('VoucherHttpController:deleteVoucher', 'Error delete voucher', error);
            Apm.captureError(error);
            ResponseWrapper.response(response, false, null, 'Internal server error', ErrorCode.INTERNAL_ERROR);
        }
    }

    static async getVouchers(request, response) {
        try {
            const {page, limit, id, filter, orderBy, orderType} = request.query;

            const voucherSqlQueryRepo = new VoucherSqlQueryRepo(PostgreSqlConnectionPool.getConnection(Config.get("postgreSqlVoucher")));
            const voucherInventoryUseCase = new VoucherInventoryUseCase(null, voucherSqlQueryRepo);

            const vouchers = await voucherInventoryUseCase.getVouchers(page, limit, id, filter, orderBy, orderType);
            ResponseWrapper.response(response, true, vouchers, "Voucher(s) retrieved", SuccessCode.OK);            
        } catch (error) {
            if (error.code) {
                ResponseWrapper.response(response, false, null, error.message, error.code);
                return;
            }
            Logger.error('VoucherHttpController:getVouchers', 'Error get voucher', error);
            Apm.captureError(error);
            ResponseWrapper.response(response, false, null, 'Internal server error', ErrorCode.INTERNAL_ERROR);
        }
    }

    static async getActiveVouchers(request, response) {
        try {
            const userId = request.headers["x-user-id"];
            const {page, limit} = request.query;
            const {partnerCode, voucherId, categoryId} = request.body;

            const voucherSqlQueryRepo = new VoucherSqlQueryRepo(PostgreSqlConnectionPool.getConnection(Config.get("postgreSqlVoucher")));
            const voucherCatalogUseCase = new VoucherCatalogUseCase(voucherSqlQueryRepo, VoucherDetailHandler, GlobalConfigUseCase);

            if (voucherId) {
                const voucher = await voucherCatalogUseCase.getActiveVoucherDetail(userId, voucherId, partnerCode);
                ResponseWrapper.response(response, true, voucher, "Voucher(s) retrieved", SuccessCode.OK);
            } else {
                const vouchers = await voucherCatalogUseCase.getActiveVouchers(userId, partnerCode, page, limit, null, categoryId);
                ResponseWrapper.response(response, true, vouchers, "Voucher(s) retrieved", SuccessCode.OK);            
            }
        } catch (error) {
            if (error.code) {
                ResponseWrapper.response(response, false, null, error.message, error.code);
                return;
            }
            Logger.error('VoucherHttpController:getActiveVouchers', 'Error get active voucher', error);
            Apm.captureError(error);
            ResponseWrapper.response(response, false, null, 'Internal server error', ErrorCode.INTERNAL_ERROR);
        }
    }

    static async orderVoucher(request, response) {
        try {
            const userId = request.headers["x-user-id"];
            const {transactionId, voucherId, partnerCode} = request.body;

            const voucherSqlQueryRepo = new VoucherSqlQueryRepo(PostgreSqlConnectionPool.getConnection(Config.get("postgreSqlVoucher")));
            const voucherCatalogUseCase = new VoucherCatalogUseCase(voucherSqlQueryRepo, VoucherDetailHandler, GlobalConfigUseCase);
            const voucherMongoCommandRepo = new VoucherMongoCommandRepo(MongoDbConnectionPool.getConnection(Config.get("mongoDbVoucher")));
            const voucherSqlCommandRepo = new VoucherSqlCommandRepo(PostgreSqlConnectionPool.getConnection(Config.get("postgreSqlVoucher")));
            const voucherOrderUseCase = new VoucherOrderUseCase(voucherCatalogUseCase, VoucherOrderHandler, voucherSqlCommandRepo, voucherMongoCommandRepo);

            const voucherOrder = await voucherOrderUseCase.orderVoucher(userId, voucherId, transactionId, partnerCode);
            ResponseWrapper.response(response, true, voucherOrder, "Voucher(s) retrieved", SuccessCode.OK);
        } catch (error) {
            if (error.code) {
                ResponseWrapper.response(response, false, null, error.message, error.code);
                return;
            }
            Logger.error('VoucherHttpController:orderVoucher', 'Error order voucher', error);
            Apm.captureError(error);
            ResponseWrapper.response(response, false, null, 'Internal server error', ErrorCode.INTERNAL_ERROR);
        }
    }

    static async getVoucherStatus(request, response) {
        try {
            const userId = request.headers["x-user-id"];
            const { transactionId } = request.params;

            const voucherMongoQueryRepo = new VoucherMongoQueryRepo(MongoDbConnectionPool.getConnection(Config.get("mongoDbVoucher")));
            const voucherStatusUseCase = new VoucherStatusUseCase(voucherMongoQueryRepo, VoucherStatusHandler);

            const vouchers = await voucherStatusUseCase.getVoucherStatus(userId, transactionId);
            ResponseWrapper.response(response, true, vouchers, "Voucher(s) retrieved", SuccessCode.OK);            
        } catch (error) {
            if (error.code) {
                ResponseWrapper.response(response, false, null, error.message, error.code);
                return;
            }
            Logger.error('VoucherHttpController:getVouchers', 'Error get voucher', error);
            Apm.captureError(error);
            ResponseWrapper.response(response, false, null, 'Internal server error', ErrorCode.INTERNAL_ERROR);
        }
    }
}

module.exports = VoucherHttpController;
