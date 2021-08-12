const APM = require('elastic-apm-node');
const Config = require('config');

const HttpMethod = require('../../../constant/HttpMethod');
const {ERROR:HttpErrorCode} = require('../../../constant/HttpStatusCode');
const ErrorMessage = require('../../../constant/ErrorMessage');
const ExtendedError = require('../../../model/ExtendedError');
const ClientConfig = Config.get("TransactionServiceConfig");
const RESPONSE_STATUS = {
    SUCCESS: true,
    FAIL: false
}
const RESPONSE_MESSAGE = {
    NOT_FOUND: "Active partner program not found"
}

const HttpClient = require('../../../util/http/HttpClient');
const Logger = require('../../../util/logger/console/Logger');

class TransactionService {
    static async updateTransaction(transactionId, transactionStatus) {
        try {
            const body = {
                transactionStatus
            }
            const result = await HttpClient.sendRequest(HttpMethod.PATCH, ClientConfig.baseUrl, `${ClientConfig.transactionPath}/${transactionId}`, null, null, body);
            return result.data;
        } catch (error) {
            Logger.error("TransactionService:updateTransaction", "Error update transaction", error);
            APM.captureError(error, { custom: error });
            if (error.message === "Request failed with status code 404") {
                throw new ExtendedError(RESPONSE_MESSAGE.NOT_FOUND, HttpErrorCode.NOT_FOUND);
            }
            throw new ExtendedError(ErrorMessage.INTERNAL_SERVER_ERROR, HttpErrorCode.INTERNAL_ERROR);
        }
    }
}

module.exports = TransactionService;
