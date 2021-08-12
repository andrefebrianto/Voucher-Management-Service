const sandbox = require('sinon').createSandbox();
const assert = require('assert');
const apm = require('elastic-apm-node');

const GlobalConfigService = require('../../../../src/external-service/GlobalConfig/service/GlobalConfigService');
const HttpClient = require('../../../../src/util/http/HttpClient');

const {ERROR:HttpErrorCode} = require('../../../../src/constant/HttpStatusCode');
const ErrorMessage = require('../../../../src/constant/ErrorMessage');
const ExtendedError = require('../../../../src/model/ExtendedError');

describe("Global Config Service Test", () => {
    beforeEach(() => {
        sandbox.stub(apm, 'captureError');
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("getActivePartnerProgram", () => {
        const PARTNER_CODE = "ABC";

        it("should return active partner program config", async () => {
            const response = {
                "status": true,
                "data": {
                    "id": "30",
                    "partnerCode": "IDH",
                    "exchangeRate": 10,
                    "minimumAmountPerTransaction": null,
                    "maximumAmountPerTransaction": null,
                    "maximumTransactionAmountPerDay": null,
                    "maximumTransactionAmountPerMonth": null,
                    "startDate": "2021-03-17T17:00:00.000Z",
                    "endDate": "2021-12-30T17:00:00.000Z"
                },
                "code": 200,
                "message": "Partner program(s) retrieved"
            }
            sandbox.stub(HttpClient, 'sendRequest').resolves(response);

            const result = await GlobalConfigService.getActivePartnerProgram(PARTNER_CODE);
            assert.deepStrictEqual(result, response.data);
        });

        it("should throw error (unexpected error)", async () => {
            const response = {
                "status": false,
                "data": {
                    "id": "30",
                    "partnerCode": "IDH",
                    "exchangeRate": 10,
                    "minimumAmountPerTransaction": null,
                    "maximumAmountPerTransaction": null,
                    "maximumTransactionAmountPerDay": null,
                    "maximumTransactionAmountPerMonth": null,
                    "startDate": "2021-03-17T17:00:00.000Z",
                    "endDate": "2021-12-30T17:00:00.000Z"
                },
                "code": 200,
                "message": "Partner program(s) retrieved"
            }
            try {
                sandbox.stub(HttpClient, 'sendRequest').resolves(response);

                await GlobalConfigService.getActivePartnerProgram(PARTNER_CODE);
            } catch (error) {
                const expectedError = new ExtendedError(ErrorMessage.INTERNAL_SERVER_ERROR, HttpErrorCode.INTERNAL_ERROR);
                expectedError.data = response;
                assert.deepStrictEqual(error, expectedError);
            }
        });

        it("should throw error (program not found)", async () => {
            const response = {
                message: "Request failed with status code 404",
                data: {
                    "status": false,
                    "data": null,
                    "message": "Active partner program not found",
                    "code": 404
                }
            }
            try {
                sandbox.stub(HttpClient, 'sendRequest').rejects(response);

                await GlobalConfigService.getActivePartnerProgram(PARTNER_CODE);
            } catch (error) {
                const expectedError = new ExtendedError("Active partner program not found", HttpErrorCode.NOT_FOUND);
                assert.deepStrictEqual(error, expectedError);
            }
        });

        it("should throw error (internal server error)", async () => {
            const response = {
                "status": false,
                "data": null,
                "message": "Internal server error",
                "code": 500
            }
            try {
                sandbox.stub(HttpClient, 'sendRequest').rejects(response);

                await GlobalConfigService.getActivePartnerProgram(PARTNER_CODE);
            } catch (error) {
                const expectedError = new ExtendedError(ErrorMessage.INTERNAL_SERVER_ERROR, HttpErrorCode.INTERNAL_ERROR);
                assert.deepStrictEqual(error, expectedError);
            }
        });
    });
});
