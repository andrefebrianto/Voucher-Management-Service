const sandbox = require('sinon').createSandbox();
const apm = require('elastic-apm-node');

const VoucherController = require('../../src/http-controller/Voucher');
const VoucherInventoryUseCase = require('../../src/domain/Voucher/usecase/VoucherInventoryUseCase');
const VoucherCatalogUseCase = require('../../src/domain/Voucher/usecase/VoucherCatalogUseCase');
const VoucherOrderUseCase = require('../../src/domain/Voucher/usecase/VoucherOrderUseCase');
const VoucherStatusUseCase = require('../../src/domain/Voucher/usecase/VoucherStatusUseCase');
const MongoDbConnectionPool = require('../../src/util/database/MongoDb/connection');

const ExtendedError = require('../../src/model/ExtendedError');
const {ERROR:HttpErrorCode} = require('../../src/constant/HttpStatusCode');
const ErrorMessage = require('../../src/constant/ErrorMessage');

describe("Voucher Http Controller Test", () => {
    beforeEach(() => {
        sandbox.stub(apm, 'captureError');
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("createVoucher", () => { 
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

        it("should success to create new voucher", async () => {
            sandbox.stub(VoucherInventoryUseCase.prototype, 'createVoucher').resolves();

            await VoucherController.createVoucher(request, response);
        });

        it("should fail to create new voucher (foreign key not exist)", async () => {
            const error = new ExtendedError("Foreign key not exist", HttpErrorCode.FORBIDDEN)
            sandbox.stub(VoucherInventoryUseCase.prototype, 'createVoucher').rejects(error);


            await VoucherController.createVoucher(request, response);
        });

        it("should fail to get transaction (internal server error)", async () => {
            sandbox.stub(VoucherInventoryUseCase.prototype, 'createVoucher').rejects(new Error());

            await VoucherController.createVoucher(request, response);
        });
    });

    describe("updateVoucher", () => { 
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

        it("should success to update voucher", async () => {
            sandbox.stub(VoucherInventoryUseCase.prototype, 'updateVoucher').resolves();

            await VoucherController.updateVoucher(request, response);
        });

        it("should fail to update voucher (foreign key not exist)", async () => {
            const error = new ExtendedError("Foreign key not exist", HttpErrorCode.FORBIDDEN)
            sandbox.stub(VoucherInventoryUseCase.prototype, 'updateVoucher').rejects(error);


            await VoucherController.updateVoucher(request, response);
        });

        it("should fail to update voucher (internal server error)", async () => {
            sandbox.stub(VoucherInventoryUseCase.prototype, 'updateVoucher').rejects(new Error());

            await VoucherController.updateVoucher(request, response);
        });
    });

    describe("deleteVoucher", () => { 
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

        it("should success to delete voucher", async () => {
            sandbox.stub(VoucherInventoryUseCase.prototype, 'deleteVoucher').resolves();

            await VoucherController.deleteVoucher(request, response);
        });

        it("should fail to delete voucher (voucher not exist)", async () => {
            const error = new ExtendedError(ErrorMessage.NOT_FOUND, HttpErrorCode.NOT_FOUND)
            sandbox.stub(VoucherInventoryUseCase.prototype, 'deleteVoucher').rejects(error);


            await VoucherController.deleteVoucher(request, response);
        });

        it("should fail to delete voucher (internal server error)", async () => {
            sandbox.stub(VoucherInventoryUseCase.prototype, 'deleteVoucher').rejects(new Error());

            await VoucherController.deleteVoucher(request, response);
        });
    });

    describe("getVouchers", () => { 
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

        it("should success to get vouchers", async () => {
            sandbox.stub(VoucherInventoryUseCase.prototype, 'getVouchers').resolves();

            await VoucherController.getVouchers(request, response);
        });

        it("should fail to get vouchers (voucher not exist)", async () => {
            const error = new ExtendedError(ErrorMessage.NOT_FOUND, HttpErrorCode.NOT_FOUND)
            sandbox.stub(VoucherInventoryUseCase.prototype, 'getVouchers').rejects(error);


            await VoucherController.getVouchers(request, response);
        });

        it("should fail to get vouchers (internal server error)", async () => {
            sandbox.stub(VoucherInventoryUseCase.prototype, 'getVouchers').rejects(new Error());

            await VoucherController.getVouchers(request, response);
        });
    });

    describe("getActiveVouchers", () => {
        describe("active vouchers", () => {
            const request = {
                headers: {
                    'x-user-id': "60e2d23ed6b92227a7ed63f9"
                },
                query: {
                    page: 1,
                    limit: 10
                },
                body: {
                    partnerCode: "ABC"
                }
            }
            const response = {
                status: function() {
                    return {
                        json: sandbox.stub().resolves()
                    }
                }
            }

            it("should success to get active vouchers", async () => {
                sandbox.stub(VoucherCatalogUseCase.prototype, 'getActiveVouchers').resolves();

                await VoucherController.getActiveVouchers(request, response);
            });

            it("should fail to get vouchers (voucher not exist)", async () => {
                const error = new ExtendedError(ErrorMessage.NOT_FOUND, HttpErrorCode.NOT_FOUND)
                sandbox.stub(VoucherCatalogUseCase.prototype, 'getActiveVouchers').rejects(error);


                await VoucherController.getActiveVouchers(request, response);
            });

            it("should fail to get vouchers (internal server error)", async () => {
                sandbox.stub(VoucherCatalogUseCase.prototype, 'getActiveVouchers').rejects(new Error());

                await VoucherController.getActiveVouchers(request, response);
            });
        });
        describe("voucher detail", () => {
            const request = {
                headers: {
                    'x-user-id': "60e2d23ed6b92227a7ed63f9"
                },
                query: {
                    page: 1,
                    limit: 10
                },
                body: {
                    partnerCode: "ABC",
                    voucherId: 123
                }
            }
            const response = {
                status: function() {
                    return {
                        json: sandbox.stub().resolves()
                    }
                }
            }

            it("should success to get voucher detail", async () => {
                sandbox.stub(VoucherCatalogUseCase.prototype, 'getActiveVoucherDetail').resolves();

                await VoucherController.getActiveVouchers(request, response);
            });

            it("should fail to get voucher detail (voucher not exist)", async () => {
                const error = new ExtendedError(ErrorMessage.NOT_FOUND, HttpErrorCode.NOT_FOUND)
                sandbox.stub(VoucherCatalogUseCase.prototype, 'getActiveVoucherDetail').rejects(error);


                await VoucherController.getActiveVouchers(request, response);
            });

            it("should fail to get voucher detail (internal server error)", async () => {
                sandbox.stub(VoucherCatalogUseCase.prototype, 'getActiveVoucherDetail').rejects(new Error());

                await VoucherController.getActiveVouchers(request, response);
            });
        });
    });

    describe("orderVoucher", () => { 
        const request = {
            headers: {
                'x-user-id': "60e2d23ed6b92227a7ed63f9"
            },
            body: {
                transactionId: "a023f1ea-2ecb-457c-aaae-825322334139",
                voucherId: 123,
                partnerCode: "ABC"
            }
        }
        const response = {
            status: function() {
                return {
                    json: sandbox.stub().resolves()
                }
            }
        }

        it("should success to order voucher", async () => {
            const connection = {
                collection: sandbox.stub()
            }
            sandbox.stub(MongoDbConnectionPool, 'getConnection').returns(connection);
            sandbox.stub(VoucherOrderUseCase.prototype, 'orderVoucher').resolves();

            await VoucherController.orderVoucher(request, response);
        });

        it("should fail to order voucher (voucher not exist)", async () => {
            const connection = {
                collection: sandbox.stub()
            }
            sandbox.stub(MongoDbConnectionPool, 'getConnection').returns(connection);
            const error = new ExtendedError(ErrorMessage.NOT_FOUND, HttpErrorCode.NOT_FOUND)
            sandbox.stub(VoucherOrderUseCase.prototype, 'orderVoucher').rejects(error);


            await VoucherController.orderVoucher(request, response);
        });

        it("should fail to order voucher (internal server error)", async () => {
            const connection = {
                collection: sandbox.stub()
            }
            sandbox.stub(MongoDbConnectionPool, 'getConnection').returns(connection);
            sandbox.stub(VoucherOrderUseCase.prototype, 'orderVoucher').rejects(new Error());

            await VoucherController.orderVoucher(request, response);
        });
    });

    describe("getVoucherStatus", () => { 
        const request = {
            headers: {
                'x-user-id': "60e2d23ed6b92227a7ed63f9"
            },
            params: {
                transactionId: "a023f1ea-2ecb-457c-aaae-825322334139"
            }
        }
        const response = {
            status: function() {
                return {
                    json: sandbox.stub().resolves()
                }
            }
        }

        it("should success to get voucher status", async () => {
            const connection = {
                collection: sandbox.stub()
            }
            sandbox.stub(MongoDbConnectionPool, 'getConnection').returns(connection);
            sandbox.stub(VoucherStatusUseCase.prototype, 'getVoucherStatus').resolves();

            await VoucherController.getVoucherStatus(request, response);
        });

        it("should fail to get voucher status (voucher not exist)", async () => {
            const connection = {
                collection: sandbox.stub()
            }
            sandbox.stub(MongoDbConnectionPool, 'getConnection').returns(connection);
            const error = new ExtendedError(ErrorMessage.NOT_FOUND, HttpErrorCode.NOT_FOUND)
            sandbox.stub(VoucherStatusUseCase.prototype, 'getVoucherStatus').rejects(error);


            await VoucherController.getVoucherStatus(request, response);
        });

        it("should fail to get voucher status (internal server error)", async () => {
            const connection = {
                collection: sandbox.stub()
            }
            sandbox.stub(MongoDbConnectionPool, 'getConnection').returns(connection);
            sandbox.stub(VoucherStatusUseCase.prototype, 'getVoucherStatus').rejects(new Error());

            await VoucherController.getVoucherStatus(request, response);
        });
    });
});
