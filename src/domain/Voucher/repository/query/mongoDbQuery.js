const APM = require('elastic-apm-node');
const ObjectId = require('mongodb').ObjectID;

const Logger = require('../../../../util/logger/console/Logger');
const ExtendedError = require('../../../../model/ExtendedError');
const {ERROR:ErrorCode} = require('../../../../constant/HttpStatusCode');
const VoucherPurchasing = require('../../../../model/VoucherPurchasing');
const ErrorMessage = require('../../../../constant/ErrorMessage');

const COLLECTION_NAME = "transactions";

class MongoDbQuery {
    constructor(database) {
        this.database = database.collection(COLLECTION_NAME);
    }

    async getUserTransactionById(userId, transactionId) {
        try {
            const result = await this.database.findOne({userId: new ObjectId(userId), transactionId});
            if (!result) {
                throw new ExtendedError("Voucher transaction not found", ErrorCode.NOT_FOUND);
            }
            const voucherPurchasing = new VoucherPurchasing(result);
            return voucherPurchasing;
        } catch (error) {
            Logger.error("VoucherMongoDbQuery:getUserTransactionById", "Error get voucher transaction", error);
            APM.captureError(error);
            if (error instanceof ExtendedError) {
                throw error;
            }
            throw new ExtendedError(ErrorMessage.INTERNAL_SERVER_ERROR, ErrorCode.INTERNAL_ERROR);
        }
    }
}

module.exports = MongoDbQuery;
