const sandbox = require('sinon').createSandbox();
const apm = require('elastic-apm-node');

const VoucherProviderController = require('../../src/http-controller/VoucherProvider');
const VoucherProviderUseCase = require('../../src/domain/VoucherProvider/usecase/VoucherProviderUseCase');

const ExtendedError = require('../../src/model/ExtendedError');
const {ERROR:HttpErrorCode} = require('../../src/constant/HttpStatusCode');
const ErrorMessage = require('../../src/constant/ErrorMessage');

describe("Voucher Provider Http Controller Test", () => {
    beforeEach(() => {
        sandbox.stub(apm, 'captureError');
    });

    afterEach(() => {
        sandbox.restore();
    });

    
    describe("createVoucherProvider", () => { 
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

        it("should success to create new voucher provider", async () => {
            sandbox.stub(VoucherProviderUseCase.prototype, 'createVoucherProvider').resolves();

            await VoucherProviderController.createVoucherProvider(request, response);
        });

        it("should fail to create new voucher provider (invalid format)", async () => {
            const error = new ExtendedError(ErrorMessage.INVALID_INPUT_PARAMETER, HttpErrorCode.BAD_REQUEST);
            sandbox.stub(VoucherProviderUseCase.prototype, 'createVoucherProvider').rejects(error);


            await VoucherProviderController.createVoucherProvider(request, response);
        });

        it("should fail to create new voucher provider (internal server error)", async () => {
            sandbox.stub(VoucherProviderUseCase.prototype, 'createVoucherProvider').rejects(new Error());

            await VoucherProviderController.createVoucherProvider(request, response);
        });
    });

    describe("updateVoucherProvider", () => { 
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

        it("should success to update voucher provider", async () => {
            sandbox.stub(VoucherProviderUseCase.prototype, 'updateVoucherProvider').resolves();

            await VoucherProviderController.updateVoucherProvider(request, response);
        });

        it("should fail to update voucher provider (voucher provider not exist)", async () => {
            const error = new ExtendedError(ErrorMessage.NOT_FOUND, HttpErrorCode.BAD_REQUEST);
            sandbox.stub(VoucherProviderUseCase.prototype, 'updateVoucherProvider').rejects(error);


            await VoucherProviderController.updateVoucherProvider(request, response);
        });

        it("should fail to update voucher provider (internal server error)", async () => {
            sandbox.stub(VoucherProviderUseCase.prototype, 'updateVoucherProvider').rejects(new Error());

            await VoucherProviderController.updateVoucherProvider(request, response);
        });
    });

    describe("deleteVoucherProvider", () => { 
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

        it("should success to delete voucher provider", async () => {
            sandbox.stub(VoucherProviderUseCase.prototype, 'deleteVoucherProvider').resolves();

            await VoucherProviderController.deleteVoucherProvider(request, response);
        });

        it("should fail to delete voucher provider (voucher not exist)", async () => {
            const error = new ExtendedError(ErrorMessage.NOT_FOUND, HttpErrorCode.NOT_FOUND)
            sandbox.stub(VoucherProviderUseCase.prototype, 'deleteVoucherProvider').rejects(error);


            await VoucherProviderController.deleteVoucherProvider(request, response);
        });

        it("should fail to delete voucher provider (internal server error)", async () => {
            sandbox.stub(VoucherProviderUseCase.prototype, 'deleteVoucherProvider').rejects(new Error());

            await VoucherProviderController.deleteVoucherProvider(request, response);
        });
    });

    describe("getVoucherProvider", () => { 
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

        it("should success to get voucher providers", async () => {
            sandbox.stub(VoucherProviderUseCase.prototype, 'getVoucherProviders').resolves();

            await VoucherProviderController.getVoucherProvider(request, response);
        });

        it("should fail to get voucher providers (voucher not exist)", async () => {
            const error = new ExtendedError(ErrorMessage.NOT_FOUND, HttpErrorCode.NOT_FOUND)
            sandbox.stub(VoucherProviderUseCase.prototype, 'getVoucherProviders').rejects(error);


            await VoucherProviderController.getVoucherProvider(request, response);
        });

        it("should fail to get voucher providers (internal server error)", async () => {
            sandbox.stub(VoucherProviderUseCase.prototype, 'getVoucherProviders').rejects(new Error());

            await VoucherProviderController.getVoucherProvider(request, response);
        });
    });
});
