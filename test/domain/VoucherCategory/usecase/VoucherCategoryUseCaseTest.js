const sandbox = require('sinon').createSandbox();
const assert = require('assert');

const ErrorMessage = require('../../../../src/constant/ErrorMessage');
const {ERROR:HttpErrorCode} = require('../../../../src/constant/HttpStatusCode');
const VoucherCategoryUseCase = require('../../../../src/domain/VoucherCategory/usecase/VoucherCategoryUseCase');
const ExtendedError = require('../../../../src/model/ExtendedError');

describe("Voucher Category Use Case Test", () => {
    afterEach(() => {
        sandbox.restore();
    });

    describe("createCategory", () => {
        const NAME = "Fashion";

        it("should return true", async () => {
            const CommandRepoStub = {
                insert: sandbox.stub().resolves(true)
            }
            const voucherCategoryUseCase = new VoucherCategoryUseCase(CommandRepoStub, null);
            const result = await voucherCategoryUseCase.createCategory({name: NAME});
            assert.strictEqual(result, true);
        });

        it("should throw error (invalid property value)", async () => {
            try {
                const CommandRepoStub = {
                    insert: sandbox.stub().resolves(true)
                }
                const voucherCategoryUseCase = new VoucherCategoryUseCase(CommandRepoStub, null);
                await voucherCategoryUseCase.createCategory({});
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
                const voucherCategoryUseCase = new VoucherCategoryUseCase(CommandRepoStub, null);
                await voucherCategoryUseCase.createCategory({name: NAME});
            } catch (error) {
                const expectedError = new ExtendedError(ErrorMessage.INTERNAL_SERVER_ERROR, HttpErrorCode.INTERNAL_ERROR);
                assert.deepStrictEqual(error, expectedError);                
            }
        });
    });

    describe("updateCategory", () => {
        const ID = 123, NAME = "Fashion";

        it("should return true (without update)", async () => {
            const CommandRepoStub = {
                update: sandbox.stub().resolves(true)
            }
            const voucherProvider = {id: 123, name: NAME, imageUrl: "https://imageurl.com", createdAt: new Date(), updatedAt: new Date()};
            const QueryRepoStub = {
                getById: sandbox.stub().resolves(voucherProvider)
            }
            const voucherCategoryUseCase = new VoucherCategoryUseCase(CommandRepoStub, QueryRepoStub);
            const result = await voucherCategoryUseCase.updateCategory({id: ID});
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
            const voucherCategoryUseCase = new VoucherCategoryUseCase(CommandRepoStub, QueryRepoStub);
            const result = await voucherCategoryUseCase.updateCategory({id: ID, name: NAME, imageUrl: "https://imageurl.com"});
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
                const voucherCategoryUseCase = new VoucherCategoryUseCase(CommandRepoStub, QueryRepoStub);
                await voucherCategoryUseCase.updateCategory({id: 123});
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
                const voucherCategoryUseCase = new VoucherCategoryUseCase(CommandRepoStub, QueryRepoStub);
                await voucherCategoryUseCase.updateCategory({id:123, name: NAME});
            } catch (error) {
                const expectedError = new ExtendedError(ErrorMessage.INTERNAL_SERVER_ERROR, HttpErrorCode.INTERNAL_ERROR);
                assert.deepStrictEqual(error, expectedError);                
            }
        });
    });

    describe("deleteCategory", () => {
        const ID = 123;

        it("should return true", async () => {
            const CommandRepoStub = {
                softDelete: sandbox.stub().resolves(true)
            }
            const voucherCategoryUseCase = new VoucherCategoryUseCase(CommandRepoStub, null);
            const result = await voucherCategoryUseCase.deleteCategory(ID);
            assert.strictEqual(result, true);
        });
    });

    describe("getCategories", () => {
        const PAGE = 1, LIMIT = 25;

        it("should return voucher providers", async () => {
            const QueryRepoStub = {
                getAll: sandbox.stub().resolves([])
            }
            const voucherCategoryUseCase = new VoucherCategoryUseCase(null, QueryRepoStub);
            const result = await voucherCategoryUseCase.getCategories(PAGE, LIMIT);
            assert.deepStrictEqual(result, []);
        });
    });
});
