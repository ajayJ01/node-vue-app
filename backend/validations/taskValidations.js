const taskValidation = {
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
                        pattern: '^[a-fA-F0-9]{24}$'
                    },
                    minItems: 1
                }
            }
        }
    }
}

module.exports = taskValidation;