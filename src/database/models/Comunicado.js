import { DataTypes } from 'sequelize';
import sequelize from '../config.js';
import GrupoReceptor from './GrupoReceptor.js';

const Comunicado = sequelize.define('Comunicado', {
  idComunicado: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_comunicado'
  },
  tipoReceptor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'tipo_receptor'
  },
  idGrupoReceptor: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'id_grupo_receptor',
    references: {
      model: GrupoReceptor,
      key: 'id_grupo_receptor'
    }
  },
  destinatario: {
    type: DataTypes.STRING,
    allowNull: true
  },
  asunto: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contenido: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  adjunto: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fechaEmision: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'fecha_emision'
  },
  fechaVencimiento: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'fecha_vencimiento'
  },
  confirmacionRecepcion: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'confirmacion_recepcion'
  },
  solicitarRespuesta: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'solicitar_respuesta'
  },
  idEstadoComunicado: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    field: 'id_estado_comunicado'
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
  tableName: 'comunicado',
  timestamps: true,
  createdAt: 'fecha_creacion',
  updatedAt: 'fecha_actualizacion'
});

// Define associations
Comunicado.belongsTo(GrupoReceptor, { foreignKey: 'id_grupo_receptor' });

export default Comunicado;