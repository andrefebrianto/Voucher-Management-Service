const sandbox = require('sinon').createSandbox();
const assert = require('assert');
const apm = require('elastic-apm-node');

const Query = require('../../../../../src/domain/Voucher/repository/query/sqlQuery');
const ExtendedError = require('../../../../../src/model/ExtendedError');
const {ERROR:HttpErrorCode} = require('../../../../../src/constant/HttpStatusCode');
const ErrorMessage = require('../../../../../src/constant/ErrorMessage');

describe("SQL Voucher Query Test", () => {
    beforeEach(() => {
        sandbox.stub(apm, 'captureError');
    });
    afterEach(() => {
        sandbox.restore();
    });

    const VOUCHER = [
        {
            "id": 123,
            "referenceId": "910",
            "categoryId": "6",
            "providerId": "1",
            "name": "Redoxon 1 Month Supply",
            "value": 150000,
            "price": 130000,
            "margin": 5000,
            "discount": 1000,
            "status": "ACTIVE",
            "term": "Please consume it after lunch",
            "description": "Multivitamin supply for one month consist 30 tablets",
            "imageUrl": "https://imageurl.com",
            "startDate": "2021-06-01",
            "endDate": "2021-12-31",
            "stock": 10,
            "createdAt": new Date(),
            "updatedAt": new Date()
        }
    ]

    describe("getById", () => {
        const VOUCHER_ID = 123;

        it("should return voucher", async () => {
            const DatabaseStub = {
                query: sandbox.stub().resolves({rows: VOUCHER})
            }
            const query = new Query(DatabaseStub);
            const result = await query.getById(VOUCHER_ID);
            assert.deepStrictEqual(result, VOUCHER[0]);
        });

        it("should throw error (voucher not exist)", async () => {
            try {
                const DatabaseStub = {
                    query: sandbox.stub().resolves({rows: []})
                }
                const query = new Query(DatabaseStub);
                await query.getById(VOUCHER_ID);
            } catch (error) {
                assert.deepStrictEqual(error, new ExtendedError("Voucher(s) not found", HttpErrorCode.NOT_FOUND));
            }
        });

        it("should throw error (internal error)", async () => {
            try {
                const DatabaseStub = {
                    query: sandbox.stub().rejects(new Error("Error stub"))
                }
                const query = new Query(DatabaseStub);
                await query.getById(VOUCHER_ID);
            } catch (error) {
                assert.deepStrictEqual(error, new ExtendedError(ErrorMessage.INTERNAL_SERVER_ERROR, HttpErrorCode.INTERNAL_ERROR));
            }
        });
    });

    describe("getVouchers", () => {
        const PAGE = 1, LIMIT = 25;

        it("should return voucher", async () => {
            const Database = {
                query: function () {}
            }
            const DatabaseStub = sandbox.stub(Database, 'query');
            DatabaseStub.onFirstCall().resolves({rows: VOUCHER});
            DatabaseStub.onSecondCall().resolves({rows: [{count: 1}]});
            const query = new Query(Database);
            const result = await query.getVouchers(PAGE, LIMIT);
            const expectedResult = {
                data: VOUCHER,
                meta: {
                    page: PAGE,
                    totalData: 1,
                    totalDataOnPage: 1,
                    totalPage: 1
                }
            }
            assert.deepStrictEqual(result, expectedResult);
        });

        it("should return voucher (page and limit are null)", async () => {
            const Database = {
                query: function () {}
            }
            const DatabaseStub = sandbox.stub(Database, 'query');
            DatabaseStub.onFirstCall().resolves({rows: VOUCHER});
            DatabaseStub.onSecondCall().resolves({rows: [{count: 1}]});
            const query = new Query(Database);
            const result = await query.getVouchers();
            const expectedResult = {
                data: VOUCHER,
                meta: {
                    page: PAGE,
                    totalData: 1,
                    totalDataOnPage: 1,
                    totalPage: 1
                }
            }
            assert.deepStrictEqual(result, expectedResult);
        });

        it("should throw error (voucher not exist)", async () => {
            try {
                const DatabaseStub = {
                    query: sandbox.stub().resolves({rows: []})
                }
                const query = new Query(DatabaseStub);
                await query.getVouchers(PAGE, LIMIT);
            } catch (error) {
                assert.deepStrictEqual(error, new ExtendedError("Voucher(s) not found", HttpErrorCode.NOT_FOUND));
            }
        });

        it("should throw error (internal error)", async () => {
            try {
                const DatabaseStub = {
                    query: sandbox.stub().rejects(new Error("Error stub"))
                }
                const query = new Query(DatabaseStub);
                await query.getVouchers(PAGE, LIMIT);
            } catch (error) {
                assert.deepStrictEqual(error, new ExtendedError(ErrorMessage.INTERNAL_SERVER_ERROR, HttpErrorCode.INTERNAL_ERROR));
            }
        });
    });

    describe("getActiveVouchers", () => {
        const PAGE = 1, LIMIT = 25;

        it("should return voucher", async () => {
            const Database = {
                query: function () {}
            }
            const DatabaseStub = sandbox.stub(Database, 'query');
            DatabaseStub.onFirstCall().resolves({rows: VOUCHER});
            DatabaseStub.onSecondCall().resolves({rows: [{count: 1}]});
            const query = new Query(Database);
            const result = await query.getActiveVouchers(PAGE, LIMIT);
            const expectedResult = {
                data: VOUCHER,
                meta: {
                    page: PAGE,
                    totalData: 1,
                    totalDataOnPage: 1,
                    totalPage: 1
                }
            }
            assert.deepStrictEqual(result, expectedResult);
        });

        it("should return voucher (page and limit are null)", async () => {
            const Database = {
                query: function () {}
            }
            const DatabaseStub = sandbox.stub(Database, 'query');
            DatabaseStub.onFirstCall().resolves({rows: VOUCHER});
            DatabaseStub.onSecondCall().resolves({rows: [{count: 1}]});
            const query = new Query(Database);
            const result = await query.getActiveVouchers();
            const expectedResult = {
                data: VOUCHER,
                meta: {
                    page: PAGE,
                    totalData: 1,
                    totalDataOnPage: 1,
                    totalPage: 1
                }
            }
            assert.deepStrictEqual(result, expectedResult);
        });

        it("should throw error (voucher not exist)", async () => {
            try {
                const DatabaseStub = {
                    query: sandbox.stub().resolves({rows: []})
                }
                const query = new Query(DatabaseStub);
                await query.getActiveVouchers(PAGE, LIMIT);
            } catch (error) {
                assert.deepStrictEqual(error, new ExtendedError("Voucher(s) not found", HttpErrorCode.NOT_FOUND));
            }
        });

        it("should throw error (internal error)", async () => {
            try {
                const DatabaseStub = {
                    query: sandbox.stub().rejects(new Error("Error stub"))
                }
                const query = new Query(DatabaseStub);
                await query.getActiveVouchers(PAGE, LIMIT);
            } catch (error) {
                assert.deepStrictEqual(error, new ExtendedError(ErrorMessage.INTERNAL_SERVER_ERROR, HttpErrorCode.INTERNAL_ERROR));
            }
        });
    });
});
