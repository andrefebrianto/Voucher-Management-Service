const axios = require('axios');

const HttpLogger = require('../logger/http/HttpLogger');
const ApiLog = require('../../model/ApiLog');

const TIMEOUT_ERROR_CODE = "ETIMEDOUT";

async function sendRequest (method, baseUrl, route, params = null, headers = null, data = null) {
    const requestTimestamp = new Date();

    try {
        const config = {
            method,
            url: `${baseUrl}${route}`,
            data,
            params,
            headers
        }
        
        const result = await axios.request(config);
        const apiLog = new ApiLog({url: baseUrl, path: route, method: method, requestTime: requestTimestamp, responseStatus: result.statusText,
            requestData: data, responseCode: result.status, responseTime: new Date(), responseData: result.data});
        await HttpLogger.log(apiLog);
        return result.data;
    } catch (error) {
        const apiLog = new ApiLog({url: baseUrl, path: route, method: method, requestTime: requestTimestamp, requestData: data, responseTime: new Date()});
        if (error.code === TIMEOUT_ERROR_CODE) {
            apiLog.responseStatus = "Connection Timeout";
            apiLog.responseCode = TIMEOUT_ERROR_CODE;
        } else {
            apiLog.responseStatus = error.response.statusText;
            apiLog.responseCode = error.response.status;
            apiLog.responseData = error.response.data;
            error.data = error.response.data;
        }
        await HttpLogger.log(apiLog);

        const customError = new Error(error.message);
        customError.code = error.code;
        customError.data = error.data;
        throw customError;
    }
}

module.exports = { sendRequest };
