const seguridad = [{ bearerAuth: [] }];

module.exports = {
  "/notificaciones": {
    get: {
      summary: "Listar las notificaciones del sistema",
      tags: ["Notificaciones"],
      security: seguridad,
      responses: { 200: { description: "Listado de notificaciones" } },
    },
  },
  "/notificaciones/{id}/leida": {
    patch: {
      summary: "Marcar una notificacion como leida",
      tags: ["Notificaciones"],
      security: seguridad,
      parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }],
      responses: { 204: { description: "Notificacion marcada como leida" }, 404: { description: "No existe" } },
    },
  },
};
