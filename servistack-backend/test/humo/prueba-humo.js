const direccionBase = process.env.HUMO_URL_BASE;
const rutaSalud = process.env.HUMO_RUTA_SALUD || "/salud";
const rutaProtegida = process.env.HUMO_RUTA_PROTEGIDA || "/productos/1";

if (!direccionBase) {
  console.error("Falta la variable HUMO_URL_BASE, por ejemplo http://localhost:8000/api");
  process.exit(1);
}

const resultados = [];

async function revisar(nombre, ruta, estadoEsperado) {
  try {
    const respuesta = await fetch(direccionBase + ruta);
    const paso = respuesta.status === estadoEsperado;
    resultados.push({ nombre, paso, detalle: `esperado ${estadoEsperado}, recibido ${respuesta.status}` });
  } catch (error) {
    resultados.push({ nombre, paso: false, detalle: error.message });
  }
}

async function main() {
  await revisar("El servicio esta vivo", rutaSalud, 200);
  await revisar("Una ruta protegida rechaza peticiones sin token", rutaProtegida, 401);
  await revisar("Una ruta inexistente responde 404", "/ruta-que-no-existe", 404);

  resultados.forEach((r) => console.log(`${r.paso ? "OK   " : "FALLO"} ${r.nombre} (${r.detalle})`));
  const fallos = resultados.filter((r) => !r.paso).length;
  console.log(fallos === 0 ? "Prueba de humo exitosa" : `Prueba de humo fallida: ${fallos} problema(s)`);
  process.exit(fallos === 0 ? 0 : 1);
}

main();
