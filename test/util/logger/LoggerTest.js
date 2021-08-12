const Logger = require('../../../src/util/logger/console/Logger');

describe("Logger", () => {
    describe("info", () => {
        it("log level info without object", () => {
            Logger.info("Logger Test", "Logger info");
        });

        it("log level info with object", () => {
            const object = {
                message: ""
            }
            Logger.info("Logger Test", "Logger info", object);
        });
    });

    describe("debug", () => {
        it("log level debug without object", () => {
            Logger.debug("Logger Test", "Logger debug");
        });

        it("log level debug with object", () => {
            const object = {
                message: ""
            }
            Logger.debug("Logger Test", "Logger debug", object);
        });
    });

    describe("error", () => {
        it("log level error without object", () => {
            Logger.error("Logger Test", "Logger error");
        });

        it("log level error with object", () => {
            const object = {
                message: ""
            }
            Logger.error("Logger Test", "Logger error", object);
        });
    });
});
