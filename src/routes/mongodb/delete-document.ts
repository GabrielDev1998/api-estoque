import express from 'express';
import mongodb from '../../mongodb/mongodb';

const router = express.Router();

router.delete('/', async (req, res) => {
  const { collectionName, dbName, id, nameModel } = req.query as {
    id: string;
    nameModel: string;
    collectionName: string;
    dbName: string;
  };

  if (!id || !collectionName || !collectionName || !dbName) {
    res.status(400).json({
      success: false,
      error:
        'Algumas dessas informações não foram fornecidas: id, nameModel, collectionName, dbName.',
    });
    return;
  }

  const { deleteDocument } = await mongodb(dbName, nameModel, collectionName);

  try {
    const result = await deleteDocument(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Ocorreu algum erro interno. Tente novamente mais tarde.',
    });
    return;
  }
});

export default router;
