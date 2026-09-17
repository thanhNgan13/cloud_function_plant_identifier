const path = require("path");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const config = require("./index");

const servers = [
  {
    url: "/v1",
    description: "Current server",
  },
];

if (config.server.publicUrl) {
  servers.unshift({
    url: `${config.server.publicUrl.replace(/\/$/, "")}/v1`,
    description: "Production Server",
  });
}

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "🎨 Personal Color Analysis API",
    version: "1.0.0",
    description:
      "Phân tích màu cá nhân (undertone, subseason, skintone) từ ảnh khuôn mặt bằng Gemini AI.",
  },
  servers,
  tags: [
    {
      name: "Personal Color Analysis",
      description: "🎨 Phân tích màu cá nhân theo hệ 12 mùa",
    },
  ],
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: "apiKey",
        in: "header",
        name: "x-api-key",
      },
    },
  },
  security: config.apiKey ? [{ ApiKeyAuth: [] }] : [],
};

const specs = swaggerJSDoc({
  swaggerDefinition,
  // glob cần dấu "/" kể cả khi chạy trên Windows
  apis: [path.join(__dirname, "../routes/*.js").replace(/\\/g, "/")],
});

module.exports = { swaggerUi, specs };
