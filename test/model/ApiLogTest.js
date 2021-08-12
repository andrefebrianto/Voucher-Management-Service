const Assert = require('assert');

const ApiLog = require('../../src/model/ApiLog');

describe("Api Log Model Test", () => {
    describe("constructor", () => {
        it("should create new api log object", () => {
            const logData = {
                url: "https://dummy-url.com",
                path: "/dummy/path",
                method: "POST",
                requestHeader: null,
                requestData: {},
                requestTime: new Date(),
                responseStatus: "OK",
                responseCode: 200,
                responseData: {},
                responseTime: new Date(Date.now + 100)
            }
    
            const apiLog = new ApiLog(logData);
            Assert.strictEqual(apiLog.url, "https://dummy-url.com");
        });
    });
});
