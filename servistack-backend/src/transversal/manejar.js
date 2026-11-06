function manejar(funcion) {
  return (req, res, next) => Promise.resolve(funcion(req, res, next)).catch(next);
}

module.exports = { manejar };
