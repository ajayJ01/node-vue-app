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

    taskCreate: {
        body: {
            type: 'object',
            required: ['title', 'description', 'dueDate', 'assignedTo'],
            properties: {
                title: { type: 'string', minLength: 3 },
                description: { type: 'string', minLength: 5 },
                dueDate: { type: 'string', format: 'date-time' },
                assignedTo: {
                    type: 'array',
                    items: {
                        type: 'string',
                        pattern: '^[a-fA-F0-9]{24}$' // MongoDB ObjectId format
                    },
                    minItems: 1
                }
            }
        }
    }
};



module.exports = userValidation;