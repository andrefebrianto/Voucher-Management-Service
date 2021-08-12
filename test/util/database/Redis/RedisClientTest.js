const sandbox = require('sinon').createSandbox();
const assert = require('assert');
const Redis = require('redis');

const RedisClient = require('../../../../src/util/database/Redis/RedisClient');

describe("Redis Client Test", () => {
    afterEach(() => {
        sandbox.restore();
    });

    const KEY = "ABC_CONFIG";
    const CONFIG = {
        privateKey: "jhj9ufqgeg99FHQ3J092GQpj09fw23jifjh208gh",
        publicKey: "Ug8ubgfvqehuH0CHJPKQ20HFNQ0h0FH3Q0FHEWIOD"

    };

    describe("get", () => {
        it("should reject error", () => {
            sandbox.stub(Redis.RedisClient.prototype, 'get').yields(new Error(), null);

            RedisClient.get(KEY)
            .catch(error => {
                assert.deepStrictEqual(error, new Error());
            });
        });

        it("should return value", async () => {
            sandbox.stub(Redis.RedisClient.prototype, 'get').yields(null, JSON.stringify(CONFIG));

            const value = await RedisClient.get(KEY);
            assert.deepStrictEqual(value, CONFIG);
        });
    });

    describe("delete", () => {
        it("should reject error", () => {
            sandbox.stub(Redis.RedisClient.prototype, 'del').yields(new Error(), null);

            RedisClient.delete(KEY)
            .catch(error => {
                assert.deepStrictEqual(error, new Error());
            });
        });

        it("should return value", async () => {
            sandbox.stub(Redis.RedisClient.prototype, 'del').yields(null, true);

            const value = await RedisClient.delete(KEY);
            assert.strictEqual(value, true);
        });
    });

    describe("set", () => {
        it("should reject error", () => {
            sandbox.stub(Redis.RedisClient.prototype, 'set').yields(new Error(), null);

            RedisClient.set(KEY, CONFIG)
            .catch(error => {
                assert.deepStrictEqual(error, new Error());
            });
        });

        it("should return true", async () => {
            sandbox.stub(Redis.RedisClient.prototype, 'set').yields(null, 'OK');

            const value = await RedisClient.set(KEY, CONFIG);
            assert.strictEqual(value, true);
        });

        it("should return true", async () => {
            sandbox.stub(Redis.RedisClient.prototype, 'set').yields(null, 'NOK');
            sandbox.stub(Redis.RedisClient.prototype, 'expire');

            const value = await RedisClient.set(KEY, CONFIG, 120);
            assert.strictEqual(value, false);
        });
    });
});
