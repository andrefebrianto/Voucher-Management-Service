const sandbox = require('sinon').createSandbox();
const assert = require('assert');
const apm = require('elastic-apm-node');
const ObjectId = require('mongodb').ObjectID;

const Command = require('../../../../../src/domain/Voucher/repository/command/mongoDbCommand');
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

    describe("insert", () => {
        it("should return voucher", async () => {
            const DatabaseStub = {
                collection: sandbox.stub().returns({ insertOne: sandbox.stub().resolves(VOUCHER_TRANSACTION)}),
                collection: sandbox.stub().returns({ updateOne: sandbox.stub().resolves(VOUCHER_TRANSACTION)})
            }
            const command = new Command(DatabaseStub);
            const result = await command.insert(VOUCHER_TRANSACTION);
            const expectedResult = new VoucherPurchasing(VOUCHER_TRANSACTION);
            assert.deepStrictEqual(result, expectedResult);
        });

        it("should throw error (internal error)", async () => {
            try {
                const DatabaseStub = {
                    collection: sandbox.stub().returns({ insertOne: sandbox.stub().rejects(new Error("Error stub"))})
                }
                const command = new Command(DatabaseStub);
                await command.insert(VOUCHER_TRANSACTION);
            } catch (error) {
                assert.deepStrictEqual(error, new ExtendedError(ErrorMessage.INTERNAL_SERVER_ERROR, HttpErrorCode.INTERNAL_ERROR));
            }
        });
    });
});
