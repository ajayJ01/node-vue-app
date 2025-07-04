const userController = require("../controllers/userController");
const authenticate = require("../middlewares/authMiddleware");

async function authRoutes(fastify, options) {
  fastify.register(async function (protectedRoutes) {
    protectedRoutes.addHook("preHandler", authenticate);
    protectedRoutes.get("/me", userController.getProfile);
    protectedRoutes.get("/users", userController.getAllNormalUsers);
  });
}

module.exports = authRoutes;
