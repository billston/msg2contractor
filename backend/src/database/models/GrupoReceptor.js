import { DataTypes } from 'sequelize';
import sequelize from '../config.js';

const GrupoReceptor = sequelize.define('GrupoReceptor', {
  idGrupoReceptor: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'idgruporeceptor'
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  creadoPor: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'creadopor'
  },
  actualizadoPor: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'actualizadopor'
  }
}, {
  tableName: 'gruporeceptor',
  timestamps: true,
  createdAt: 'fechacreacion',
  updatedAt: 'fechaactualizacion'
});

export default GrupoReceptor;