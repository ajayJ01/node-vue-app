const taskController = require('../controllers/taskController.js');
const authenticate = require('../middlewares/authMiddleware');
const taskValidation = require('../validations/taskValidations.js');

async function authRoutes(fastify, options) {
    fastify.register(async function (protectedRoutes) {
        protectedRoutes.addHook('preHandler', authenticate)
        protectedRoutes.post('/tasks/create', { schema: taskValidation.taskCreate }, taskController.createTask)
        protectedRoutes.get('/tasks', taskController.getAllTasks);
        protectedRoutes.put('/tasks/:id/cancel', taskController.cancelTask);
    })
}

module.exports = authRoutes;