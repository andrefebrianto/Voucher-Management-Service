const Config = require('config');
const Redis = require('redis');
const Logger = require('../../logger/console/Logger');
const client = Redis.createClient(Config.get('RedisConfig'));

class RedisClient {

    static get(key) {
        return new Promise((resolve, reject) => {
            client.get(key, (error, reply) => {
                if (error) {
                    return reject(error);
                } else {
                    return resolve(JSON.parse(reply));
                }
            });
        });
    }

    static set(key, value, expirationInSeconds) {
        return new Promise((resolve, reject) => {
            client.set(key, JSON.stringify(value), (error, reply) => {
                if (error) {
                    return reject(error);
                }
                
                if (typeof expirationInSeconds === "number") {
                    client.expire(key, expirationInSeconds)
                }

                if (reply === 'OK') {
                    return resolve(true);
                }
                return resolve(false);
            });
        });
    }

    static delete(key) {
        return new Promise((resolve, reject) => {
            client.del(key, (error, reply) => {
                if (error) {
                    return reject(error);
                }
                return resolve(reply);
            });
        });
    }
}

client.on('error', (error) => {
    Logger.error('RedisClient', 'Redis error connection', error);
});

module.exports = RedisClient;
