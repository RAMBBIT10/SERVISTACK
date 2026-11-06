const seguridad = [{ bearerAuth: [] }];

module.exports = {
  "/empleados": {
    post: {
      summary: "Crear una cuenta de empleado, solo Administrador",
      tags: ["Empleados"],
      security: seguridad,
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["nombre", "correo", "tipoEmpleado"],
              properties: {
                nombre: { type: "string" },
                correo: { type: "string" },
                tipoEmpleado: { type: "string", enum: ["Administrador", "Empleado"] },
              },
            },
          },
        },
      },
      responses: { 201: { description: "Empleado creado" }, 403: { description: "Requiere permisos de Administrador" } },
    },
    get: {
      summary: "Listar empleados",
      tags: ["Empleados"],
      security: seguridad,
      responses: { 200: { description: "Listado de empleados" } },
    },
  },
  "/empleados/{id}": {
    delete: {
      summary: "Eliminar una cuenta de empleado, solo Administrador",
      tags: ["Empleados"],
      security: seguridad,
      parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }],
      responses: { 204: { description: "Empleado eliminado" }, 403: { description: "Requiere permisos de Administrador" } },
    },
  },
};
