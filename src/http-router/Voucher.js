const VoucherController = require('../http-controller/Voucher');
const InputValidator = require('../http-input-validator/Voucher');
const validateInput = require('../http-input-validator/InputValidator');

const routes = (server) => {
    server.post('/api/v1/vouchers', [InputValidator.validateInsertVoucher, validateInput], VoucherController.createVoucher);
    server.patch('/api/v1/vouchers/:id', [InputValidator.validateUpdateVoucher, validateInput], VoucherController.updateVoucher);
    server.delete('/api/v1/vouchers/:id', [InputValidator.validateDeleteVoucher, validateInput], VoucherController.deleteVoucher);
    server.get('/api/v1/vouchers', [InputValidator.validateGetVoucher, validateInput], VoucherController.getVouchers);
    server.post('/api/v1/active-vouchers', [InputValidator.validateGetActiveVoucher, validateInput], VoucherController.getActiveVouchers);
    server.post('/api/v1/vouchers/orders', [InputValidator.validateOrder, validateInput], VoucherController.orderVoucher);
    server.get('/api/v1/vouchers/orders/:transactionId', [InputValidator.validateGetStatus, validateInput], VoucherController.getVoucherStatus);
};

module.exports = {routes};
