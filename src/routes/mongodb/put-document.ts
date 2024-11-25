import express from 'express';
import mongodb from '../../mongodb/mongodb';

const router = express.Router();

type IUpdateDocument = {
  dbName: string;
  nameModel: string;
  collectionName?: string;
  id: string;
  data: any;
};

router.put('/', async (req, res) => {
  const { collectionName, dbName, nameModel, id, data }: IUpdateDocument =
    req.body;

  if (!dbName || !nameModel || !collectionName || !id || !data) {
    res.status(400).json({
      success: false,
      error:
        'Verifique se todos os campos foram informados. (dbName, nameModel, collectionName, id, data)',
    });
    return;
  }

  try {
    const { updateDocumentById } = await mongodb(
      dbName,
      nameModel,
      collectionName,
    );
    const result = await updateDocumentById(id, data);
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
