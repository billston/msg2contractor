import { DataTypes } from 'sequelize';
import sequelize from '../config.js';
import GrupoReceptor from './GrupoReceptor.js';
import Receptor from './Receptor.js';

const Miembro = sequelize.define('Miembro', {
  idMiembro: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_miembro'
  },
  idGrupoReceptor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_grupo_receptor',
    references: {
      model: GrupoReceptor,
      key: 'id_grupo_receptor'
    }
  },
  idReceptor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_receptor',
    references: {
      model: Receptor,
      key: 'id_receptor'
    }
  },
  creadoPor: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'creado_por'
  },
  actualizadoPor: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'actualizado_por'
  }
}, {
  tableName: 'miembro',
  timestamps: true,
  createdAt: 'fecha_creacion',
  updatedAt: 'fecha_actualizacion'
});

export default Miembro;