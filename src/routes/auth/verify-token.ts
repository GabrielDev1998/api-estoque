import express from 'express';
import authFireBase from '../../firebase/auth/admin/auth';

const router = express.Router();

const { verifyToken } = authFireBase();

router.get('/', async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ success: false, error: 'Token não fornecido.' });
    return;
  }

  try {
    const token = authHeader.split('Bearer ')[1];
    const result = await verifyToken(token);
    res.status(200).json({ success: true, user: result });
  } catch (err) {
    console.error('Token inválido:', err);
    res
      .status(401)
      .json({ success: false, error: 'Token inválido ou expirado.' });
    return;
  }
});

export default router;
