function faltanCampos(objeto, campos) {
  return campos.some((campo) => objeto[campo] === undefined || objeto[campo] === null || objeto[campo] === "");
}

function esEnteroPositivo(valor) {
  return Number.isInteger(Number(valor)) && Number(valor) > 0;
}

module.exports = { faltanCampos, esEnteroPositivo };
