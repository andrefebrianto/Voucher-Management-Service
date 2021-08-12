const VoucherCategoryController = require('../http-controller/VoucherCategory');
const InputValidator = require('../http-input-validator/VoucherCategory');
const validateInput = require('../http-input-validator/InputValidator');

const routes = (server) => {
    server.post('/api/v1/voucher-categories', [InputValidator.validateInsertCategory, validateInput], VoucherCategoryController.createVoucherCategory);
    server.patch('/api/v1/voucher-categories/:id', [InputValidator.validateUpdateCategory, validateInput], VoucherCategoryController.updateVoucherCategory);
    server.delete('/api/v1/voucher-categories/:id', [InputValidator.validateDeleteCategory, validateInput], VoucherCategoryController.deleteVoucherCategory);
    server.get('/api/v1/voucher-categories', [InputValidator.validateGetCategory, validateInput], VoucherCategoryController.getVoucherCategory);
    server.get('/api/v1/voucher-categories/active-voucher/:id', [InputValidator.validateCountCategory, validateInput], VoucherCategoryController.getCountActiveVoucher);
};

module.exports = {routes};
