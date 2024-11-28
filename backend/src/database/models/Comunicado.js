import { DataTypes } from 'sequelize';
import sequelize from '../config.js';
import GrupoReceptor from './GrupoReceptor.js';

const Comunicado = sequelize.define('Comunicado', {
  idComunicado: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'idcomunicado'
  },
  tipoReceptor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'tiporeceptor'
  },
  idGrupoReceptor: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'idgruporeceptor',
    references: {
      model: GrupoReceptor,
      key: 'idgruporeceptor'
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
    field: 'fechaemision'
  },
  fechaVencimiento: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'fechavencimiento'
  },
  confirmacionRecepcion: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'confirmacionrecepcion'
  },
  solicitarRespuesta: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'solicitarrespuesta'
  },
  idEstadoComunicado: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    field: 'idestadocomunicado'
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
  tableName: 'comunicado',
  timestamps: true,
  createdAt: 'fechacreacion',
  updatedAt: 'fechaactualizacion'
});

// Define associations
Comunicado.belongsTo(GrupoReceptor, { foreignKey: 'idgruporeceptor' });

export default Comunicado;