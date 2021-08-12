const sandbox = require('sinon').createSandbox();
const assert = require('assert');
const apm = require('elastic-apm-node');

const Command = require('../../../../../src/domain/Voucher/repository/command/sqlCommand');
const ExtendedError = require('../../../../../src/model/ExtendedError');
const {ERROR:HttpErrorCode} = require('../../../../../src/constant/HttpStatusCode');
const {ERROR:ErrorCode} = require('../../../../../src/constant/PostgreSqlErrorCode');
const ErrorMessage = require('../../../../../src/constant/ErrorMessage');
const Voucher = require('../../../../../src/model/Voucher');

describe("SQL Voucher Command Test", () => {
    beforeEach(() => {
        sandbox.stub(apm, 'captureError');
    });
    afterEach(() => {
        sandbox.restore();
    });

    const VOUCHER = new Voucher({
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
        "voucherType": "TEXT CODE",
        "term": "Please consume it after lunch",
        "description": "Multivitamin supply for one month consist 30 tablets",
        "imageUrl": "https://imageurl.com",
        "startDate": "2021-06-01",
        "endDate": "2021-12-31",
        "stock": 10,
        "createdAt": new Date(),
        "updatedAt": new Date()
    });

    describe("insert", () => {

        it("should return true", async () => {
            const DatabaseStub = {
                query: sandbox.stub().resolves()
            }
            const command = new Command(DatabaseStub);
            const result = await command.insert(VOUCHER);
            assert.strictEqual(result, true);
        });

        it("should throw error (foreign key violation)", async () => {
            try {
                const DatabaseStub = {
                    query: sandbox.stub().rejects({code: ErrorCode.FOREIGN_KEY_VIOLATION})
                }
                const command = new Command(DatabaseStub);
                await command.insert(VOUCHER);
            } catch (error) {
                assert.deepStrictEqual(error, new ExtendedError("Foreign key not exist", HttpErrorCode.BAD_REQUEST));
            }
        });

        it("should throw error (internal error)", async () => {
            try {
                const DatabaseStub = {
                    query: sandbox.stub().rejects(new Error("Error stub"))
                }
                const command = new Command(DatabaseStub);
                await command.insert(VOUCHER);
            } catch (error) {
                assert.deepStrictEqual(error, new ExtendedError(ErrorMessage.INTERNAL_SERVER_ERROR, HttpErrorCode.INTERNAL_ERROR));
            }
        });
    });

    describe("update", () => {
        it("should return true", async () => {
            const DatabaseStub = {
                query: sandbox.stub().resolves({rowCount: 1})
            }
            const command = new Command(DatabaseStub);
            const result = await command.update(VOUCHER);
            assert.strictEqual(result, true);
        });

        it("should throw error (voucher not found)", async () => {
            try {
                const DatabaseStub = {
                    query: sandbox.stub().resolves({rowCount: 0})
                }
                const command = new Command(DatabaseStub);
                await command.update(VOUCHER);
            } catch (error) {
                assert.deepStrictEqual(error, new ExtendedError("Voucher not found", HttpErrorCode.NOT_FOUND));
            }
        });

        it("should throw error (foreign key violation)", async () => {
            try {
                const DatabaseStub = {
                    query: sandbox.stub().rejects({code: ErrorCode.FOREIGN_KEY_VIOLATION})
                }
                const command = new Command(DatabaseStub);
                await command.update(VOUCHER);
            } catch (error) {
                assert.deepStrictEqual(error, new ExtendedError("Foreign key not exist", HttpErrorCode.BAD_REQUEST));
            }
        });

        it("should throw error (internal error)", async () => {
            try {
                const DatabaseStub = {
                    query: sandbox.stub().rejects(new Error("Error stub"))
                }
                const command = new Command(DatabaseStub);
                await command.update(VOUCHER);
            } catch (error) {
                assert.deepStrictEqual(error, new ExtendedError(ErrorMessage.INTERNAL_SERVER_ERROR, HttpErrorCode.INTERNAL_ERROR));
            }
        });
    });

    describe("softDelete", () => {
        const VOUCHER_ID = 123;

        it("should return true", async () => {
            const DatabaseStub = {
                query: sandbox.stub().resolves({rowCount: 1})
            }
            const command = new Command(DatabaseStub);
            const result = await command.softDelete(VOUCHER_ID);
            assert.strictEqual(result, true);
        });

        it("should throw error (voucher not found)", async () => {
            try {
                const DatabaseStub = {
                    query: sandbox.stub().resolves({rowCount: 0})
                }
                const command = new Command(DatabaseStub);
                await command.softDelete(VOUCHER_ID);
            } catch (error) {
                assert.deepStrictEqual(error, new ExtendedError("Voucher not found", HttpErrorCode.NOT_FOUND));
            }
        });

        it("should throw error (internal error)", async () => {
            try {
                const DatabaseStub = {
                    query: sandbox.stub().rejects(new Error("Error stub"))
                }
                const command = new Command(DatabaseStub);
                await command.softDelete(VOUCHER_ID);
            } catch (error) {
                assert.deepStrictEqual(error, new ExtendedError(ErrorMessage.INTERNAL_SERVER_ERROR, HttpErrorCode.INTERNAL_ERROR));
            }
        });
    });

    describe("decreaseStock", () => {
        const VOUCHER_ID = 123, AMOUNT = 1;
        it("should return true", async () => {
            const DatabaseStub = {
                query: sandbox.stub().resolves({rowCount: 1})
            }
            const command = new Command(DatabaseStub);
            const result = await command.decreaseStock(VOUCHER_ID, AMOUNT);
            assert.strictEqual(result, true);
        });

        it("should throw error (voucher not found)", async () => {
            try {
                const DatabaseStub = {
                    query: sandbox.stub().resolves({rowCount: 0})
                }
                const command = new Command(DatabaseStub);
                await command.decreaseStock(VOUCHER_ID, AMOUNT);
            } catch (error) {
                assert.deepStrictEqual(error, new ExtendedError("Voucher not found", HttpErrorCode.NOT_FOUND));
            }
        });

        it("should throw error (internal error)", async () => {
            try {
                const DatabaseStub = {
                    query: sandbox.stub().rejects(new Error("Error stub"))
                }
                const command = new Command(DatabaseStub);
                await command.decreaseStock(VOUCHER_ID, AMOUNT);
            } catch (error) {
                assert.deepStrictEqual(error, new ExtendedError(ErrorMessage.INTERNAL_SERVER_ERROR, HttpErrorCode.INTERNAL_ERROR));
            }
        });
    });
});
