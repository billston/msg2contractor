import { DataTypes } from 'sequelize';
import sequelize from '../config.js';
import GrupoReceptor from './GrupoReceptor.js';
import Receptor from './Receptor.js';

const Miembro = sequelize.define('Miembro', {
  idMiembro: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'idmiembro'
  },
  idGrupoReceptor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'idgruporeceptor',
    references: {
      model: GrupoReceptor,
      key: 'idgruporeceptor'
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
  tableName: 'miembro',
  timestamps: true,
  createdAt: 'fechacreacion',
  updatedAt: 'fechaactualizacion'
});

// Define associations
GrupoReceptor.belongsToMany(Receptor, { through: Miembro, foreignKey: 'idgruporeceptor' });
Receptor.belongsToMany(GrupoReceptor, { through: Miembro, foreignKey: 'idreceptor' });

export default Miembro;