const sandbox = require('sinon').createSandbox();
const assert = require('assert');

const ErrorMessage = require('../../../../src/constant/ErrorMessage');
const {ERROR:HttpErrorCode} = require('../../../../src/constant/HttpStatusCode');
const VoucherInventoryUseCase = require('../../../../src/domain/Voucher/usecase/VoucherInventoryUseCase');
const ExtendedError = require('../../../../src/model/ExtendedError');

describe("Voucher Inventory Use Case Test", () => {
    afterEach(() => {
        sandbox.restore();
    });

    const VOUCHER = {
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
    }

    describe("createVoucher", () => {
        it("should return true", async () => {
            const CommandRepoStub = {
                insert: sandbox.stub().resolves(true)
            }
            const voucherInventoryUseCase = new VoucherInventoryUseCase(CommandRepoStub, null);
            const result = await voucherInventoryUseCase.createVoucher(VOUCHER);
            assert.strictEqual(result, true);
        });

        it("should throw error (invalid property value)", async () => {
            try {
                const CommandRepoStub = {
                    insert: sandbox.stub().resolves(true)
                }
                const voucherInventoryUseCase = new VoucherInventoryUseCase(CommandRepoStub, null);
                await voucherInventoryUseCase.createVoucher({});
            } catch (error) {
                const expectedError = new ExtendedError(ErrorMessage.INVALID_INPUT_PARAMETER, HttpErrorCode.BAD_REQUEST);
                assert.deepStrictEqual(error, expectedError);                
            }
        });

        it("should throw error (database error)", async () => {
            try {
                const CommandRepoStub = {
                    insert: sandbox.stub().rejects(new ExtendedError(ErrorMessage.INTERNAL_SERVER_ERROR, HttpErrorCode.INTERNAL_ERROR))
                }
                const voucherInventoryUseCase = new VoucherInventoryUseCase(CommandRepoStub, null);
                await voucherInventoryUseCase.createVoucher(VOUCHER);
            } catch (error) {
                const expectedError = new ExtendedError(ErrorMessage.INTERNAL_SERVER_ERROR, HttpErrorCode.INTERNAL_ERROR);
                assert.deepStrictEqual(error, expectedError);                
            }
        });
    });

    describe("updateVoucher", () => {
        const ID = 123, NAME = "VitaX Multivitamin";

        it("should return true (without update)", async () => {
            const CommandRepoStub = {
                update: sandbox.stub().resolves(true)
            }
            const QueryRepoStub = {
                getById: sandbox.stub().resolves(VOUCHER)
            }
            const voucherInventoryUseCase = new VoucherInventoryUseCase(CommandRepoStub, QueryRepoStub);
            const result = await voucherInventoryUseCase.updateVoucher({id: ID});
            assert.strictEqual(result, true);
        });

        it("should return true", async () => {
            const CommandRepoStub = {
                update: sandbox.stub().resolves(true)
            }
            const QueryRepoStub = {
                getById: sandbox.stub().resolves(VOUCHER)
            }
            const voucherInventoryUseCase = new VoucherInventoryUseCase(CommandRepoStub, QueryRepoStub);
            const result = await voucherInventoryUseCase.updateVoucher(VOUCHER);
            assert.strictEqual(result, true);
        });

        it("should throw error (invalid property value)", async () => {
            try {
                const CommandRepoStub = {
                    update: sandbox.stub().resolves(true)
                }
                const voucherProvider = {id: 123, createdAt: new Date(), updatedAt: new Date()};
                const QueryRepoStub = {
                    getById: sandbox.stub().resolves(voucherProvider)
                }
                const voucherInventoryUseCase = new VoucherInventoryUseCase(CommandRepoStub, QueryRepoStub);
                await voucherInventoryUseCase.updateVoucher({id: 123});
            } catch (error) {
                const expectedError = new ExtendedError(ErrorMessage.INVALID_INPUT_PARAMETER, HttpErrorCode.BAD_REQUEST);
                assert.deepStrictEqual(error, expectedError);                
            }
        });

        it("should throw error (database error)", async () => {
            try {
                const CommandRepoStub = {
                    update: sandbox.stub().rejects(new ExtendedError(ErrorMessage.INTERNAL_SERVER_ERROR, HttpErrorCode.INTERNAL_ERROR))
                }
                const QueryRepoStub = {
                    getById: sandbox.stub().resolves(VOUCHER)
                }
                const voucherInventoryUseCase = new VoucherInventoryUseCase(CommandRepoStub, QueryRepoStub);
                await voucherInventoryUseCase.updateVoucher(VOUCHER);
            } catch (error) {
                const expectedError = new ExtendedError(ErrorMessage.INTERNAL_SERVER_ERROR, HttpErrorCode.INTERNAL_ERROR);
                assert.deepStrictEqual(error, expectedError);                
            }
        });
    });

    describe("deleteVoucher", () => {
        const ID = 123;

        it("should return true", async () => {
            const CommandRepoStub = {
                softDelete: sandbox.stub().resolves(true)
            }
            const voucherInventoryUseCase = new VoucherInventoryUseCase(CommandRepoStub, null);
            const result = await voucherInventoryUseCase.deleteVoucher(ID);
            assert.strictEqual(result, true);
        });
    });

    describe("getVouchers", () => {
        const PAGE = 1, LIMIT = 25;

        it("should return vouchers", async () => {
            const QueryRepoStub = {
                getVouchers: sandbox.stub().resolves([])
            }
            const voucherInventoryUseCase = new VoucherInventoryUseCase(null, QueryRepoStub);
            const result = await voucherInventoryUseCase.getVouchers(PAGE, LIMIT);
            assert.deepStrictEqual(result, []);
        });
    });
});
