const APM = require('elastic-apm-node');
const Config = require('config');

const HttpMethod = require('../../../constant/HttpMethod');
const {ERROR:HttpErrorCode} = require('../../../constant/HttpStatusCode');
const ErrorMessage = require('../../../constant/ErrorMessage');
const ExtendedError = require('../../../model/ExtendedError');
const ClientConfig = Config.get("VoucherProviderClientConfig");
const RESPONSE_STATUS = {
    SUCCESS: "success",
    ERROR: "error"
}
const RESPONSE_MESSAGE = {
    VOUCHER_EXPIRED: "Voucher sudah expired"
}

const HttpClient = require('../../../util/http/HttpClient');
const Logger = require('../../../util/logger/console/Logger');

class VoucherProviderService {
    static async getVoucherDetail(userId, voucherId) {
        try {
            const body = {
                reference_id: userId,
                voucher_id: voucherId
            }
            const headers = {
                Authorization: `Bearer ${ClientConfig.accessKey}`
            }
    
            const voucher = await HttpClient.sendRequest(HttpMethod.POST, ClientConfig.baseUrl, ClientConfig.voucherDetailPath, null, headers, body);
            if (voucher.status === RESPONSE_STATUS.SUCCESS) {
                return voucher.results;
            } else {
                const error = new ExtendedError(ErrorMessage.UNEXPECTED_RESPONSE, HttpErrorCode.FORBIDDEN);
                error.data = voucher;
                throw error;
            }
        } catch (error) {
            Logger.error("VoucherProviderService:getVoucherDetail", "Error get voucher detail", error);
            APM.captureError(error, { custom: error });
            if (error instanceof ExtendedError) {
                throw error;
            }
            throw new ExtendedError(ErrorMessage.INTERNAL_SERVER_ERROR, HttpErrorCode.INTERNAL_ERROR);
        }
    }

    static async orderVoucher(userId, voucherId) {
        try {
            const body = {
                reference_id: userId,
                voucher_id: voucherId
            }
            const headers = {
                Authorization: `Bearer ${ClientConfig.accessKey}`
            }
    
            const voucher = await HttpClient.sendRequest(HttpMethod.POST, ClientConfig.baseUrl, ClientConfig.voucherReservationPath, null, headers, body);
            if (voucher.status === RESPONSE_STATUS.SUCCESS) {
                return voucher.results;
            } else if (voucher.message.voucher_id[0] === RESPONSE_MESSAGE.VOUCHER_EXPIRED){
                const error = new ExtendedError("Voucher expired", HttpErrorCode.NOT_FOUND);
                error.data = voucher;
                throw error;
            } else {
                const error = new ExtendedError(ErrorMessage.UNEXPECTED_RESPONSE, HttpErrorCode.FORBIDDEN);
                error.data = voucher;
                throw error;
            }
        } catch (error) {
            Logger.error("VoucherProviderService:orderVoucher", "Error order voucher", error);
            APM.captureError(error, { custom: error });
            if (error instanceof ExtendedError) {
                throw error;
            }
            throw new ExtendedError(ErrorMessage.INTERNAL_SERVER_ERROR, HttpErrorCode.INTERNAL_ERROR);
        }
    }

    static async getVoucherStatus(voucherCode) {
        try {
            const body = {
                external_voucher_code: voucherCode
            }
            const headers = {
                Authorization: `Bearer ${ClientConfig.accessKey}`
            }
    
            const voucher = await HttpClient.sendRequest(HttpMethod.POST, ClientConfig.baseUrl, ClientConfig.voucherStatusPath, null, headers, body);
            if (voucher.status === RESPONSE_STATUS.SUCCESS) {
                return voucher.results;
            } else {
                const error = new ExtendedError(ErrorMessage.UNEXPECTED_RESPONSE, HttpErrorCode.FORBIDDEN);
                error.data = voucher;
                throw error;
            }
        } catch (error) {
            Logger.error("VoucherProviderService:getVoucherStatus", "Error get voucher status", error);
            APM.captureError(error, { custom: error });
            if (error instanceof ExtendedError) {
                throw error;
            }
            throw new ExtendedError(ErrorMessage.INTERNAL_SERVER_ERROR, HttpErrorCode.INTERNAL_ERROR);
        }
    }
}

module.exports = VoucherProviderService;
