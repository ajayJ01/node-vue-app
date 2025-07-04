const authController = require("../controllers/authController");
const authValidation = require("../validations/authValidations.js");

async function authRoutes(fastify, options) {
  fastify.post(
    "/register",
    { schema: authValidation.register },
    authController.registerUser
  );
  fastify.post(
    "/login",
    { schema: authValidation.login },
    authController.loginUser
  );
}

module.exports = authRoutes;
