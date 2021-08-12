const sandbox = require('sinon').createSandbox();
const assert = require('assert');

const PostgreConnectionPool = require('../../../../src/util/database/PostgreSQL/PostgreSQL');

describe("PostgreSQL Connection Pool Test", () => {
    afterEach(() => {
        sandbox.restore();
    });

    describe("init", () => {
        it("should init database pool connection", () => {
            PostgreConnectionPool.init();
        });
    });

    describe("getConnection", () => {
        it("should return registered connection", () => {
            const connection = PostgreConnectionPool.getConnection("postgresql-voucher");
            assert.notDeepStrictEqual(connection, null);
        });
        
        it("should return null", () => {
            const connection = PostgreConnectionPool.getConnection("unknown");
            assert.strictEqual(connection, null);
        });
    });

    describe("closeConnectionPool", () => {
        it("should close connection", () => {
            PostgreConnectionPool.closeConnectionPool();
        });
    });
});
