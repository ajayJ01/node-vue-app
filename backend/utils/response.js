function success(reply, message, data = {}) {
    return reply.code(200).send({
        success: true,
        message,
        data
    });
}

function error(reply, code = 500, message = 'Something went wrong') {
    return reply.code(code).send({
        success: false,
        message
    });
}

function validationError(reply, { errors = {}, message = 'Validation failed', statusCode = 400 } = {}) {
    return reply.code(statusCode).send({
        success: false,
        message,
        errors
    });
}

module.exports = {
    success,
    error,
    validationError
};
