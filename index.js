require('dotenv').config()
require('elastic-apm-node').start();
const AppServer = require('./src/app/RestApi');
require('./src/app/MessageQueueConsumer')();
const Config = require('config');
const Logger = require('./src/util/logger/console/Logger');
const port = Config.get('port') || 9000;
let server;

AppServer.initServer()
.then(() => {
    server = AppServer.server.listen(port, () => {
        Logger.info('MainApp:initServer', 'Server started, listening on port: ' + port);
    });
});

const PostgreSqlConnectionPool = require('./src/util/database/PostgreSQL/PostgreSQL');
const MongoDbConnectionPool = require('./src/util/database/MongoDb/connection');
process.on('SIGTERM', () => {
    Logger.info("index", 'SIGTERM signal received');
    Logger.info("index", 'Closing http server...');

    // close server connection
    server.close(() => {
        Logger.info('MainApp', 'Http server closed.');
        setTimeout(() => {
            PostgreSqlConnectionPool.closeConnectionPool();
            MongoDbConnectionPool.closeConnection();
        }, 5000).unref();
    });
});
