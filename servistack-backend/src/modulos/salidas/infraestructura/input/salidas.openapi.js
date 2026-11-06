const seguridad = [{ bearerAuth: [] }];

module.exports = {
  "/salidas": {
    post: {
      summary: "Registrar la salida de un producto asociada a un proyecto",
      tags: ["Salidas"],
      security: seguridad,
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["proyectoId", "productoId", "cantidad"],
              properties: {
                proyectoId: { type: "integer" },
                productoId: { type: "integer" },
                cantidad: { type: "integer", minimum: 1 },
              },
            },
          },
        },
      },
      responses: {
        201: { description: "Salida registrada y stock actualizado" },
        400: { description: "Datos del movimiento invalidos" },
        422: { description: "Stock insuficiente o proyecto inexistente" },
      },
    },
  },
  "/salidas/proyecto/{proyectoId}/materiales": {
    get: {
      summary: "Consultar cuanto material se ha usado en un proyecto",
      tags: ["Salidas"],
      security: seguridad,
      parameters: [{ in: "path", name: "proyectoId", required: true, schema: { type: "integer" } }],
      responses: { 200: { description: "Cantidad usada por producto" }, 422: { description: "El proyecto no existe" } },
    },
  },
};
