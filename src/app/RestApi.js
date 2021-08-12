const apm = require('elastic-apm-node');
const express = require('express');
const helmet = require('helmet');
const winston = require('winston');
const expressWinston = require('express-winston');
const PostgreSqlConnectionPool = require('../util/database/PostgreSQL/PostgreSQL');
const MongoDbConnectionPool = require('../util/database/MongoDb/connection');
const ResponseWrapper = require('../util/http/ReponseWrapper');

//Controllers
const VoucherCategoryRouter = require('../http-router/VoucherCategory');
const VoucherProviderRouter = require('../http-router/VoucherProvider');
const VoucherRouter = require('../http-router/Voucher');

/**
 * @class
 */
class AppServer {
    /**
     * Initialize server
     */
    static async initServer() {
        this.server = express();
        PostgreSqlConnectionPool.init();
        await MongoDbConnectionPool.init();

        this.server.use(apm.middleware.connect());
        this.server.use(helmet());
        this.server.use(express.urlencoded({extended: false}));
        this.server.use(express.json());

        this.server.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-access-token');
            res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH');
            next();
        });

        this.server.use(expressWinston.logger({
            transports: [
                new winston.transports.Console(),
            ],
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple(),
            ),
            meta: true, // optional: control whether you want to log the meta data about the request (default to true)
            msg: '{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}',
            expressFormat: true,
            colorize: true,
            ignoreRoute: function(req, res) {
                return false;
            }, // optional: allows to skip some log messages based on request and/or response
        }));

        /* Endpoint for heartbeat */
        this.server.get('/', (_, response) => {
            ResponseWrapper.response(response, true, null, 'This service is running properly\'', 200);
        });

        VoucherCategoryRouter.routes(this.server);
        VoucherProviderRouter.routes(this.server);
        VoucherRouter.routes(this.server);
    }
}

module.exports = AppServer;
