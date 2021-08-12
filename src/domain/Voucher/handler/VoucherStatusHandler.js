const Handler = require('../../../model/Handler');
const VoucherProviderCode = require('../../../constant/VoucherProviderCode');

const VoucherProviderUseCase = require('../../../external-service/VoucherProvider/usecase/VoucherProviderUseCase');

const PartnerVoucherStatusHandler = new Handler(VoucherProviderCode.GILA_DISKON, VoucherProviderUseCase.getVoucherStatus);

class VoucherStatusHandler {
    static getVoucherStatus(params) {
        return PartnerVoucherStatusHandler.handleRequest(params);
    }
}

module.exports = VoucherStatusHandler;
