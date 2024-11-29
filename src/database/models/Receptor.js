import { DataTypes } from 'sequelize';
import sequelize from '../config.js';

const Receptor = sequelize.define('Receptor', {
  idReceptor: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_receptor'
  },
  codigo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  nombreCompleto: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'nombre_completo'
  },
  correoElectronico: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'correo_electronico'
  },
  firma: {
    type: DataTypes.STRING,
    allowNull: true
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
  tableName: 'receptor',
  timestamps: true,
  createdAt: 'fecha_creacion',
  updatedAt: 'fecha_actualizacion'
});

export default Receptor;