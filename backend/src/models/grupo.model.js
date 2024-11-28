import { query } from '../config/db.js';

export class GrupoModel {
  static async create({ nombre, usuario }) {
    const result = await query(
      `INSERT INTO GrupoReceptor (
        Nombre, FechaCreacion, CreadoPor
      ) VALUES ($1, CURRENT_TIMESTAMP, $2)
      RETURNING *`,
      [nombre, usuario]
    );
    return result.rows[0];
  }

  static async update(id, { nombre, usuario }) {
    const result = await query(
      `UPDATE GrupoReceptor SET
        Nombre = $1,
        FechaActualizacion = CURRENT_TIMESTAMP,
        ActualizadoPor = $2
      WHERE IdGrupoReceptor = $3
      RETURNING *`,
      [nombre, usuario, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await query(
      'DELETE FROM GrupoReceptor WHERE IdGrupoReceptor = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await query(
      'SELECT * FROM GrupoReceptor WHERE IdGrupoReceptor = $1',
      [id]
    );
    return result.rows[0];
  }

  static async findAll({ nombre, nombreMiembro }) {
    let sql = `
      SELECT DISTINCT g.*
      FROM GrupoReceptor g
      LEFT JOIN Miembro m ON g.IdGrupoReceptor = m.IdGrupoReceptor
      LEFT JOIN Receptor r ON m.IdReceptor = r.IdReceptor
      WHERE 1=1
    `;
    const params = [];

    if (nombre) {
      params.push(`%${nombre}%`);
      sql += ` AND g.Nombre ILIKE $${params.length}`;
    }

    if (nombreMiembro) {
      params.push(`%${nombreMiembro}%`);
      sql += ` AND r.NombreCompleto ILIKE $${params.length}`;
    }

    sql += ' ORDER BY g.Nombre';

    const result = await query(sql, params);
    return result.rows;
  }

  static async hasComunicados(id) {
    const result = await query(
      'SELECT 1 FROM Comunicado WHERE IdGrupoReceptor = $1 LIMIT 1',
      [id]
    );
    return result.rows.length > 0;
  }

  // Miembros methods
  static async addMiembro({ idGrupoReceptor, idReceptor, usuario }) {
    const result = await query(
      `INSERT INTO Miembro (
        IdGrupoReceptor, IdReceptor,
        FechaCreacion, CreadoPor
      ) VALUES ($1, $2, CURRENT_TIMESTAMP, $3)
      RETURNING *`,
      [idGrupoReceptor, idReceptor, usuario]
    );
    return result.rows[0];
  }

  static async removeMiembro(idGrupoReceptor, idReceptor) {
    const result = await query(
      'DELETE FROM Miembro WHERE IdGrupoReceptor = $1 AND IdReceptor = $2 RETURNING *',
      [idGrupoReceptor, idReceptor]
    );
    return result.rows[0];
  }

  static async getMiembros(idGrupoReceptor) {
    const result = await query(
      `SELECT r.* 
       FROM Receptor r
       INNER JOIN Miembro m ON r.IdReceptor = m.IdReceptor
       WHERE m.IdGrupoReceptor = $1
       ORDER BY r.NombreCompleto`,
      [idGrupoReceptor]
    );
    return result.rows;
  }

  static async isMiembro(idGrupoReceptor, idReceptor) {
    const result = await query(
      'SELECT 1 FROM Miembro WHERE IdGrupoReceptor = $1 AND IdReceptor = $2 LIMIT 1',
      [idGrupoReceptor, idReceptor]
    );
    return result.rows.length > 0;
  }
}