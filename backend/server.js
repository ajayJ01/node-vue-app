require("dotenv").config();
const fastifyStatic = require("@fastify/static");
const path = require("path");

const fastify = require("fastify")({
  logger: false,
  ajv: {
    customOptions: {
      allErrors: true,
    },
  },
});
const connectDB = require("./config/db");
const fastifyCors = require("@fastify/cors");
const fastifyMultipart = require("@fastify/multipart");

// 1️⃣ Connect to MongoDB
connectDB();
require("./cron/updateDueTasks");

// 2️⃣ Enable CORS
fastify.register(fastifyCors, {
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
});

// 3️⃣ Register multipart ONCE (with limits)
fastify.register(fastifyMultipart, {
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB max
    files: 1,
  },
});

fastify.register(fastifyStatic, {
  root: path.join(__dirname, "uploads"),
  prefix: "/uploads/",
});

// 4️⃣ Health check route
fastify.get("/", async (req, reply) => {
  return { message: "API is running..." };
});

// 5️⃣ Register Routes (after plugins)
fastify.register(require("./routes/authRoutes"));
fastify.register(require("./routes/userRoutes"));
fastify.register(require("./routes/taskRoutes"));

// 6️⃣ Global Error Handler (406-safe)
fastify.setErrorHandler((error, request, reply) => {
  if (error.validation) {
    const errors = {};
    error.validation.forEach((err) => {
      const field = err.instancePath
        .replace(/^\/body\/?/, "")
        .replace(/^\//, "");
      errors[field] = err.message;
    });

    return reply.code(400).type("application/json").send({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  return reply
    .code(error.statusCode || 500)
    .type("application/json")
    .send({
      success: false,
      message: error.message || "Something went wrong",
    });
});

// 7️⃣ Start server
const start = async () => {
  try {
    await fastify.listen({
      port: parseInt(process.env.PORT) || 5000,
      host: "0.0.0.0",
    });
    console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
