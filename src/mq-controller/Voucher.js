const Apm = require('elastic-apm-node');
const Config = require('config');

//Utilities
const Logger = require('../util/logger/console/Logger');
const PostgreSqlConnectionPool = require('../util/database/PostgreSQL/PostgreSQL');
const MongoDbConnectionPool = require('../util/database/MongoDb/connection');
const TransactionStatus = require('../constant/TransactionStatus');
const ErrorMessage = require('../constant/ErrorMessage');
const MessageBroker = require('../util/message-broker/MessageBroker');

//Repositories
const VoucherSqlCommandRepo = require('../domain/Voucher/repository/command/sqlCommand')
const VoucherMongoCommandRepo = require('../domain/Voucher/repository/command/mongoDbCommand')
const VoucherSqlQueryRepo = require('../domain/Voucher/repository/query/sqlQuery');

//Use Cases
const VoucherCatalogUseCase = require('../domain/Voucher/usecase/VoucherCatalogUseCase');
const VoucherOrderUseCase = require('../domain/Voucher/usecase/VoucherOrderUseCase');
const GlobalConfigUseCase = require('../external-service/GlobalConfig/usecase/GlobalConfigUseCase');
const TransactionUseCase = require('../external-service/Transaction/usecase/TransactionUseCase');

//Chain Handler
const VoucherDetailHandler = require('../domain/Voucher/handler/VoucherDetailHandler');
const VoucherOrderHandler = require('../domain/Voucher/handler/VoucherOrderHandler');

class VoucherMQController {
    static async orderVoucher(payload) {
        try {
            const { userId, transactionId } = payload;
            const { productCode:voucherId } = payload.product;
            const { code:partnerCode } = payload.source;

            const voucherSqlQueryRepo = new VoucherSqlQueryRepo(PostgreSqlConnectionPool.getConnection(Config.get("postgreSqlVoucher")));
            const voucherCatalogUseCase = new VoucherCatalogUseCase(voucherSqlQueryRepo, VoucherDetailHandler, GlobalConfigUseCase);
            const voucherMongoCommandRepo = new VoucherMongoCommandRepo(MongoDbConnectionPool.getConnection(Config.get("mongoDbVoucher")));
            const voucherSqlCommandRepo = new VoucherSqlCommandRepo(PostgreSqlConnectionPool.getConnection(Config.get("postgreSqlVoucher")));
            const voucherOrderUseCase = new VoucherOrderUseCase(voucherCatalogUseCase, VoucherOrderHandler, voucherSqlCommandRepo, voucherMongoCommandRepo);

            await voucherMongoCommandRepo.insert(payload);
            await voucherOrderUseCase.orderVoucher(userId, voucherId, transactionId, partnerCode);
            await TransactionUseCase.updateTransaction(transactionId, TransactionStatus.SUCCESS);
        } catch (error) {
            Logger.error('VoucherMQController:orderVoucher', 'Error order voucher', error);
            Apm.captureError(error);
            if (error.message  === ErrorMessage.UNEXPECTED_RESPONSE) {
                await TransactionUseCase.updateTransaction(transactionId, TransactionStatus.FAILED);
                await MessageBroker.publishMessage(payload, Config.get("KafkaConfig.balanceRefundTopic"));
                await MessageBroker.publishMessage(payload, Config.get("KafkaConfig.vaRefundTopic"));
            }
        }
    }
}

module.exports = VoucherMQController;
