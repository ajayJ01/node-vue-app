const jwt = require("jsonwebtoken");

const authenticate = async (req, reply) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return reply
        .code(401)
        .send({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return reply.code(401).send({ message: "Unauthorized: Token expired" });
    }

    return reply.code(401).send({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = authenticate;
