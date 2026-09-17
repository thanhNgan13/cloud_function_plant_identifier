const config = require("./src/config");
const app = require("./src/app");

const server = app.listen(config.server.port, "0.0.0.0", () => {
  console.log(
    `Personal Color Service listening on port ${config.server.port} (${config.server.env})`,
  );
});

// Phân tích Gemini có thể mất vài chục giây
server.requestTimeout = config.gemini.timeoutMs + 30000;
server.headersTimeout = 65000;
server.keepAliveTimeout = 61000;

const shutdown = (signal) => {
  console.log(`${signal} received, shutting down gracefully...`);
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
  // Buộc thoát nếu còn request treo
  setTimeout(() => process.exit(1), 30000).unref();
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});
