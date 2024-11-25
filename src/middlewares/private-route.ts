import { RequestHandler } from 'express';
import authFireBase from '../firebase/auth/admin/auth';

const privateRoute: RequestHandler = async (req, res, next) => {
  const authorization = req.headers.authorization;
  const token = authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ success: false, error: 'Token não fornecido' });
    return;
  }

  try {
    const { verifyToken } = authFireBase();
    await verifyToken(token);
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ valid: false, error: 'Token inválido ou expirado' });
    return;
  }
};

export { privateRoute };
