class ApiLog {
    constructor({ url, path, method, requestHeader, requestTime, requestData, responseStatus, responseCode, responseTime, responseData }) {
        this.url = url;
        this.path = path;
        this.method = method;
        this.requestHeader = requestHeader;
        this.requestTime = requestTime;
        this.requestData = requestData;
        this.responseStatus = responseStatus;
        this.responseCode = responseCode;
        this.responseTime = responseTime;
        this.responseData = responseData;
    }
}

module.exports = ApiLog;
