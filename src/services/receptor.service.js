import { Op } from 'sequelize';
import { Receptor, Notificacion } from '../database/models/index.js';
import { saveFile } from '../utils/file.js';

export class ReceptorService {
  static async create({ codigo, nombreCompleto, correoElectronico, firma, usuario }) {
    const receptor = await Receptor.create({
      codigo,
      nombreCompleto,
      correoElectronico,
      firma: firma ? firma.name : '',
      creadoPor: usuario
    });
    
    if (firma) {
      await saveFile(
        firma,
        `receptor/firma/${receptor.idReceptor}/${firma.name}`
      );
    }

    return receptor;
  }

  static async update(id, { codigo, nombreCompleto, correoElectronico, firma, usuario }) {
    const receptor = await Receptor.findByPk(id);
    
    if (!receptor) {
      return null;
    }

    await receptor.update({
      codigo,
      nombreCompleto,
      correoElectronico,
      firma: firma ? firma.name : receptor.firma,
      actualizadoPor: usuario
    });

    if (firma) {
      await saveFile(
        firma,
        `receptor/firma/${receptor.idReceptor}/${firma.name}`
      );
    }

    return receptor;
  }

  static async delete(id) {
    const receptor = await Receptor.findByPk(id);
    
    if (!receptor) {
      return null;
    }

    await receptor.destroy();
    return receptor;
  }

  static async findById(id) {
    return Receptor.findByPk(id);
  }

  static async findAll({ search }) {
    const where = search?.trim() ? {
      [Op.or]: [
        { codigo: { [Op.iLike]: `%${search}%` } },
        { nombreCompleto: { [Op.iLike]: `%${search}%` } },
        { correoElectronico: { [Op.iLike]: `%${search}%` } }
      ]
    } : { [Op.or]: [] };

    return Receptor.findAll({
      ...(where[Op.or].length ? { where } : {}),
      order: [['nombreCompleto', 'ASC']]
    });
  }

  static async hasNotifications(id) {
    const notificaciones = await Notificacion.findAll({
      where: { idReceptor: id }
    });
    return notificaciones.length > 0;
  }
}