const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { configuracion } = require("./configuracion");

let cliente = null;

function obtenerCliente() {
  if (!cliente) {
    cliente = new S3Client({
      region: "auto",
      endpoint: configuracion.almacenamiento.endpoint,
      credentials: {
        accessKeyId: configuracion.almacenamiento.accessKeyId,
        secretAccessKey: configuracion.almacenamiento.secretAccessKey,
      },
    });
  }
  return cliente;
}

async function urlDeSubida(clave, tipoContenido) {
  const comando = new PutObjectCommand({
    Bucket: configuracion.almacenamiento.bucket,
    Key: clave,
    ContentType: tipoContenido,
  });
  return getSignedUrl(obtenerCliente(), comando, { expiresIn: configuracion.almacenamiento.segundosUrl });
}

async function urlDeLectura(clave) {
  const comando = new GetObjectCommand({ Bucket: configuracion.almacenamiento.bucket, Key: clave });
  return getSignedUrl(obtenerCliente(), comando, { expiresIn: configuracion.almacenamiento.segundosUrl });
}

module.exports = { urlDeSubida, urlDeLectura };
