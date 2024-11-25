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

  try {
    const { deleteDocumentById } = await mongodb(
      dbName,
      nameModel,
      collectionName,
    );
    const deletedDoc = await deleteDocumentById(id);
    res.status(200).json(deletedDoc);
  } catch (err) {
    res.status(500).json({
      success: false,
      error: (err as Error).message,
    });
  }
});

export default router;
