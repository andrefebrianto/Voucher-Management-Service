const Config = require('config');
const Logger = require('../logger/console/Logger');
const kafka = require('kafka-node');
const Producer = kafka.HighLevelProducer;
const kafkaConfig = Config.get("KafkaConfig");
const client = new kafka.KafkaClient({kafkaHost: kafkaConfig.url});
const kafkaClient = new Producer(client);

client.on("connect", () => {
    Logger.info("MessageBroker", "Connected to message broker");
});

client.on("error", (error) => {
    Logger.error("MessageBroker", "Kafka Error", error);
})

class KafkaClient {
    static publishMessage(data, topic) {
        const payload = [
            {
                topic: topic,
                messages: JSON.stringify(data),
                attributes: 1,
                timestamp: Date.now(),
            },
        ];

        return new Promise((resolve, reject) => {
            kafkaClient.send(payload, (error, data) => {
                if (error) {
                    return reject(error);
                }
                return resolve(data);
            });
        });
    }
}

module.exports = KafkaClient;
