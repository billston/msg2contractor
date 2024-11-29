import { DataTypes } from 'sequelize';
import sequelize from '../config.js';

const GrupoReceptor = sequelize.define('GrupoReceptor', {
  idGrupoReceptor: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_grupo_receptor'
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
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
  tableName: 'grupo_receptor',
  timestamps: true,
  createdAt: 'fecha_creacion',
  updatedAt: 'fecha_actualizacion'
});

export default GrupoReceptor;