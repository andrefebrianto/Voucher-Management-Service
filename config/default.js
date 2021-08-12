require('dotenv').config()

module.exports = {
    applicationName: process.env.npm_package_name,
    port: process.env.PORT,
    environment: process.env.NODE_ENV,
    postgreSqlVoucher: "postgresql-voucher",
    mongoDbVoucher: "voucher-mongodb",
    KafkaConfig: {
        url: process.env.KAFKA_URL,
        groupName: process.env.KAFKA_GROUP_NAME,
        consumedTopic: process.env.KAFKA_CONSUMED_TOPIC,
        retryTopic: process.env.KAFKA_RETRY_TOPIC,
        balanceRefundTopic: process.env.KAFKA_BALANCE_REFUND_TOPIC,
        vaRefundTopic: process.env.KAFKA_VA_REFUND_TOPIC
    },
    PostgreSQL: [
        {
            index: "postgresql-voucher",
            config: {
                connectionString: process.env.POSTGRESQL_DATABASE_URL
            }
        }
    ],
    MongoDB: [
        {
            index: "voucher-mongodb",
            config: {
                uri: process.env.MONGO_DB_VOUCHER_URL
            }
        }
    ],
    RedisConfig: {
        url: process.env.REDIS_URL
    },
    DiscordNotificationConfig: {
        baseUrl: process.env.DISCORD_BASE_URL,
        webhookUrl: process.env.DISCORD_WEBHOOK_URL
    },
    VoucherProviderClientConfig: {
        accessKey: process.env.GD_ACCESS_KEY,
        baseUrl: process.env.GD_BASE_URL,
        voucherDetailPath: process.env.GD_VOUCHER_DETAIL_PATH,
        voucherStatusPath: process.env.GD_VOUCHER_STATUS_PATH,
        voucherReservationPath: process.env.GD_VOUCHER_RESERVATION_PATH,
        voucherRedeemUrl: process.env.GD_VOUCHER_REDEEM_URL
    },
    VoucherProviderCode: {
        GILA_DISKON: 3
    },
    GlobalConfigServiceConfig: {
        baseUrl: process.env.GLOBAL_CONFIG_BASE_URL,
        activePartnerProgramPath: process.env.GLOBAL_CONFIG_ACTIVE_PARTNER_PROGRAM_PATH
    },
    TransactionServiceConfig: {
        baseUrl: process.env.TRANSACTION_BASE_URL,
        transactionPath: process.env.TRANSACTION_TRANSACTION_PATH
    }
}
