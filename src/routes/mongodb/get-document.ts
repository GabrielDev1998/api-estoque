import express from 'express';
import mongodb from '../../mongodb/mongodb';

const router = express.Router();

type IGetDocument = {
  dbName: string;
  nameModel: string;
  collectionName?: string;
  id: string;
};

router.get('/all', async (req, res) => {
  const { collectionName, dbName, nameModel } = req.query as IGetDocument;

  if (!dbName || !nameModel || !collectionName) {
    res.status(400).json({
      success: false,
      error:
        'Verifique se todos os campos foram informados. (dbName, nameModel, collectionName)',
    });
    return;
  }

  try {
    const { getAllDocument } = await mongodb(dbName, nameModel, collectionName);
    const result = await getAllDocument();

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: (error as Error).message,
    });
  }
});

router.get('/', async (req, res) => {
  const { collectionName, dbName, nameModel, id }: IGetDocument = req.body;

  if (!dbName || !nameModel || !collectionName || !id) {
    res.status(400).json({
      success: false,
      error:
        'Verifique se todos os campos foram informados. (dbName, nameModel, collectionName, id)',
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
