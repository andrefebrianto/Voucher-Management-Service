const sandbox = require('sinon').createSandbox();
const assert = require('assert');
const apm = require('elastic-apm-node');
const ObjectId = require('mongodb').ObjectID;

const Query = require('../../../../../src/domain/Voucher/repository/query/mongoDbQuery');
const ExtendedError = require('../../../../../src/model/ExtendedError');
const {ERROR:HttpErrorCode} = require('../../../../../src/constant/HttpStatusCode');
const ErrorMessage = require('../../../../../src/constant/ErrorMessage');
const VoucherType = require('../../../../../src/constant/VoucherType');
const VoucherStatus = require('../../../../../src/constant/VoucherStatus');
const VoucherPurchasing = require('../../../../../src/model/VoucherPurchasing')

describe("MongoDb Voucher Query Test", () => {
    beforeEach(() => {
        sandbox.stub(apm, 'captureError');
    });
    afterEach(() => {
        sandbox.restore();
    });

    const VOUCHER_TRANSACTION = {
        id: new ObjectId("60e2b487ed9efda3d259c6dc"),
        userId: new ObjectId('60d5a60d0fa04802318f4fff'),
        transactionId: "1e36d29c-ab32-4d0d-9d99-a522d32b925f",
        voucher: {
            voucherId: 41,
            referenceId: "910",
            categoryId: 6,
            providerId: 1,
            name: "Redoxon 1 Month Supply",
            value: 150000,
            price: 130000,
            margin: 5000,
            discount: 1000,
            status: VoucherStatus.ACTIVE,
            voucherType: VoucherType.TEXT_CODE,
            term: "Please consume it after lunch",
            description: "Multivitamin supply for one month consist 30 tablets",
            voucherCode: "vobtvKJgtyxGFHmh9FmA",
            issuedAt: new Date(),
            usedAt: null,
            expiredAt: null,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        createdAt: new Date(),
        updatedAt: new Date()
    }

    describe("getUserTransactionById", () => {
        const USER_ID = 123, TRANSACTION_ID = "1e36d29c-ab32-4d0d-9d99-a522d32b925f";

        it("should return voucher", async () => {
            const DatabaseStub = {
                collection: sandbox.stub().returns({ findOne: sandbox.stub().resolves(VOUCHER_TRANSACTION)})
            }
            const query = new Query(DatabaseStub);
            const result = await query.getUserTransactionById(USER_ID, TRANSACTION_ID);
            assert.deepStrictEqual(result, new VoucherPurchasing(VOUCHER_TRANSACTION));
        });

        it("should throw error (voucher transaction not exist)", async () => {
            try {
                const DatabaseStub = {
                    collection: sandbox.stub().returns({ findOne: sandbox.stub().resolves(undefined)})
                }
                const query = new Query(DatabaseStub);
                await query.getUserTransactionById(USER_ID, TRANSACTION_ID);
            } catch (error) {
                assert.deepStrictEqual(error, new ExtendedError("Voucher transaction not found", HttpErrorCode.NOT_FOUND));
            }
        });

        it("should throw error (internal error)", async () => {
            try {
                const DatabaseStub = {
                    collection: sandbox.stub().returns({ findOne: sandbox.stub().rejects(new Error("Error stub"))})
                }
                const query = new Query(DatabaseStub);
                await query.getUserTransactionById(USER_ID, TRANSACTION_ID);
            } catch (error) {
                assert.deepStrictEqual(error, new ExtendedError(ErrorMessage.INTERNAL_SERVER_ERROR, HttpErrorCode.INTERNAL_ERROR));
            }
        });
    });
});
