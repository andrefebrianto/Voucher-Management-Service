const VoucherProviderController = require('../http-controller/VoucherProvider');
const InputValidator = require('../http-input-validator/VoucherProvider');
const validateInput = require('../http-input-validator/InputValidator');

const routes = (server) => {
    server.post('/api/v1/voucher-providers', [InputValidator.validateInsertProvider, validateInput], VoucherProviderController.createVoucherProvider);
    server.patch('/api/v1/voucher-providers/:id', [InputValidator.validateUpdateProvider, validateInput], VoucherProviderController.updateVoucherProvider);
    server.delete('/api/v1/voucher-providers/:id', [InputValidator.validateDeleteProvider, validateInput], VoucherProviderController.deleteVoucherProvider);
    server.get('/api/v1/voucher-providers', [InputValidator.validateGetProvider, validateInput], VoucherProviderController.getVoucherProvider);
    server.get('/api/v1/voucher-providers/active-voucher/:id', [InputValidator.validateCountProvider, validateInput], VoucherProviderController.getCountActiveVoucher);
};

module.exports = {routes};
