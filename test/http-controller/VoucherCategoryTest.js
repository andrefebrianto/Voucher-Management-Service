const sandbox = require('sinon').createSandbox();
const apm = require('elastic-apm-node');

const VoucherCategoryController = require('../../src/http-controller/VoucherCategory');
const VoucherCategoryUseCase = require('../../src/domain/VoucherCategory/usecase/VoucherCategoryUseCase');

const ExtendedError = require('../../src/model/ExtendedError');
const {ERROR:HttpErrorCode} = require('../../src/constant/HttpStatusCode');
const ErrorMessage = require('../../src/constant/ErrorMessage');

describe("Voucher Category Http Controller Test", () => {
    beforeEach(() => {
        sandbox.stub(apm, 'captureError');
    });

    afterEach(() => {
        sandbox.restore();
    });

    
    describe("createVoucherCategory", () => { 
        const request = {
            headers: {
                'x-user-id': "60e2d23ed6b92227a7ed63f9"
            },
            body: {}
        }
        const response = {
            status: function() {
                return {
                    json: sandbox.stub().resolves()
                }
            }
        }

        it("should success to create new voucher category", async () => {
            sandbox.stub(VoucherCategoryUseCase.prototype, 'createCategory').resolves();

            await VoucherCategoryController.createVoucherCategory(request, response);
        });

        it("should fail to create new voucher category (invalid format)", async () => {
            const error = new ExtendedError(ErrorMessage.INVALID_INPUT_PARAMETER, HttpErrorCode.BAD_REQUEST);
            sandbox.stub(VoucherCategoryUseCase.prototype, 'createCategory').rejects(error);


            await VoucherCategoryController.createVoucherCategory(request, response);
        });

        it("should fail to create new voucher category (internal server error)", async () => {
            sandbox.stub(VoucherCategoryUseCase.prototype, 'createCategory').rejects(new Error());

            await VoucherCategoryController.createVoucherCategory(request, response);
        });
    });

    describe("updateVoucherCategory", () => { 
        const request = {
            headers: {
                'x-user-id': "60e2d23ed6b92227a7ed63f9"
            },
            body: {},
            params: {id: 101}
        }
        const response = {
            status: function() {
                return {
                    json: sandbox.stub().resolves()
                }
            }
        }

        it("should success to update voucher category", async () => {
            sandbox.stub(VoucherCategoryUseCase.prototype, 'updateCategory').resolves();

            await VoucherCategoryController.updateVoucherCategory(request, response);
        });

        it("should fail to update voucher category (voucher category not exist)", async () => {
            const error = new ExtendedError(ErrorMessage.NOT_FOUND, HttpErrorCode.NOT_FOUND)
            sandbox.stub(VoucherCategoryUseCase.prototype, 'updateCategory').rejects(error);


            await VoucherCategoryController.updateVoucherCategory(request, response);
        });

        it("should fail to update voucher category (internal server error)", async () => {
            sandbox.stub(VoucherCategoryUseCase.prototype, 'updateCategory').rejects(new Error());

            await VoucherCategoryController.updateVoucherCategory(request, response);
        });
    });

    describe("deleteVoucherCategory", () => { 
        const request = {
            headers: {
                'x-user-id': "60e2d23ed6b92227a7ed63f9"
            },
            body: {},
            params: {id: 101}
        }
        const response = {
            status: function() {
                return {
                    json: sandbox.stub().resolves()
                }
            }
        }

        it("should success to delete voucher category", async () => {
            sandbox.stub(VoucherCategoryUseCase.prototype, 'deleteCategory').resolves();

            await VoucherCategoryController.deleteVoucherCategory(request, response);
        });

        it("should fail to delete voucher category (voucher category not exist)", async () => {
            const error = new ExtendedError(ErrorMessage.NOT_FOUND, HttpErrorCode.NOT_FOUND)
            sandbox.stub(VoucherCategoryUseCase.prototype, 'deleteCategory').rejects(error);


            await VoucherCategoryController.deleteVoucherCategory(request, response);
        });

        it("should fail to delete voucher category (internal server error)", async () => {
            sandbox.stub(VoucherCategoryUseCase.prototype, 'deleteCategory').rejects(new Error());

            await VoucherCategoryController.deleteVoucherCategory(request, response);
        });
    });

    describe("getVoucherCategory", () => { 
        const request = {
            headers: {
                'x-user-id': "60e2d23ed6b92227a7ed63f9"
            },
            query: {
                page: 1,
                limit: 10
            }
        }
        const response = {
            status: function() {
                return {
                    json: sandbox.stub().resolves()
                }
            }
        }

        it("should success to get voucher categories", async () => {
            sandbox.stub(VoucherCategoryUseCase.prototype, 'getCategories').resolves();

            await VoucherCategoryController.getVoucherCategory(request, response);
        });

        it("should fail to get vouchers categories (voucher not exist)", async () => {
            const error = new ExtendedError(ErrorMessage.NOT_FOUND, HttpErrorCode.NOT_FOUND)
            sandbox.stub(VoucherCategoryUseCase.prototype, 'getCategories').rejects(error);


            await VoucherCategoryController.getVoucherCategory(request, response);
        });

        it("should fail to get vouchers categories (internal server error)", async () => {
            sandbox.stub(VoucherCategoryUseCase.prototype, 'getCategories').rejects(new Error());

            await VoucherCategoryController.getVoucherCategory(request, response);
        });
    });
});
