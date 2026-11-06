const seguridad = [{ bearerAuth: [] }];
const parametroId = { in: "path", name: "id", required: true, schema: { type: "integer" } };

module.exports = {
  "/productos": {
    post: {
      summary: "Registrar un nuevo producto",
      tags: ["Productos"],
      security: seguridad,
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["nombre", "categoria", "codigo"],
              properties: {
                nombre: { type: "string" },
                categoria: { type: "string" },
                codigo: { type: "string" },
                cantidadMinima: { type: "integer" },
              },
            },
          },
        },
      },
      responses: { 201: { description: "Producto creado" }, 400: { description: "Faltan datos obligatorios" } },
    },
    get: {
      summary: "Listar todos los productos, con cache",
      tags: ["Productos"],
      security: seguridad,
      responses: { 200: { description: "Listado de productos" } },
    },
  },
  "/productos/stock-bajo": {
    get: {
      summary: "Listar los productos por debajo del stock minimo",
      tags: ["Productos"],
      security: seguridad,
      responses: { 200: { description: "Productos en stock bajo" } },
    },
  },
  "/productos/{id}": {
    get: {
      summary: "Consultar un producto y su stock actual, con cache",
      tags: ["Productos"],
      security: seguridad,
      parameters: [parametroId],
      responses: { 200: { description: "Producto encontrado" }, 404: { description: "Producto no encontrado" } },
    },
  },
  "/productos/{id}/qr": {
    get: {
      summary: "Descargar la etiqueta QR del producto",
      tags: ["Productos"],
      security: seguridad,
      parameters: [parametroId],
      responses: { 200: { description: "Imagen PNG del codigo QR" }, 404: { description: "Producto no encontrado" } },
    },
  },
};
