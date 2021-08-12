const sandbox = require('sinon').createSandbox();
const assert = require('assert');

const ErrorMessage = require('../../../../src/constant/ErrorMessage');
const {ERROR:HttpErrorCode} = require('../../../../src/constant/HttpStatusCode');
const VoucherProviderUseCase = require('../../../../src/domain/VoucherProvider/usecase/VoucherProviderUseCase');
const ExtendedError = require('../../../../src/model/ExtendedError');

describe("Voucher Provider Use Case Test", () => {
    afterEach(() => {
        sandbox.restore();
    });

    describe("createVoucherProvider", () => {
        const NAME = "ALASKA VOUCHER";

        it("should return true", async () => {
            const CommandRepoStub = {
                insert: sandbox.stub().resolves(true)
            }
            const voucherProviderUseCase = new VoucherProviderUseCase(CommandRepoStub, null);
            const result = await voucherProviderUseCase.createVoucherProvider({name: NAME});
            assert.strictEqual(result, true);
        });

        it("should throw error (invalid property value)", async () => {
            try {
                const CommandRepoStub = {
                    insert: sandbox.stub().resolves(true)
                }
                const voucherProviderUseCase = new VoucherProviderUseCase(CommandRepoStub, null);
                await voucherProviderUseCase.createVoucherProvider({});
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
                const voucherProviderUseCase = new VoucherProviderUseCase(CommandRepoStub, null);
                await voucherProviderUseCase.createVoucherProvider({name: NAME});
            } catch (error) {
                const expectedError = new ExtendedError(ErrorMessage.INTERNAL_SERVER_ERROR, HttpErrorCode.INTERNAL_ERROR);
                assert.deepStrictEqual(error, expectedError);                
            }
        });
    });

    describe("updateVoucherProvider", () => {
        const ID = 123, NAME = "ALASKA VOUCHER";

        it("should return true (without update)", async () => {
            const CommandRepoStub = {
                update: sandbox.stub().resolves(true)
            }
            const voucherProvider = {id: 123, name: NAME, createdAt: new Date(), updatedAt: new Date()};
            const QueryRepoStub = {
                getById: sandbox.stub().resolves(voucherProvider)
            }
            const voucherProviderUseCase = new VoucherProviderUseCase(CommandRepoStub, QueryRepoStub);
            const result = await voucherProviderUseCase.updateVoucherProvider({id: ID});
            assert.strictEqual(result, true);
        });

        it("should return true", async () => {
            const CommandRepoStub = {
                update: sandbox.stub().resolves(true)
            }
            const voucherProvider = {id: 123, name: NAME, createdAt: new Date(), updatedAt: new Date()};
            const QueryRepoStub = {
                getById: sandbox.stub().resolves(voucherProvider)
            }
            const voucherProviderUseCase = new VoucherProviderUseCase(CommandRepoStub, QueryRepoStub);
            const result = await voucherProviderUseCase.updateVoucherProvider({id: ID, name: NAME});
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
                const voucherProviderUseCase = new VoucherProviderUseCase(CommandRepoStub, QueryRepoStub);
                await voucherProviderUseCase.updateVoucherProvider({id: 123});
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
                const voucherProvider = {id: 123, name: NAME, createdAt: new Date(), updatedAt: new Date()};
                const QueryRepoStub = {
                    getById: sandbox.stub().resolves(voucherProvider)
                }
                const voucherProviderUseCase = new VoucherProviderUseCase(CommandRepoStub, QueryRepoStub);
                await voucherProviderUseCase.updateVoucherProvider({id:123, name: NAME});
            } catch (error) {
                const expectedError = new ExtendedError(ErrorMessage.INTERNAL_SERVER_ERROR, HttpErrorCode.INTERNAL_ERROR);
                assert.deepStrictEqual(error, expectedError);                
            }
        });
    });

    describe("deleteVoucherProvider", () => {
        const ID = 123;

        it("should return true", async () => {
            const CommandRepoStub = {
                softDelete: sandbox.stub().resolves(true)
            }
            const voucherProviderUseCase = new VoucherProviderUseCase(CommandRepoStub, null);
            const result = await voucherProviderUseCase.deleteVoucherProvider(ID);
            assert.strictEqual(result, true);
        });
    });

    describe("getVoucherProviders", () => {
        const PAGE = 1, LIMIT = 25;

        it("should return voucher providers", async () => {
            const QueryRepoStub = {
                getAll: sandbox.stub().resolves([])
            }
            const voucherProviderUseCase = new VoucherProviderUseCase(null, QueryRepoStub);
            const result = await voucherProviderUseCase.getVoucherProviders(PAGE, LIMIT);
            assert.deepStrictEqual(result, []);
        });
    });
});
