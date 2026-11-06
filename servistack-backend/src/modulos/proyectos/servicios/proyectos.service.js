const repositorio = require("../infraestructura/output/proyectos.repository");
const { ErrorNegocio } = require("../../../transversal/errores");
const { faltanCampos } = require("../../../transversal/validaciones");

async function crearProyecto(datos) {
  if (faltanCampos(datos, ["nombre"])) throw new ErrorNegocio("PROYECTO_NOMBRE_OBLIGATORIO", 400);
  return repositorio.crear(datos);
}

async function listarProyectos(estado) {
  return repositorio.listar(estado);
}

async function verificarQueExiste(id, cliente) {
  const proyecto = await repositorio.buscarPorId(id, cliente);
  if (!proyecto) throw new ErrorNegocio("PROYECTO_NO_ENCONTRADO", 422);
  return proyecto;
}

module.exports = { crearProyecto, listarProyectos, verificarQueExiste };
