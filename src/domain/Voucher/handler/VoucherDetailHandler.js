const Handler = require('../../../model/Handler');
const VoucherProviderCode = require('../../../constant/VoucherProviderCode');

const VoucherProviderUseCase = require('../../../external-service/VoucherProvider/usecase/VoucherProviderUseCase');

const PartnerVoucherDetailHandler = new Handler(VoucherProviderCode.GILA_DISKON, VoucherProviderUseCase.getVoucherDetail);

class VoucherDetailHandler {
    static getVoucherDetail(params) {
        return PartnerVoucherDetailHandler.handleRequest(params);
    }
}

module.exports = VoucherDetailHandler;
