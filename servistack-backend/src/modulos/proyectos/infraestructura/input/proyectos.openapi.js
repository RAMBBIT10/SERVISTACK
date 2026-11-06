const seguridad = [{ bearerAuth: [] }];

module.exports = {
  "/proyectos": {
    post: {
      summary: "Crear un proyecto de mantenimiento o montaje",
      tags: ["Proyectos"],
      security: seguridad,
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["nombre"],
              properties: { nombre: { type: "string" }, descripcion: { type: "string" } },
            },
          },
        },
      },
      responses: { 201: { description: "Proyecto creado" }, 400: { description: "El nombre es obligatorio" } },
    },
    get: {
      summary: "Listar proyectos, con filtro opcional por estado",
      tags: ["Proyectos"],
      security: seguridad,
      parameters: [{ in: "query", name: "estado", required: false, schema: { type: "string", example: "en_curso" } }],
      responses: { 200: { description: "Listado de proyectos" } },
    },
  },
};
