const taskController = require("../controllers/taskController.js");
const authenticate = require("../middlewares/authMiddleware");
const taskValidation = require("../validations/taskValidations.js");

async function authRoutes(fastify, options) {
  fastify.register(async function (protectedRoutes) {
    protectedRoutes.addHook("preHandler", authenticate);
    protectedRoutes.post(
      "/tasks/create",
      // { preHandler: taskValidation.MultipartTask },
      taskController.createTask
    );

    protectedRoutes.put(
      "/tasks/:id/update",

      // { preHandler: taskValidation.MultipartTask },
      taskController.updateTask
    );

    protectedRoutes.get("/tasks", taskController.getAllTasks);
    protectedRoutes.put("/tasks/:id/cancel", taskController.cancelTask);
  });
}

module.exports = authRoutes;
