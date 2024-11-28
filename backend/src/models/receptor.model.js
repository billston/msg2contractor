import { query } from '../config/db.js';

export class ReceptorModel {
  static async create({ codigo, nombreCompleto, correoElectronico, firma, usuario }) {
    const result = await query(
      `INSERT INTO Receptor (
        Codigo, NombreCompleto, CorreoElectronico, Firma,
        FechaCreacion, CreadoPor
      ) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, $5)
      RETURNING *`,
      [codigo, nombreCompleto, correoElectronico, firma, usuario]
    );
    return result.rows[0];
  }

  static async update(id, { codigo, nombreCompleto, correoElectronico, firma, usuario }) {
    const result = await query(
      `UPDATE Receptor SET
        Codigo = $1,
        NombreCompleto = $2,
        CorreoElectronico = $3,
        Firma = COALESCE($4, Firma),
        FechaActualizacion = CURRENT_TIMESTAMP,
        ActualizadoPor = $5
      WHERE IdReceptor = $6
      RETURNING *`,
      [codigo, nombreCompleto, correoElectronico, firma, usuario, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await query(
      'DELETE FROM Receptor WHERE IdReceptor = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await query(
      'SELECT * FROM Receptor WHERE IdReceptor = $1',
      [id]
    );
    return result.rows[0];
  }

  static async findAll({ codigo, nombreCompleto }) {
    let sql = 'SELECT * FROM Receptor WHERE 1=1';
    const params = [];

    if (codigo) {
      params.push(`%${codigo}%`);
      sql += ` AND Codigo ILIKE $${params.length}`;
    }

    if (nombreCompleto) {
      params.push(`%${nombreCompleto}%`);
      sql += ` AND NombreCompleto ILIKE $${params.length}`;
    }

    sql += ' ORDER BY NombreCompleto';

    const result = await query(sql, params);
    return result.rows;
  }

  static async hasNotifications(id) {
    const result = await query(
      'SELECT 1 FROM Notificacion WHERE IdReceptor = $1 LIMIT 1',
      [id]
    );
    return result.rows.length > 0;
  }
}