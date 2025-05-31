const authController = require('../controllers/authController');
const authenticate = require('../middlewares/authMiddleware');
const userValidation = require('../validations/UserValidation.js');


async function authRoutes(fastify, options) {
    fastify.post('/register', { schema: userValidation.register }, authController.registerUser)
    fastify.post('/login', { schema: userValidation.login }, authController.loginUser);

    // ✅ Protected routes group with prefix and middleware
    fastify.register(async function (protectedRoutes) {
        protectedRoutes.addHook('preHandler', authenticate)
        protectedRoutes.get('/me', authController.getProfile)
    })
}

module.exports = authRoutes;