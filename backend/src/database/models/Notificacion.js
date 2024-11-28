import { DataTypes } from 'sequelize';
import sequelize from '../config.js';
import Comunicado from './Comunicado.js';
import Receptor from './Receptor.js';

const Notificacion = sequelize.define('Notificacion', {
  idNotificacion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'idnotificacion'
  },
  idComunicado: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'idcomunicado',
    references: {
      model: Comunicado,
      key: 'idcomunicado'
    }
  },
  idReceptor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'idreceptor',
    references: {
      model: Receptor,
      key: 'idreceptor'
    }
  },
  fechaEmision: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'fechaemision'
  },
  fechaRecepcion: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'fecharecepcion'
  },
  fechaRespuesta: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'fecharespuesta'
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
    field: 'idestadonotificacion'
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
  tableName: 'notificacion',
  timestamps: true,
  createdAt: 'fechacreacion',
  updatedAt: 'fechaactualizacion'
});

// Define associations
Notificacion.belongsTo(Comunicado, { foreignKey: 'idcomunicado' });
Notificacion.belongsTo(Receptor, { foreignKey: 'idreceptor' });

export default Notificacion;