CREATE SCHEMA IF NOT EXISTS empleados;
CREATE SCHEMA IF NOT EXISTS productos;
CREATE SCHEMA IF NOT EXISTS pedidos;
CREATE SCHEMA IF NOT EXISTS entradas;
CREATE SCHEMA IF NOT EXISTS proyectos;
CREATE SCHEMA IF NOT EXISTS salidas;
CREATE SCHEMA IF NOT EXISTS notificaciones;
CREATE SCHEMA IF NOT EXISTS compartido;

SET search_path TO empleados, productos, pedidos, entradas, proyectos, salidas, notificaciones, compartido, public;

CREATE TABLE empleados.empleado (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(150) UNIQUE NOT NULL,
  tipo_empleado VARCHAR(20) NOT NULL CHECK (tipo_empleado IN ('Administrador', 'Empleado'))
);

CREATE TABLE productos.categoria (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(80) NOT NULL
);

CREATE TABLE productos.producto (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  categoria VARCHAR(80),
  codigo VARCHAR(80) UNIQUE NOT NULL,
  cantidad_minima INT NOT NULL DEFAULT 0,
  stock_actual INT NOT NULL DEFAULT 0,
  foto_clave VARCHAR(200)
);

CREATE TABLE productos.enlace_corto (
  codigo VARCHAR(20) PRIMARY KEY,
  producto_id INT NOT NULL UNIQUE REFERENCES productos.producto(id) ON DELETE CASCADE
);

CREATE TABLE pedidos.pedido (
  id SERIAL PRIMARY KEY,
  proveedor VARCHAR(100) NOT NULL,
  estado VARCHAR(30) NOT NULL DEFAULT 'creado'
);

CREATE TABLE entradas.entrada (
  id SERIAL PRIMARY KEY,
  pedido_id INT NOT NULL REFERENCES pedido(id),
  producto_id INT NOT NULL REFERENCES producto(id),
  cantidad INT NOT NULL CHECK (cantidad > 0),
  estado VARCHAR(30) NOT NULL DEFAULT 'completada',
  creado_en TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE proyectos.proyecto (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  descripcion TEXT,
  estado VARCHAR(30) NOT NULL DEFAULT 'en_curso'
);

CREATE TABLE salidas.salida (
  id SERIAL PRIMARY KEY,
  proyecto_id INT NOT NULL REFERENCES proyecto(id),
  producto_id INT NOT NULL REFERENCES producto(id),
  cantidad INT NOT NULL CHECK (cantidad > 0),
  estado VARCHAR(30) NOT NULL DEFAULT 'completada',
  creado_en TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE notificaciones.tipo_notificacion (
  codigo VARCHAR(30) PRIMARY KEY,
  descripcion VARCHAR(120) NOT NULL
);

INSERT INTO notificaciones.tipo_notificacion (codigo, descripcion) VALUES
  ('stock_bajo', 'Un producto quedó por debajo de su cantidad mínima'),
  ('pedido_creado', 'Se creó un pedido nuevo'),
  ('pedido_estado', 'Un pedido cambió de estado')
ON CONFLICT (codigo) DO NOTHING;

CREATE TABLE compartido.parametro (
  clave VARCHAR(60) PRIMARY KEY,
  valor VARCHAR(200) NOT NULL,
  descripcion VARCHAR(200)
);

INSERT INTO compartido.parametro (clave, valor, descripcion) VALUES
  ('qr_ancho', '300', 'Ancho en píxeles de la imagen del código QR')
ON CONFLICT (clave) DO NOTHING;

CREATE TABLE notificaciones.notificacion (
  id SERIAL PRIMARY KEY,
  tipo VARCHAR(30) NOT NULL REFERENCES tipo_notificacion(codigo),
  producto_id INT REFERENCES producto(id),
  mensaje TEXT NOT NULL,
  leida BOOLEAN NOT NULL DEFAULT false,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE compartido.mensaje (
  codigo VARCHAR(60) PRIMARY KEY,
  texto TEXT NOT NULL
);

INSERT INTO compartido.mensaje (codigo, texto) VALUES
  ('ENLACE_NO_ENCONTRADO', 'Ese enlace no existe o ya no es válido.'),
  ('TIPO_IMAGEN_INVALIDO', 'La foto debe ser una imagen JPG, PNG o WEBP.'),
  ('FOTO_CLAVE_OBLIGATORIA', 'Falta la clave de la foto subida.'),
  ('DATOS_PRODUCTO_INCOMPLETOS', 'Faltan datos obligatorios del producto: nombre, categoría y código.'),
  ('PRODUCTO_NO_ENCONTRADO', 'No encontramos ese producto.'),
  ('DATOS_EMPLEADO_INCOMPLETOS', 'Faltan datos obligatorios del empleado: nombre, correo y tipo de empleado.'),
  ('TIPO_EMPLEADO_INVALIDO', 'El tipo de empleado debe ser Administrador o Empleado.'),
  ('PROVEEDOR_OBLIGATORIO', 'El proveedor es obligatorio para crear un pedido.'),
  ('PEDIDO_NO_ENCONTRADO', 'El pedido indicado no existe.'),
  ('PROYECTO_NOMBRE_OBLIGATORIO', 'El nombre del proyecto es obligatorio.'),
  ('PROYECTO_NO_ENCONTRADO', 'El proyecto indicado no existe.'),
  ('DATOS_MOVIMIENTO_INVALIDOS', 'Revisa los datos del movimiento: el producto y la cantidad deben ser válidos.'),
  ('STOCK_INSUFICIENTE', 'No hay stock suficiente para esta salida. Disponible: {disponible}.'),
  ('NOTIFICACION_NO_ENCONTRADA', 'No encontramos esa notificación.'),
  ('ADMIN_REQUERIDO', 'Esta acción requiere permisos de Administrador.'),
  ('FECHA_FORMATO_INVALIDO', 'La fecha debe venir en formato ISO 8601 con zona, por ejemplo 2026-10-14T21:51:00Z.'),
  ('RUTA_NO_ENCONTRADA', 'Esa ruta no existe.'),
  ('ERROR_INTERNO', 'Algo salió mal de nuestro lado. Intenta de nuevo en unos minutos.'),
  ('STOCK_BAJO_NOTIFICACION', 'El producto {nombre} quedó por debajo del stock mínimo.'),
  ('STOCK_BAJO_PUSH_TITULO', 'Stock bajo'),
  ('STOCK_BAJO_PUSH_CUERPO', '{nombre} tiene {stock} unidades, por debajo del mínimo.')
ON CONFLICT (codigo) DO NOTHING;

CREATE VIEW productos.v_producto_disponible AS
  SELECT id, nombre, codigo, stock_actual, cantidad_minima
  FROM productos.producto;

CREATE VIEW salidas.v_materiales_por_proyecto AS
  SELECT s.proyecto_id, s.producto_id, p.nombre, SUM(s.cantidad) AS cantidad
  FROM salidas.salida s
  JOIN productos.v_producto_disponible p ON p.id = s.producto_id
  GROUP BY s.proyecto_id, s.producto_id, p.nombre;

ALTER DATABASE servistack SET search_path TO empleados, productos, pedidos, entradas, proyectos, salidas, notificaciones, compartido, public;
