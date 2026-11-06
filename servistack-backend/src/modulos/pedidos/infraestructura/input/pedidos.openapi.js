const seguridad = [{ bearerAuth: [] }];

module.exports = {
  "/pedidos": {
    post: {
      summary: "Crear un pedido a un proveedor",
      tags: ["Pedidos"],
      security: seguridad,
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { type: "object", required: ["proveedor"], properties: { proveedor: { type: "string" } } },
          },
        },
      },
      responses: { 201: { description: "Pedido creado" }, 400: { description: "El proveedor es obligatorio" } },
    },
  },
  "/pedidos/{id}": {
    get: {
      summary: "Consultar el detalle de un pedido",
      tags: ["Pedidos"],
      security: seguridad,
      parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }],
      responses: { 200: { description: "Pedido encontrado" }, 404: { description: "Pedido no encontrado" } },
    },
  },
};
