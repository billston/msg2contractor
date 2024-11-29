import { DataTypes } from 'sequelize';
import sequelize from '../config.js';
import Comunicado from './Comunicado.js';
import Receptor from './Receptor.js';

const Notificacion = sequelize.define('Notificacion', {
  idNotificacion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_notificacion'
  },
  idComunicado: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_comunicado',
    references: {
      model: Comunicado,
      key: 'id_comunicado'
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
  fechaEmision: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'fecha_emision'
  },
  fechaRecepcion: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'fecha_recepcion'
  },
  fechaRespuesta: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'fecha_respuesta'
  },
  respuesta: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  adjunto: {
    type: DataTypes.STRING,
    allowNull: true
  },
  idEstadoNotificacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    field: 'id_estado_notificacion'
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
  tableName: 'notificacion',
  timestamps: true,
  createdAt: 'fecha_creacion',
  updatedAt: 'fecha_actualizacion'
});

// Define associations
Notificacion.belongsTo(Comunicado, { foreignKey: 'id_comunicado' });
Notificacion.belongsTo(Receptor, { foreignKey: 'id_receptor' });

export default Notificacion;