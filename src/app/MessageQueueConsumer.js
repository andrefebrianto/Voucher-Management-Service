const apm = require('elastic-apm-node');
const kafka = require('kafka-node');
const config = require('config');

const Logger = require('../util/logger/console/Logger');
const VoucherMQController = require('../mq-controller/Voucher');

async function AppConsumer() {
    const messageBrokerConfig = config.get("KafkaConfig");
    const options = {
        kafkaHost: messageBrokerConfig.url,
        groupId: messageBrokerConfig.groupName,
        autoCommit: false,
        sessionTimeout: 15000,
        fetchMaxBytes: 10 * 1024 * 1024, // 10 MB
        protocol: ['roundrobin'],
        fromOffset: 'latest',
        outOfRangeOffset: 'earliest'
    };

    const consumerGroup = new kafka.ConsumerGroup(options, messageBrokerConfig.consumedTopic.split(' '));
    /* istanbul ignore next */
    consumerGroup.on('connect', function () {
        Logger.info("Server:AppConsumer", `Connected to message broker`);
    })

    /* istanbul ignore next */
    consumerGroup.on('error', function onError(error) {
        Logger.error("Server:AppConsumer", "Kafka Error", error);
        apm.captureError(error)
    });

    /* istanbul ignore next */
    consumerGroup.on('message', async function (message) {
        await handleIncomingMessage(consumerGroup, message);
    });
    
    process.on('SIGTERM', () => {
        Logger.info("Server:AppConsumer", 'SIGTERM signal received');
        Logger.info("Server:AppConsumer", 'Closing app...');

        consumerGroup.pause();
        setTimeout(() => {
            consumerGroup.close(true, () => {
                Logger.info("Server:AppConsumer", "Message broker connection closed");
            })
        }, 15000).unref();
    });
}

async function handleIncomingMessage (consumer, message) {
    const payload = JSON.parse(message.value);
    Logger.info("Server:handleIncomingMessage", "Transaction " + payload.transactionId + " is being processed");
    await VoucherMQController.orderVoucher(payload);

    //Commit offset manually
    setTimeout(() => {
        consumer.commit((error, _) => {
            Logger.info("Server:handleIncomingMessage", "Transaction " + payload.transactionId + " has been processed");
            if (error) {
                Logger.error("Server:handleIncomingMessage", 'error commiting kafka offset' + error);
            }
        })
    }, 0);
}

module.exports = AppConsumer;
