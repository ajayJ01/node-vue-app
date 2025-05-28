const fastify = require('fastify')({ logger: true });
require('dotenv').config();

// CORS enable
fastify.register(require('@fastify/cors'), { origin: true });

fastify.get('/', async () => {
    return { message: 'Hello from Fastify!' };
});

const start = async () => {
    try {
        await fastify.listen({ port: process.env.PORT || 3000 });
        console.log(`Server running at http://localhost:${process.env.PORT || 3000}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();