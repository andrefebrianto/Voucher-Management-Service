const sandbox = require('sinon').createSandbox();
const assert = require('assert');
const apm = require('elastic-apm-node');

const Command = require('../../../../../src/domain/VoucherCategory/repository/command/command');
const ExtendedError = require('../../../../../src/model/ExtendedError');
const {ERROR:HttpErrorCode} = require('../../../../../src/constant/HttpStatusCode');
const {ERROR:ErrorCode} = require('../../../../../src/constant/PostgreSqlErrorCode');
const ErrorMessage = require('../../../../../src/constant/ErrorMessage');
const VoucherCategory = require('../../../../../src/model/VoucherCategory');

describe("SQL Voucher Provider Command Test", () => {
    beforeEach(() => {
        sandbox.stub(apm, 'captureError');
    });
    afterEach(() => {
        sandbox.restore();
    });

    describe("insert", () => {
        const VOUCHER_CATEGORY = new VoucherCategory({name: "ABC", createdAt: new Date(), updatedAt: new Date()});

        it("should return true", async () => {
            const DatabaseStub = {
                query: sandbox.stub().resolves()
            }
            const command = new Command(DatabaseStub);
            const result = await command.insert(VOUCHER_CATEGORY);
            assert.strictEqual(result, true);
        });

        it("should throw error (unique violation)", async () => {
            try {
                const DatabaseStub = {
                    query: sandbox.stub().rejects({code: ErrorCode.UNIQUE_VIOLATION})
                }
                const command = new Command(DatabaseStub);
                await command.insert(VOUCHER_CATEGORY);
            } catch (error) {
                assert.deepStrictEqual(error, new ExtendedError("Voucher category name already exist", HttpErrorCode.BAD_REQUEST));
            }
        });

        it("should throw error (internal error)", async () => {
            try {
                const DatabaseStub = {
                    query: sandbox.stub().rejects(new Error("Error stub"))
                }
                const command = new Command(DatabaseStub);
                await command.insert(VOUCHER_CATEGORY);
            } catch (error) {
                assert.deepStrictEqual(error, new ExtendedError(ErrorMessage.INTERNAL_SERVER_ERROR, HttpErrorCode.INTERNAL_ERROR));
            }
        });
    });

    describe("update", () => {
        const VOUCHER_CATEGORY = new VoucherCategory({name: "ABC", createdAt: new Date(), updatedAt: new Date()});

        it("should return true", async () => {
            const DatabaseStub = {
                query: sandbox.stub().resolves({rowCount: 1})
            }
            const command = new Command(DatabaseStub);
            const result = await command.update(VOUCHER_CATEGORY);
            assert.strictEqual(result, true);
        });

        it("should throw error (voucher category not found)", async () => {
            try {
                const DatabaseStub = {
                    query: sandbox.stub().resolves({rowCount: 0})
                }
                const command = new Command(DatabaseStub);
                await command.update(VOUCHER_CATEGORY);
            } catch (error) {
                assert.deepStrictEqual(error, new ExtendedError("Voucher category not found", HttpErrorCode.NOT_FOUND));
            }
        });

        it("should throw error (unique violation)", async () => {
            try {
                const DatabaseStub = {
                    query: sandbox.stub().rejects({code: ErrorCode.UNIQUE_VIOLATION})
                }
                const command = new Command(DatabaseStub);
                await command.update(VOUCHER_CATEGORY);
            } catch (error) {
                assert.deepStrictEqual(error, new ExtendedError("Voucher category name already exist", HttpErrorCode.BAD_REQUEST));
            }
        });

        it("should throw error (internal error)", async () => {
            try {
                const DatabaseStub = {
                    query: sandbox.stub().rejects(new Error("Error stub"))
                }
                const command = new Command(DatabaseStub);
                await command.update(VOUCHER_CATEGORY);
            } catch (error) {
                assert.deepStrictEqual(error, new ExtendedError(ErrorMessage.INTERNAL_SERVER_ERROR, HttpErrorCode.INTERNAL_ERROR));
            }
        });
    });

    describe("softDelete", () => {
        const VOUCHER_CATEGORY_ID = 123;

        it("should return true", async () => {
            const DatabaseStub = {
                query: sandbox.stub().resolves({rowCount: 1})
            }
            const command = new Command(DatabaseStub);
            const result = await command.softDelete(VOUCHER_CATEGORY_ID);
            assert.strictEqual(result, true);
        });

        it("should throw error (voucher category not found)", async () => {
            try {
                const DatabaseStub = {
                    query: sandbox.stub().resolves({rowCount: 0})
                }
                const command = new Command(DatabaseStub);
                await command.softDelete(VOUCHER_CATEGORY_ID);
            } catch (error) {
                assert.deepStrictEqual(error, new ExtendedError("Voucher category not found", HttpErrorCode.NOT_FOUND));
            }
        });

        it("should throw error (internal error)", async () => {
            try {
                const DatabaseStub = {
                    query: sandbox.stub().rejects(new Error("Error stub"))
                }
                const command = new Command(DatabaseStub);
                await command.softDelete(VOUCHER_CATEGORY_ID);
            } catch (error) {
                assert.deepStrictEqual(error, new ExtendedError(ErrorMessage.INTERNAL_SERVER_ERROR, HttpErrorCode.INTERNAL_ERROR));
            }
        });
    });
});
