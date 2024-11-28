import { config } from 'dotenv';
import sequelize from './config.js';
import './models/index.js';

config();

const migrate = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error synchronizing database:', error);
    process.exit(1);
  }
};

migrate();