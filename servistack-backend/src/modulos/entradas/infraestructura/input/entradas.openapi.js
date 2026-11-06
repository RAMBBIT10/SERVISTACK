module.exports = {
  "/entradas": {
    post: {
      summary: "Registrar una entrada de mercancia asociada a un pedido",
      tags: ["Entradas"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["pedidoId", "productoId", "cantidad"],
              properties: {
                pedidoId: { type: "integer" },
                productoId: { type: "integer" },
                cantidad: { type: "integer", minimum: 1 },
              },
            },
          },
        },
      },
      responses: {
        201: { description: "Entrada registrada y stock actualizado" },
        400: { description: "Datos del movimiento invalidos" },
        422: { description: "El pedido no existe" },
      },
    },
  },
};
