const ResponseWrapper = require('../util/http/ReponseWrapper');
const ErrorMessage = require('../constant/ErrorMessage');
const { validationResult } = require('express-validator');

function validateInput (request, response, next) {
    const errors = validationResult(request);
	if (!errors.isEmpty()) {
		ResponseWrapper.response(response, false, errors.array(), ErrorMessage.INVALID_INPUT_PARAMETER, 400);
		return;
    }
    next();
}

module.exports = validateInput;
