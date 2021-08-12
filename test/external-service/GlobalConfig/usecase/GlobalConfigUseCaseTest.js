const sandbox = require('sinon').createSandbox();
const assert = require('assert');

const GlobalConfigUseCase = require('../../../../src/external-service/GlobalConfig/usecase/GlobalConfigUseCase');
const GlobalConfigService = require('../../../../src/external-service/GlobalConfig/service/GlobalConfigService');

describe("Gila Config Use Case Test", () => {
    afterEach(() => {
        sandbox.restore();
    });

    describe("getActivePartnerProgram", () => {
        const PARTNER_CODE = "ABC";

        it("should return active partner program config", async () => {
            const activePartnerProgram = {
                "id": "30",
                "partnerCode": "IDH",
                "exchangeRate": 10,
                "minimumAmountPerTransaction": null,
                "maximumAmountPerTransaction": null,
                "maximumTransactionAmountPerDay": null,
                "maximumTransactionAmountPerMonth": null,
                "startDate": "2021-03-17T17:00:00.000Z",
                "endDate": "2021-12-30T17:00:00.000Z"
            }
            sandbox.stub(GlobalConfigService, 'getActivePartnerProgram').resolves(activePartnerProgram);

            const result = await GlobalConfigUseCase.getActivePartnerProgram(PARTNER_CODE);
            assert.deepStrictEqual(result, activePartnerProgram);
        });
    });
});
