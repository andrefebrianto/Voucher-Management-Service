const {Pool, types} = require('pg');
const config = require('config');
const connectionPool = [];

const connection = () => {
    return { index: null, config: '', db: null };
};

function addConnectionPool() {
    const databases = config.get("PostgreSQL");
    for (const database of databases) {
        const newConnection = connection();
        newConnection.index = database.index;
        newConnection.config = database.config;
        connectionPool.push(newConnection);
    }
}

async function createConnectionPool() {
    for (const connection of connectionPool) {
        connection.db = new Pool(connection.config);
    }
}

function getConnection(index) {
    for (const connection of connectionPool) {
        if (connection.index === index) {
            return connection.db;
        }
    }
    return null;
}

function closeConnectionPool() {
    for (const connection of connectionPool) {
        if (connection.db !== null) {
            connection.db.end();
        }
    }
}

function init() {
    types.setTypeParser(types.builtins.INT8, (value) => {
        return parseInt(value);
    });
    
    types.setTypeParser(types.builtins.FLOAT8, (value) => {
        return parseFloat(value);
    });
    
    types.setTypeParser(types.builtins.NUMERIC, (value) => {
        return parseFloat(value);
    });

    addConnectionPool();
    createConnectionPool();
}

module.exports = {
    init,
    getConnection,
    closeConnectionPool
}
