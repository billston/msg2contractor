import { mkdir } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const saveFile = async (file, path) => {
  const fullPath = join(__dirname, '../../archivos', path);
  
  try {
    // Ensure directory exists
    await mkdir(dirname(fullPath), { recursive: true });
    
    // Move file to destination
    await file.mv(fullPath);
    
    return true;
  } catch (error) {
    console.error('Error saving file:', error);
    throw error;
  }
};

export const getFilePath = (path) => {
  return join(__dirname, '../../archivos', path);
};