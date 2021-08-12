const APM = require('elastic-apm-node');
const ObjectId = require('mongodb').ObjectID;

const Logger = require('../../../../util/logger/console/Logger');
const ExtendedError = require('../../../../model/ExtendedError');
const ErrorMessage = require('../../../../constant/ErrorMessage');
const {ERROR:ErrorCode} = require('../../../../constant/HttpStatusCode');
const VoucherPurchasing = require('../../../../model/VoucherPurchasing');

const COLLECTION_NAME = "transactions";

class MongoDbCommand {
    constructor(database) {
        this.database = database.collection(COLLECTION_NAME);
    }

    async insert(document) {
        try {
            const voucherPurchasing = new VoucherPurchasing(document);
            voucherPurchasing.userId = new ObjectId(voucherPurchasing.userId);
            voucherPurchasing.validateValue();
            await this.database.updateOne({transactionId: voucherPurchasing.transactionId}, { $set: {...voucherPurchasing, createdAt: new Date(), updatedAt: new Date()}},
            { upsert: true });
            return voucherPurchasing;
        } catch (error) {
            Logger.error("VoucherMongoDbCommand:insert", "Error insert vouchers", error);
            APM.captureError(error);
            throw new ExtendedError(ErrorMessage.INTERNAL_SERVER_ERROR, ErrorCode.INTERNAL_ERROR);
        }
    }
}

module.exports = MongoDbCommand;
