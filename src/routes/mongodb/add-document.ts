import express from 'express';
import mongodb from '../../mongodb/mongodb';

const router = express.Router();

type IAddDocument = {
  dbName: string;
  nameModel: string;
  collectionName?: string;
  data: any;
};

router.post('/', async (req, res) => {
  const { collectionName, dbName, data, nameModel }: IAddDocument = req.body;

  if (!dbName || !nameModel || !data || !collectionName) {
    res.status(400).json({
      success: false,
      error:
        'Verifique se todos os campos foram informados. (dbName, data, nameModel, collectionName)',
    });
    return;
  }

  try {
    const { createDocument } = await mongodb(dbName, nameModel, collectionName);
    const result = await createDocument(data);

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
