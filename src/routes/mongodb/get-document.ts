import express from 'express';
import mongodb from '../../mongodb/mongodb';

const router = express.Router();

router.get('/all', async (req, res) => {
  const { collectionName, dbName, nameModel } = req.query as {
    dbName: string;
    nameModel: string;
    collectionName: string;
  };

  if (!dbName || !nameModel || !collectionName) {
    res.status(400).json({
      success: false,
      error:
        'Algumas dessas informações não foram fornecidas: dbName, nameModel e collectionName.',
    });
    return;
  }

  try {
    const { getAllDocument } = await mongodb(dbName, nameModel, collectionName);
    const result = await getAllDocument();
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: (error as Error).message,
    });
  }
});

router.get('/', async (req, res) => {
  const { collectionName, dbName, id, nameModel } = req.query as {
    id: string;
    dbName: string;
    collectionName: string;
    nameModel: string;
  };

  if (!dbName || !id || !collectionName || !nameModel) {
    res.status(400).json({
      success: false,
      error:
        'Algumas dessas informações não foram fornecidas: dbName, id, nameModel e collectionName.',
    });
    return;
  }

  try {
    const { getDocumentById } = await mongodb(
      dbName,
      nameModel,
      collectionName,
    );
    const result = await getDocumentById(id);
    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: (err as Error).message,
    });
  }
});

export default router;
