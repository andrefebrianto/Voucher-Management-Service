const sandbox = require('sinon').createSandbox();
const assert = require('assert');
const axios = require('axios');

const httpMethod = require('../../../src/constant/HttpMethod');
const httpClient = require('../../../src/util/http/HttpClient');
// const ApiLog = require('../../../src/domain/api-log/usecase/ApiLog');
// const mongodbConnection = require('../../../src/utils/databases/mongodb/connection');

describe("HTTP Client", () => {
    describe("sendRequest", () => {
        // beforeEach(() => {
        //     sandbox.stub(mongodbConnection, 'getConnection').returns({ collection: sandbox.stub() });
        // });

        afterEach(() => {
            sandbox.restore();
        });

        it("should resolve response", async () => {
            const responseData = {
                status: 200,
                statusText: "OK",
                data: {
                    message: "Success",
                    status: true,
                    code: 200
                }
            }
            sandbox.stub(axios.default, 'request').resolves(responseData);
            // sandbox.stub(ApiLog.prototype, 'createLog').resolves();

            const result = await httpClient.sendRequest(httpMethod.GET, "http://abc/api", "products", null, null, null);
            assert.deepStrictEqual(result, responseData.data);
        });

        it("should resolve response", async () => {
            const responseData = {
                status: 200,
                statusText: "OK",
                data: {
                    message: "Success",
                    status: true,
                    code: 200
                }
            }
            sandbox.stub(axios.default, 'request').resolves(responseData);
            // sandbox.stub(ApiLog.prototype, 'createLog').resolves();

            const result = await httpClient.sendRequest(httpMethod.GET, "http://abc/api", "products");
            assert.deepStrictEqual(result, responseData.data);
        });

        it("should resolve response (without data)", async () => {
            const responseData = {
                status: 200,
                statusText: "OK"
            }
            sandbox.stub(axios.default, 'request').resolves(responseData);
            // sandbox.stub(ApiLog.prototype, 'createLog').resolves();

            const result = await httpClient.sendRequest(httpMethod.GET, "http://abc/api", "products", null, null, null);
            assert.deepStrictEqual(result, undefined);
        });

        it("should reject error", () => {
            const errorData = {
                response: {
                    status: 404,
                    statusText: "Not Found",
                    data: {
                        message: "Success",
                        status: false,
                        code: 404
                    }
                }
            }
            sandbox.stub(axios.default, 'request').rejects(errorData);
            // sandbox.stub(ApiLog.prototype, 'createLog').resolves();

            httpClient.sendRequest(httpMethod.GET, "http://abc/api", "products", null, null, null)
            .catch (error => {
                assert.deepStrictEqual(error, errorData.response);
            });
        });

        it("should reject error (without data)", () => {
            const errorData = {
                response: {
                    status: 404,
                    statusText: "Not Found"
                }
            }
            sandbox.stub(axios.default, 'request').rejects(errorData);
            // sandbox.stub(ApiLog.prototype, 'createLog').resolves();

            httpClient.sendRequest(httpMethod.GET, "http://abc/api", "products", null, null, null)
            .catch (error => {
                assert.deepStrictEqual(error, errorData.response);
            });
        });

        it("should reject error (TIMEOUT)", () => {
            const errorData = new Error("Timeout");
            errorData.code = "ETIMEDOUT";
            sandbox.stub(axios.default, 'request').rejects(errorData);
            // sandbox.stub(ApiLog.prototype, 'createLog').resolves();

            httpClient.sendRequest(httpMethod.GET, "http://abc/api", "products", null, null, null)
            .catch (error => {
                assert.deepStrictEqual(error, errorData);
            });
        });
    });
});
