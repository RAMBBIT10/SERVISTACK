const repositorio = require("../infraestructura/output/empleados.repository");
const { ErrorNegocio } = require("../../../transversal/errores");
const { faltanCampos } = require("../../../transversal/validaciones");
const { TIPO_EMPLEADO } = require("../../../transversal/estados");

async function crearEmpleado(datos) {
  if (faltanCampos(datos, ["nombre", "correo", "tipoEmpleado"])) {
    throw new ErrorNegocio("DATOS_EMPLEADO_INCOMPLETOS", 400);
  }
  if (!Object.values(TIPO_EMPLEADO).includes(datos.tipoEmpleado)) {
    throw new ErrorNegocio("TIPO_EMPLEADO_INVALIDO", 400);
  }
  return repositorio.crear(datos);
}

async function listarEmpleados() {
  return repositorio.listar();
}

async function eliminarEmpleado(id) {
  await repositorio.eliminar(id);
}

module.exports = { crearEmpleado, listarEmpleados, eliminarEmpleado };
