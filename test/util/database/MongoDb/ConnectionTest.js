const sandbox = require('sinon').createSandbox();
const mongoClient = require('mongodb');

const connection = require('../../../../src/util/database/MongoDb/connection');

describe("MongoDB Connection", () => {
    describe("init", () => {
        afterEach(() => {
            sandbox.restore();
        });

        it("should success to init mongodb connection", async () => {
            sandbox.stub(mongoClient, 'connect').resolves({});
            await connection.init();
        });

        it("should failed to init mongodb connection", async () => {
            sandbox.stub(mongoClient, 'connect').rejects({});
            await connection.init();
        });
    });

    describe("getConnection", () => {
        afterEach(() => {
            sandbox.restore();
        });

        it("should return null", () => {
            const conn = connection.getConnection("");
        });

        it("should return mongodb active connection", async () => {
            sandbox.stub(mongoClient, 'connect').resolves({ isConnected: sandbox.stub().returns(true), db: sandbox.stub() });
            await connection.init();
            const conn = connection.getConnection("voucher-mongodb");
        });

        it("should return mongodb no connection", async () => {
            sandbox.stub(mongoClient, 'connect').resolves({ isConnected: sandbox.stub().returns(false), db: sandbox.stub() });
            await connection.init();
            const conn = connection.getConnection("voucher-mongodb");
        });
    });

    describe("close", () => {
        afterEach(() => {
            sandbox.restore();
        });

        it("should close all mongodb connection", async () => {
            sandbox.stub(mongoClient, 'connect').resolves({ close: sandbox.stub() });
            await connection.init();
            connection.closeConnection();
        });
    });
});
