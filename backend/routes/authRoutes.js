const authController = require('../controllers/authController');
const authenticate = require('../middlewares/authMiddleware');

async function authRoutes(fastify, options) {
    fastify.post('/api/register', authController.registerUser);
    fastify.post('/api/login', authController.loginUser);

    fastify.get('/api/me', { preHandler: authenticate }, authController.getProfile);
}

module.exports = authRoutes;