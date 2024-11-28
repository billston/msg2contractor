import { DataTypes } from 'sequelize';
import sequelize from '../config.js';

const Receptor = sequelize.define('Receptor', {
  idReceptor: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'idreceptor'
  },
  codigo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  nombreCompleto: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'nombrecompleto'
  },
  correoElectronico: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'correoelectronico'
  },
  firma: {
    type: DataTypes.STRING,
    allowNull: true
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
  tableName: 'receptor',
  timestamps: true,
  createdAt: 'fechacreacion',
  updatedAt: 'fechaactualizacion'
});

export default Receptor;