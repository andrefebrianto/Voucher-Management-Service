const ResponseWrapper = require('../../../src/util/http/ReponseWrapper');
const { ERROR:ErrorCode, SUCCESS:SuccessCode } = require('../../../src/constant/HttpStatusCode');
const sandbox = require('sinon').createSandbox();

describe("Response Wrapper", () => {
    const Response = { status: sandbox.stub().returns({ json: sandbox.stub() }) };

    describe("response", () => {
        it("Sending OK response", () => {
            ResponseWrapper.response(Response, true, {}, "OK", SuccessCode.OK);
        });

        it("Sending Created response", () => {
            ResponseWrapper.response(Response, true, {}, "Created", SuccessCode.CREATED);
        });

        it("Sending Not Found response", () => {
            ResponseWrapper.response(Response, false, {}, "Not Found", ErrorCode.NOT_FOUND);
        });

        it("Sending Internal Server Error response", () => {
            ResponseWrapper.response(Response, true, {}, "Internal Server Error", ErrorCode.INTERNAL_ERROR);
        });
    });
    
    describe("paginationResponse", () => {
        it("Sending OK response", () => {
            ResponseWrapper.paginationResponse(Response, true, {data: {}, meta: {}}, "OK", SuccessCode.OK);
        });

        it("Sending Not Found response", () => {
            ResponseWrapper.paginationResponse(Response, false, {data: {}, meta: {}}, "Not Found", ErrorCode.NOT_FOUND);
        });

        it("Sending Internal Server Error response", () => {
            ResponseWrapper.paginationResponse(Response, true, {data: {}, meta: {}}, "Internal Server Error", ErrorCode.INTERNAL_ERROR);
        });
    });
});
