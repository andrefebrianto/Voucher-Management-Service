const MongoClient = require('mongodb');
const config = require('config');
const Logger = require('../../logger/console/Logger');

const connectionPool = [];

const connection = () => {
    return { index: null, config: '', db: null };
};

const createConnection = (config) => {
    const options = {
        poolSize: 50,
        keepAlive: 15000,
        socketTimeoutMS: 15000,
        connectTimeoutMS: 15000,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    return MongoClient.connect(config.uri, options);
};

const addConnectionPool = () => {
    const databases = config.get("MongoDB");
    for (const database of databases) {
        const newConnection = connection();
        newConnection.index = database.index;
        newConnection.config = database.config;
        connectionPool.push(newConnection);
    }
};

const createConnectionPool = async () => {
    for (const connection of connectionPool) {
        try {
            connection.db = await createConnection(connection.config);
        } catch (error) {
            Logger.error("MongoDbConnection:createConnectionPool", `Error create mongodb conection for ${connection.index}`, error);
        }
    }
};

const init = async () => {
    addConnectionPool();
    await createConnectionPool();
};

const isConnected = (connection) => {
    return connection.isConnected();
};

const getConnection = (index) => {
    for (const connection of connectionPool) {
        if (connection.index === index) {
            if (isConnected(connection.db)) {
                return connection.db.db();
            } else {
                return null;
            }
        }
    }
    return null;
};

const closeConnection = () => {
    for (const connection of connectionPool) {
        connection.db.close();
    }
}

module.exports = {
    init,
    getConnection,
    closeConnection
};
