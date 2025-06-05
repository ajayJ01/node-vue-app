const userValidation = {
    register: {
        body: {
            type: 'object',
            required: ['name', 'email', 'password'],
            properties: {
                name: { type: 'string', minLength: 3 },
                email: { type: 'string', format: 'email', minLength: 12 },
                password: { type: 'string', minLength: 6 },
            },
        },
    },

    login: {
        body: {
            type: 'object',
            required: ['email', 'password'],
            properties: {
                email: { type: 'string', format: 'email', minLength: 12 },
                password: { type: 'string', minLength: 6 },
            },
        },
    },
};



module.exports = userValidation;