const TransactionService = require('../service/TransactionService');
const Logger = require('../../../util/logger/console/Logger');

class TransactionUseCase {
    static async updateTransaction(transactionId, transactionStatus) {
        try {
            await TransactionService.updateTransaction(transactionId, transactionStatus);
        } catch (error) {
            Logger.error("TransactionUseCase:updateTransaction", "Error update transaction", error);
        }
    }
}

module.exports = TransactionUseCase;
