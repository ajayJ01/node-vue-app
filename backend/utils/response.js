function success(reply, message, data = {}) {
    return reply
        .code(200)
        .type('application/json')
        .send({
            success: true,
            message,
            data,
        });
}

function error(reply, code = 500, message = 'Something went wrong') {
    return reply
        .code(code)
        .type('application/json')
        .send({
            success: false,
            message,
        });
}

function validationError(reply, { errors = {}, message = 'Validation failed', statusCode = 400 } = {}) {
    return reply
        .code(statusCode)
        .type('application/json')
        .send({
            success: false,
            message,
            errors,
        });
}

function notFound(reply, message = 'Data not found') {
    return reply
        .code(404)
        .type('application/json')
        .send({
            success: false,
            message,
        });
}

function conflict(reply, message = 'Resource already exists') {
    return reply
        .code(409)
        .type('application/json')
        .send({
            success: false,
            message,
        });
}

function unauthorized(reply, message = 'Unauthorized') {
    return reply
        .code(401)
        .type('application/json')
        .send({
            success: false,
            message,
        });
}

function forbidden(reply, message = 'Forbidden') {
    return reply
        .code(403)
        .type('application/json')
        .send({
            success: false,
            message,
        });
}

function badRequest(reply, message = 'Bad request') {
    return reply
        .code(400)
        .type('application/json')
        .send({
            success: false,
            message,
        });
}

module.exports = {
    success,
    error,
    validationError,
    notFound,
    conflict,
    unauthorized,
    forbidden,
    badRequest,
};