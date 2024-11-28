import { Op } from 'sequelize';
import { GrupoReceptor, Receptor, Miembro, Comunicado } from '../database/models/index.js';

export class GrupoService {
  static async create({ nombre, usuario }) {
    return GrupoReceptor.create({
      nombre,
      creadoPor: usuario
    });
  }

  static async update(id, { nombre, usuario }) {
    const grupo = await GrupoReceptor.findByPk(id);
    
    if (!grupo) {
      return null;
    }

    await grupo.update({
      nombre,
      actualizadoPor: usuario
    });

    return grupo;
  }

  static async delete(id) {
    const grupo = await GrupoReceptor.findByPk(id);
    
    if (!grupo) {
      return null;
    }

    await grupo.destroy();
    return grupo;
  }

  static async findById(id) {
    return GrupoReceptor.findByPk(id);
  }

  static async findAll({ nombre, nombreMiembro }) {
    const include = [];
    const where = {};

    if (nombre) {
      where.nombre = { [Op.iLike]: `%${nombre}%` };
    }

    if (nombreMiembro) {
      include.push({
        model: Receptor,
        where: {
          nombreCompleto: { [Op.iLike]: `%${nombreMiembro}%` }
        },
        through: { attributes: [] }
      });
    }

    return GrupoReceptor.findAll({
      where,
      include,
      order: [['nombre', 'ASC']]
    });
  }

  static async hasComunicados(id) {
    const count = await Comunicado.count({
      where: { idGrupoReceptor: id }
    });
    return count > 0;
  }

  static async addMiembro({ idGrupoReceptor, idReceptor, usuario }) {
    return Miembro.create({
      idGrupoReceptor,
      idReceptor,
      creadoPor: usuario
    });
  }

  static async removeMiembro(idGrupoReceptor, idReceptor) {
    const miembro = await Miembro.findOne({
      where: {
        idGrupoReceptor,
        idReceptor
      }
    });

    if (!miembro) {
      return null;
    }

    await miembro.destroy();
    return miembro;
  }

  static async getMiembros(idGrupoReceptor) {
    const grupo = await GrupoReceptor.findByPk(idGrupoReceptor, {
      include: [{
        model: Receptor,
        through: { attributes: [] }
      }]
    });

    return grupo?.Receptores || [];
  }

  static async isMiembro(idGrupoReceptor, idReceptor) {
    const count = await Miembro.count({
      where: {
        idGrupoReceptor,
        idReceptor
      }
    });
    return count > 0;
  }
}