const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

const config = require("./config");
const { swaggerUi, specs } = require("./config/swagger");
const personalColorRoutes = require("./routes/personalColorRoutes");
const { apiKeyAuth } = require("./middlewares/security");
const { notFoundHandler, errorHandler } = require("./middlewares/errorHandler");
const { sendSuccessResponse } = require("./utils/sendResponse");

const API_VERSION = "v1";

const app = express();

app.disable("x-powered-by");
app.set("trust proxy", config.server.trustProxy);

// Swagger UI dùng inline script nên tắt CSP mặc định của helmet
app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    origin: config.cors.origins.includes("*") ? "*" : config.cors.origins,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept", "x-api-key"],
  }),
);
app.use(compression());
app.use(morgan(config.server.env === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ limit: "1mb", extended: true }));

// =================================
// HEALTH CHECK & INFO
// =================================
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (req, res) => {
  return sendSuccessResponse(res, 200, "Server Information", {
    message: "Personal Color Analysis Service",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    documentation: {
      swagger: "/api-docs",
      json: "/api-docs.json",
    },
    endpoints: {
      analyze: `POST /${API_VERSION}/personal-color-service/analyze`,
      languages: `GET /${API_VERSION}/personal-color-service/languages`,
      health: "GET /health",
    },
  });
});

// =================================
// SWAGGER DOCUMENTATION
// =================================
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Personal Color Analysis API Documentation",
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      tryItOutEnabled: true,
    },
  }),
);

app.get("/api-docs.json", (req, res) => {
  res.json(specs);
});

// =================================
// API ROUTES
// =================================
app.use(
  `/${API_VERSION}/personal-color-service`,
  apiKeyAuth,
  personalColorRoutes,
);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
