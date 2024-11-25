import express from 'express';
import mongodb from '../../mongodb/mongodb';

const router = express.Router();

type IDelDocument = {
  dbName: string;
  nameModel: string;
  collectionName?: string;
  id: string;
};

router.delete('/', async (req, res) => {
  const { collectionName, dbName, nameModel, id }: IDelDocument = req.body;

  if (!dbName || !nameModel || !collectionName || !id) {
    res.status(400).json({
      success: false,
      error:
        'Verifique se todos os campos foram informados. (dbName, nameModel, collectionName, id)',
    });
    return;
  }

  try {
    const { deleteDocumentById } = await mongodb(
      dbName,
      nameModel,
      collectionName,
    );
    const result = await deleteDocumentById(id);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: (error as Error).message,
    });
  }
});

export default router;
