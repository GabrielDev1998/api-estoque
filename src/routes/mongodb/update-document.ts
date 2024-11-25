import express from 'express';
import mongodb from '../../mongodb/mongodb';
import mongoose from 'mongoose';

const router = express.Router();

router.put('/', async (req, res) => {
  const query = req.query as { id: string };
  const { dbName, nameModel, schema, collectionName, data } = req.body;

  if (!dbName || !nameModel || !schema || !collectionName || !data) {
    res.status(400).json({
      success: false,
      error:
        'Algumas dessas informações não foram fornecidas: dbName, nameModel, schema, collectionName, data',
    });
    return;
  }
});

export default router;
