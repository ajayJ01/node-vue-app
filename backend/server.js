require('dotenv').config();
const fastify = require('fastify')({ logger: true });
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

// CORS enable
fastify.register(require('@fastify/cors'), { origin: true });

fastify.get('/', async (req, reply) => {
    return { message: 'API is running...' };
});

fastify.register(require('./routes/authRoutes'));
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