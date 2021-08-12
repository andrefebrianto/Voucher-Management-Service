const sandbox = require('sinon').createSandbox();
const assert = require('assert');
const apm = require('elastic-apm-node');

const Query = require('../../../../../src/domain/VoucherProvider/repository/query/query');
const ExtendedError = require('../../../../../src/model/ExtendedError');
const {ERROR:HttpErrorCode} = require('../../../../../src/constant/HttpStatusCode');
const ErrorMessage = require('../../../../../src/constant/ErrorMessage');

describe("SQL Voucher Provider Query Test", () => {
    beforeEach(() => {
        sandbox.stub(apm, 'captureError');
    });
    afterEach(() => {
        sandbox.restore();
    });

    const VOUCHER_PROVIDERS = [
        {
            "id": 1,
            "name": "Ultra Vocuher",
            "createdAt": "2021-06-02T08:16:37.549Z",
            "updatedAt": "2021-06-02T08:17:26.025Z",
            "deletedAt": "2021-06-02T08:22:01.943Z"
        },
        {
            "id": 3,
            "name": "Gila Diskon",
            "createdAt": "2021-06-02T08:17:49.349Z",
            "updatedAt": "2021-06-02T08:17:49.349Z",
            "deletedAt": null
        },
        {
            "id": 4,
            "name": "T-money",
            "createdAt": "2021-06-02T10:15:22.791Z",
            "updatedAt": "2021-06-02T10:15:22.791Z",
            "deletedAt": null
        }
    ]

    describe("getById", () => {
        const VOUCHER_PROVIDER_ID = 123;

        it("should return voucher provider", async () => {
            const DatabaseStub = {
                query: sandbox.stub().resolves({rows: VOUCHER_PROVIDERS})
            }
            const query = new Query(DatabaseStub);
            const result = await query.getById(VOUCHER_PROVIDER_ID);
            assert.deepStrictEqual(result, VOUCHER_PROVIDERS[0]);
        });

        it("should throw error (voucher provider not exist)", async () => {
            try {
                const DatabaseStub = {
                    query: sandbox.stub().resolves({rows: []})
                }
                const query = new Query(DatabaseStub);
                await query.getById(VOUCHER_PROVIDER_ID);
            } catch (error) {
                assert.deepStrictEqual(error, new ExtendedError("Voucher provider(s) not found", HttpErrorCode.NOT_FOUND));
            }
        });

        it("should throw error (internal error)", async () => {
            try {
                const DatabaseStub = {
                    query: sandbox.stub().rejects(new Error("Error stub"))
                }
                const query = new Query(DatabaseStub);
                await query.getById(VOUCHER_PROVIDER_ID);
            } catch (error) {
                assert.deepStrictEqual(error, new ExtendedError(ErrorMessage.INTERNAL_SERVER_ERROR, HttpErrorCode.INTERNAL_ERROR));
            }
        });
    });

    describe("getAll", () => {
        const PAGE = 1, LIMIT = 25;

        it("should return voucher provider", async () => {
            const Database = {
                query: function () {}
            }
            const DatabaseStub = sandbox.stub(Database, 'query');
            DatabaseStub.onFirstCall().resolves({rows: VOUCHER_PROVIDERS});
            DatabaseStub.onSecondCall().resolves({rows: [{count: 3}]});
            const query = new Query(Database);
            const result = await query.getAll(PAGE, LIMIT);
            const expectedResult = {
                data: VOUCHER_PROVIDERS,
                meta: {
                    page: PAGE,
                    totalData: 3,
                    totalDataOnPage: 3,
                    totalPage: 1
                }
            }
            assert.deepStrictEqual(result, expectedResult);
        });

        it("should return voucher provider (page and limit are null)", async () => {
            const Database = {
                query: function () {}
            }
            const DatabaseStub = sandbox.stub(Database, 'query');
            DatabaseStub.onFirstCall().resolves({rows: VOUCHER_PROVIDERS});
            DatabaseStub.onSecondCall().resolves({rows: [{count: 3}]});
            const query = new Query(Database);
            const result = await query.getAll();
            const expectedResult = {
                data: VOUCHER_PROVIDERS,
                meta: {
                    page: PAGE,
                    totalData: 3,
                    totalDataOnPage: 3,
                    totalPage: 1
                }
            }
            assert.deepStrictEqual(result, expectedResult);
        });

        it("should throw error (voucher provider not exist)", async () => {
            try {
                const DatabaseStub = {
                    query: sandbox.stub().resolves({rows: []})
                }
                const query = new Query(DatabaseStub);
                await query.getAll(PAGE, LIMIT);
            } catch (error) {
                assert.deepStrictEqual(error, new ExtendedError("Voucher provider(s) not found", HttpErrorCode.NOT_FOUND));
            }
        });

        it("should throw error (internal error)", async () => {
            try {
                const DatabaseStub = {
                    query: sandbox.stub().rejects(new Error("Error stub"))
                }
                const query = new Query(DatabaseStub);
                await query.getAll(PAGE, LIMIT);
            } catch (error) {
                assert.deepStrictEqual(error, new ExtendedError(ErrorMessage.INTERNAL_SERVER_ERROR, HttpErrorCode.INTERNAL_ERROR));
            }
        });
    });
});
