require('dotenv').config();
const fastify = require('fastify')({
    logger: true,
    ajv: {
        customOptions: {
            allErrors: true
        }
    }
});
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

// CORS enable
fastify.register(require('@fastify/cors'), {
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
});

fastify.get('/', async (req, reply) => {
    return { message: 'API is running...' };
});

fastify.register(require('./routes/authRoutes'));
fastify.register(require('./routes/taskRoutes'));

fastify.setErrorHandler((error, request, reply) => {
    if (error.validation) {
        const errors = {};
        error.validation.forEach(err => {
            const field = err.instancePath.replace(/^\/body\/?/, '').replace(/^\//, '');
            errors[field] = err.message;
        });

        return reply.status(400).send({
            success: false,
            message: 'Validation failed',
            errors,
        });
    }

    return reply.status(error.statusCode || 500).send({
        success: false,
        message: error.message || 'Something went wrong',
    });
});

// Start server
const start = async () => {
    try {
        await fastify.listen({
            port: parseInt(process.env.PORT) || 5000,
            host: '0.0.0.0',
        });
        console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();