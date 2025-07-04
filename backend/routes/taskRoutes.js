const taskController = require("../controllers/taskController.js");
const taskValidation = require("../validations/taskValidations.js");
const authenticate = require("../middlewares/authMiddleware");

async function authRoutes(fastify, options) {
  fastify.register(async function (protectedRoutes) {
    protectedRoutes.addHook("preHandler", authenticate);
    protectedRoutes.post(
      "/tasks/create",
      { preHandler: taskValidation.MultipartTask },
      taskController.createTask
    );
    protectedRoutes.put(
      "/tasks/:id/update",
      { preHandler: taskValidation.MultipartTask },
      taskController.updateTask
    );
    protectedRoutes.get("/tasks", taskController.getAllTasks);
    protectedRoutes.get("/my-tasks", taskController.getMyTasks);
    protectedRoutes.put("/tasks/:id/cancel", taskController.cancelTask);
  });
}

module.exports = authRoutes;
