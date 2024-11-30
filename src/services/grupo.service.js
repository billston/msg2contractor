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

  static async findAll({ search }) {
    // Primero, buscar en el nombre del grupo
    const grupos = await GrupoReceptor.findAll({
      where: {
        nombre: { [Op.iLike]: `%${search}%` }
      },
      order: [['nombre', 'ASC']]
    });

    // Si no se encontraron grupos, buscar en el nombreCompleto del receptor
    if (grupos.length === 0) {
      return GrupoReceptor.findAll({
        include: [{
          model: Receptor,
          where: {
            nombreCompleto: { [Op.iLike]: `%${search}%` }
          },
          through: { attributes: [] }, // Asegúrate de que esto sea correcto según tu modelo
          required: true // Asegurarse de que se incluyan solo grupos con receptores
        }],
        order: [['nombre', 'ASC']]
      });
    }

    return grupos;
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
    const miembros = await Miembro.findAll({
      where: { idGrupoReceptor },
      include: [{
          model: Receptor,
          required: true
      }]
    });

    return miembros.map(miembro => miembro.Receptor);
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