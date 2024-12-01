CREATE TABLE receptor (
    id_receptor SERIAL PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL,
    nombre_completo VARCHAR(200) NOT NULL,
    correo_electronico VARCHAR(100) NOT NULL,
    firma VARCHAR(100),
    fecha_creacion TIMESTAMP NOT NULL,
    creado_por VARCHAR(50) NOT NULL,
    fecha_actualizacion TIMESTAMP,
    actualizado_por VARCHAR(50)
);

CREATE TABLE grupo_receptor (
    id_grupo_receptor SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL,
    creado_por VARCHAR(50) NOT NULL,
    fecha_actualizacion TIMESTAMP,
    actualizado_por VARCHAR(50)
);

CREATE TABLE miembro (
    id_miembro SERIAL PRIMARY KEY,
    id_grupo_receptor INT NOT NULL,
    id_receptor INT NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL,
    creado_por VARCHAR(50) NOT NULL,
    fecha_actualizacion TIMESTAMP,
    actualizado_por VARCHAR(50),
    CONSTRAINT fk_grupo_receptor FOREIGN KEY (id_grupo_receptor) REFERENCES grupo_receptor(id_grupo_receptor),
    CONSTRAINT fk_receptor FOREIGN KEY (id_receptor) REFERENCES receptor(id_receptor)
);

CREATE TABLE estado_comunicado (
    id_estado_comunicado INT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL,
    creado_por VARCHAR(50) NOT NULL,
    fecha_actualizacion TIMESTAMP,
    actualizado_por VARCHAR(50)
);

CREATE TABLE comunicado (
    id_comunicado SERIAL PRIMARY KEY,
    tipo_receptor INT NOT NULL, -- 1: individual, 2: grupo
    id_grupo_receptor INT,
    destinatario VARCHAR(1000) NOT NULL, -- Para receptor individual
    asunto VARCHAR(500) NOT NULL,
    contenido TEXT NOT NULL,
    adjunto VARCHAR(200),
    fecha_emision TIMESTAMP,
    fecha_vencimiento DATE,
    confirmacion_recepcion BOOLEAN NOT NULL,
    solicitar_respuesta BOOLEAN NOT NULL,
    id_estado_comunicado INT NOT NULL, -- 1: borrador, 2: confirmado
    fecha_creacion TIMESTAMP NOT NULL,
    creado_por VARCHAR(50) NOT NULL,
    fecha_actualizacion TIMESTAMP,
    actualizado_por VARCHAR(50),
    CONSTRAINT fk_grupo_receptor_comunicado FOREIGN KEY (id_grupo_receptor) REFERENCES grupo_receptor(id_grupo_receptor),
    CONSTRAINT fk_estado_comunicado_comunicado FOREIGN KEY (id_estado_comunicado) REFERENCES estado_comunicado(id_estado_comunicado)
);
--ALTER TABLE comunicado ALTER COLUMN fecha_vencimiento TYPE DATE USING fecha_vencimiento::DATE;

CREATE TABLE estado_notificacion (
    id_estado_notificacion INT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL,
    creado_por VARCHAR(50) NOT NULL,
    fecha_actualizacion TIMESTAMP,
    actualizado_por VARCHAR(50)
);

CREATE TABLE notificacion (
    id_notificacion SERIAL PRIMARY KEY,
    id_comunicado INT NOT NULL,
    id_receptor INT NOT NULL,
    fecha_emision TIMESTAMP NOT NULL,
    fecha_recepcion TIMESTAMP,
    fecha_respuesta TIMESTAMP,
    respuesta TEXT,
    adjunto VARCHAR(200),
    id_estado_notificacion INT NOT NULL, -- 1: emitido, 2: recibido, 3: respondido
    fecha_creacion TIMESTAMP NOT NULL,
    creado_por VARCHAR(50) NOT NULL,
    fecha_actualizacion TIMESTAMP,
    actualizado_por VARCHAR(50),
    CONSTRAINT fk_comunicado FOREIGN KEY (id_comunicado) REFERENCES comunicado(id_comunicado),
    CONSTRAINT fk_receptor_notificacion FOREIGN KEY (id_receptor) REFERENCES receptor(id_receptor),
    CONSTRAINT fk_estado_notificacion_notificacion FOREIGN KEY (id_estado_notificacion) REFERENCES estado_notificacion(id_estado_notificacion)
);


--Data
insert into estado_comunicado (id_estado_comunicado, nombre, fecha_creacion, creado_por)
values 	(1, 'Borrador', CURRENT_TIMESTAMP, 'sa'),
		(2, 'Confirmado', CURRENT_TIMESTAMP, 'sa')
		
insert into estado_notificacion (id_estado_notificacion, nombre, fecha_creacion, creado_por)
values 	(1, 'Emitido', CURRENT_TIMESTAMP, 'sa'),
		(2, 'Recibido', CURRENT_TIMESTAMP, 'sa'),
		(3, 'Respondido', CURRENT_TIMESTAMP, 'sa')

