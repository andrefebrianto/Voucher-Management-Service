const response = (res, status, data, message, code) => {
    res.status(code).json(
        {
            status,
            code,
            message,
            data
        }
    );
};

const paginationResponse = (res, status, payload, message, code) => {
    res.status(code).json(
        {
            status,
            data: payload.data,
            meta: payload.meta,
            code,
            message
        }
    );
};

module.exports = {
    response,
    paginationResponse
}
