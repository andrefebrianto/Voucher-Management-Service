const Handler = require('../../../model/Handler');
const VoucherProviderCode = require('../../../constant/VoucherProviderCode');

const VoucherProviderUseCase = require('../../../external-service/VoucherProvider/usecase/VoucherProviderUseCase');

const PartnerVoucherOrderHandler = new Handler(VoucherProviderCode.GILA_DISKON, VoucherProviderUseCase.orderVoucher);

class VoucherOrderHandler {
    static orderVoucher(params) {
        return PartnerVoucherOrderHandler.handleRequest(params);
    }
}

module.exports = VoucherOrderHandler;
