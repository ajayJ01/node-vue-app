const jwt = require("jsonwebtoken");

const authenticate = async (req, reply) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return reply.code(401).send({
        code: 'NO_TOKEN',
        message: "Unauthorized: No token provided"
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return reply.code(401).send({
        code: 'TOKEN_EXPIRED',
        message: "Unauthorized: Token expired"
      });
    }

    return reply.code(401).send({
      code: 'INVALID_TOKEN',
      message: "Unauthorized: Invalid token"
    });
  }
};

module.exports = authenticate;