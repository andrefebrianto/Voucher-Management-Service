const RestApiApp = require('../../src/app/RestApi');

describe("Rest Api App Test", () => {
    it("should initiate application", () => {
        RestApiApp.initServer();
    })
});
