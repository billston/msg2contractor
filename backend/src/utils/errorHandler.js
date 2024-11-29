import { ValidationError } from 'sequelize';

export const handleError = (res, error) => {
  console.error(error);
  if (error.name === 'ZodError') {
    return res.status(400).json({ errors: error.errors });
  } else if (error instanceof ValidationError) {
    return res.status(400).json({ message: error.errors.map(e => e.message) });
  } else {
    return res.status(500).json({ message: 'Ocurrió un error en el servidor.', details: error.message });
  }
};