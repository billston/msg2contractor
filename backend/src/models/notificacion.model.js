import { query, pool } from '../config/db.js';

export class NotificacionModel {
  static async findById(id) {
    const result = await query(
      `SELECT n.*, c.*, r.*
       FROM Notificacion n
       INNER JOIN Comunicado c ON n.IdComunicado = c.IdComunicado
       INNER JOIN Receptor r ON n.IdReceptor = r.IdReceptor
       WHERE n.IdNotificacion = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async findAll({
    fechaEmisionInicio,
    fechaEmisionFin,
    fechaRecepcion,
    fechaRespuesta,
    asuntoComunicado,
    nombreReceptor,
  }) {
    let sql = `
      SELECT n.*, c.Asunto, r.NombreCompleto
      FROM Notificacion n
      INNER JOIN Comunicado c ON n.IdComunicado = c.IdComunicado
      INNER JOIN Receptor r ON n.IdReceptor = r.IdReceptor
      WHERE n.FechaEmision >= $1 AND n.FechaEmision <= $2
    `;
    const params = [fechaEmisionInicio, fechaEmisionFin];

    if (fechaRecepcion) {
      params.push(fechaRecepcion);
      sql += ` AND DATE(n.FechaRecepcion) = $${params.length}`;
    }

    if (fechaRespuesta) {
      params.push(fechaRespuesta);
      sql += ` AND DATE(n.FechaRespuesta) = $${params.length}`;
    }

    if (asuntoComunicado) {
      params.push(`%${asuntoComunicado}%`);
      sql += ` AND c.Asunto ILIKE $${params.length}`;
    }

    if (nombreReceptor) {
      params.push(`%${nombreReceptor}%`);
      sql += ` AND r.NombreCompleto ILIKE $${params.length}`;
    }

    sql += ' ORDER BY n.FechaEmision DESC';

    const result = await query(sql, params);
    return result.rows;
  }

  static async confirmarRecepcion(id, usuario) {
    const result = await query(
      `UPDATE Notificacion SET
        FechaRecepcion = CURRENT_TIMESTAMP,
        IdEstadoNotificacion = 2,
        FechaActualizacion = CURRENT_TIMESTAMP,
        ActualizadoPor = $1
      WHERE IdNotificacion = $2 AND IdEstadoNotificacion = 1
      RETURNING *`,
      [usuario, id]
    );
    return result.rows[0];
  }

  static async responder(id, { respuesta, adjunto, usuario }) {
    const result = await query(
      `UPDATE Notificacion SET
        FechaRespuesta = CURRENT_TIMESTAMP,
        Respuesta = $1,
        Adjunto = COALESCE($2, Adjunto),
        IdEstadoNotificacion = 3,
        FechaActualizacion = CURRENT_TIMESTAMP,
        ActualizadoPor = $3
      WHERE IdNotificacion = $4 AND IdEstadoNotificacion = 2
      RETURNING *`,
      [respuesta, adjunto, usuario, id]
    );
    return result.rows[0];
  }
}