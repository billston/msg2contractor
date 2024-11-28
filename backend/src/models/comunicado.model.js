import { query } from '../config/db.js';

export class ComunicadoModel {
  static async create({
    tipoReceptor,
    idGrupoReceptor,
    destinatario,
    asunto,
    contenido,
    adjunto,
    fechaVencimiento,
    confirmacionRecepcion,
    solicitarRespuesta,
    usuario,
  }) {
    const result = await query(
      `INSERT INTO Comunicado (
        TipoReceptor, IdGrupoReceptor, Destinatario,
        Asunto, Contenido, Adjunto,
        FechaVencimiento, ConfirmacionRecepcion, SolicitarRespuesta,
        IdEstadoComunicado, FechaCreacion, CreadoPor
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 1, CURRENT_TIMESTAMP, $10)
      RETURNING *`,
      [
        tipoReceptor,
        idGrupoReceptor,
        destinatario,
        asunto,
        contenido,
        adjunto,
        fechaVencimiento,
        confirmacionRecepcion,
        solicitarRespuesta,
        usuario,
      ]
    );
    return result.rows[0];
  }

  static async update(id, {
    tipoReceptor,
    idGrupoReceptor,
    destinatario,
    asunto,
    contenido,
    adjunto,
    fechaVencimiento,
    confirmacionRecepcion,
    solicitarRespuesta,
    usuario,
  }) {
    const result = await query(
      `UPDATE Comunicado SET
        TipoReceptor = $1,
        IdGrupoReceptor = $2,
        Destinatario = $3,
        Asunto = $4,
        Contenido = $5,
        Adjunto = COALESCE($6, Adjunto),
        FechaVencimiento = $7,
        ConfirmacionRecepcion = $8,
        SolicitarRespuesta = $9,
        FechaActualizacion = CURRENT_TIMESTAMP,
        ActualizadoPor = $10
      WHERE IdComunicado = $11 AND IdEstadoComunicado = 1
      RETURNING *`,
      [
        tipoReceptor,
        idGrupoReceptor,
        destinatario,
        asunto,
        contenido,
        adjunto,
        fechaVencimiento,
        confirmacionRecepcion,
        solicitarRespuesta,
        usuario,
        id,
      ]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await query(
      'SELECT * FROM Comunicado WHERE IdComunicado = $1',
      [id]
    );
    return result.rows[0];
  }

  static async findAll({ fechaEmisionInicio, fechaEmisionFin, tipoReceptor, estado }) {
    let sql = 'SELECT * FROM Comunicado WHERE 1=1';
    const params = [];

    if (fechaEmisionInicio) {
      params.push(fechaEmisionInicio);
      sql += ` AND FechaEmision >= $${params.length}`;
    }

    if (fechaEmisionFin) {
      params.push(fechaEmisionFin);
      sql += ` AND FechaEmision <= $${params.length}`;
    }

    if (tipoReceptor) {
      params.push(tipoReceptor);
      sql += ` AND TipoReceptor = $${params.length}`;
    }

    if (estado) {
      params.push(estado);
      sql += ` AND IdEstadoComunicado = $${params.length}`;
    }

    sql += ' ORDER BY FechaCreacion DESC';

    const result = await query(sql, params);
    return result.rows;
  }

  static async confirmar(id, usuario) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Update comunicado
      const comunicadoResult = await client.query(
        `UPDATE Comunicado SET
          IdEstadoComunicado = 2,
          FechaEmision = CURRENT_TIMESTAMP,
          FechaActualizacion = CURRENT_TIMESTAMP,
          ActualizadoPor = $1
        WHERE IdComunicado = $2 AND IdEstadoComunicado = 1
        RETURNING *`,
        [usuario, id]
      );

      const comunicado = comunicadoResult.rows[0];
      if (!comunicado) {
        throw new Error('Comunicado no encontrado o ya confirmado');
      }

      // Generate notifications
      if (comunicado.tiporeceptor === 1) {
        // Individual recipients
        const receptores = comunicado.destinatario.split(';').filter(Boolean);
        for (const idReceptor of receptores) {
          await client.query(
            `INSERT INTO Notificacion (
              IdComunicado, IdReceptor,
              FechaEmision, IdEstadoNotificacion,
              FechaCreacion, CreadoPor
            ) VALUES ($1, $2, CURRENT_TIMESTAMP, 1, CURRENT_TIMESTAMP, $3)`,
            [comunicado.idcomunicado, parseInt(idReceptor), usuario]
          );
        }
      } else {
        // Group recipients
        const miembrosResult = await client.query(
          'SELECT IdReceptor FROM Miembro WHERE IdGrupoReceptor = $1',
          [comunicado.idgruporeceptor]
        );

        for (const { idreceptor } of miembrosResult.rows) {
          await client.query(
            `INSERT INTO Notificacion (
              IdComunicado, IdReceptor,
              FechaEmision, IdEstadoNotificacion,
              FechaCreacion, CreadoPor
            ) VALUES ($1, $2, CURRENT_TIMESTAMP, 1, CURRENT_TIMESTAMP, $3)`,
            [comunicado.idcomunicado, idreceptor, usuario]
          );
        }
      }

      await client.query('COMMIT');
      return comunicado;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}