const admin = require("firebase-admin");
const { protegido } = require("./circuito");

let inicializado = false;

function inicializarFCM() {
  if (inicializado) return;
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
    }),
  });
  inicializado = true;
}

async function enviarMensaje(topico, titulo, cuerpo) {
  inicializarFCM();
  return admin.messaging().send({
    topic: topico,
    notification: { title: titulo, body: cuerpo },
  });
}

const circuitoFCM = protegido("firebase-cloud-messaging", enviarMensaje);

async function enviarAlTopico(topico, titulo, cuerpo) {
  return circuitoFCM.fire(topico, titulo, cuerpo);
}

module.exports = { enviarAlTopico };
