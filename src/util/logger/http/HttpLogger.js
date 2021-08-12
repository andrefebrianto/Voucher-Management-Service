const APM = require('elastic-apm-node');
const Config = require('config');

const MongoDbConnectionPool = require('../../database/MongoDb/connection');
const Logger = require('../console/Logger');

COLLECTION_NAME = "logs"

class HttpLogger {
    static async log(logData) {
        try {
            const DatabaseConnection = MongoDbConnectionPool.getConnection(Config.get("mongoDbVoucher"));
            const collection = DatabaseConnection.collection(COLLECTION_NAME);
            await collection.insertOne({ ...logData, createdAt: new Date(), updatedAt: new Date() });
        } catch (error) {
            Logger.error('HttpLogger:log', "Failed to create http call log", error);
            APM.captureError(error);
        }
    }

}

module.exports = HttpLogger;
