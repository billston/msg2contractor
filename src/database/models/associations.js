// src/database/models/associations.js
import Miembro from './Miembro.js';
import GrupoReceptor from './GrupoReceptor.js';
import Receptor from './Receptor.js';

// Definir las relaciones
Miembro.belongsTo(GrupoReceptor, { foreignKey: 'id_grupo_receptor' });
Miembro.belongsTo(Receptor, { foreignKey: 'id_receptor' });

GrupoReceptor.hasMany(Miembro, { foreignKey: 'id_grupo_receptor' });
Receptor.hasMany(Miembro, { foreignKey: 'id_receptor' });

// Definición de la relación muchos a muchos (si es necesario)
GrupoReceptor.belongsToMany(Receptor, {
    through: Miembro,
    foreignKey: 'id_grupo_receptor',
    otherKey: 'id_receptor'
  });
  
  Receptor.belongsToMany(GrupoReceptor, {
    through: Miembro,
    foreignKey: 'id_receptor',
    otherKey: 'id_grupo_receptor'
  });
  
  // Asegúrate de que las asociaciones estén sincronizadas
  export const initAssociations = () => {
    GrupoReceptor.sync();
    Receptor.sync();
    Miembro.sync();
  };