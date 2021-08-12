const APM = require('elastic-apm-node');
const Config = require('config');

const HttpMethod = require('../../../constant/HttpMethod');
const {ERROR:HttpErrorCode} = require('../../../constant/HttpStatusCode');
const ErrorMessage = require('../../../constant/ErrorMessage');
const ExtendedError = require('../../../model/ExtendedError');
const ClientConfig = Config.get("GlobalConfigServiceConfig");
const RESPONSE_STATUS = {
    SUCCESS: true,
    FAIL: false
}
const RESPONSE_MESSAGE = {
    NOT_FOUND: "Active partner program not found"
}

const HttpClient = require('../../../util/http/HttpClient');
const Logger = require('../../../util/logger/console/Logger');

class GlobalConfigService {
    static async getActivePartnerProgram(partnerCode) {
        try {
            const partnerProgram = await HttpClient.sendRequest(HttpMethod.GET, ClientConfig.baseUrl, `${ClientConfig.activePartnerProgramPath}/${partnerCode}`, null,
            null, null);
            if (partnerProgram.status === RESPONSE_STATUS.SUCCESS) {
                return partnerProgram.data;
            } else {
                const error = new ExtendedError(ErrorMessage.INTERNAL_SERVER_ERROR, HttpErrorCode.INTERNAL_ERROR);
                error.data = partnerProgram;
                throw error;
            }
        } catch (error) {
            Logger.error("GlobalConfigService:getPartnerProgram", "Error get active partner program", error);
            APM.captureError(error, { custom: error });
            if (error instanceof ExtendedError) {
                throw error;
            }
            if (error.message === "Request failed with status code 404") {
                throw new ExtendedError(RESPONSE_MESSAGE.NOT_FOUND, HttpErrorCode.NOT_FOUND);
            }
            throw new ExtendedError(ErrorMessage.INTERNAL_SERVER_ERROR, HttpErrorCode.INTERNAL_ERROR);
        }
    }
}

module.exports = GlobalConfigService;
