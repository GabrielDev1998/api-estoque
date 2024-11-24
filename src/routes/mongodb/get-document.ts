import express from 'express';
import mongodb from '../../mongodb/mongodb';

const router = express.Router();

router.get('/all', async (req, res) => {
  const { collectionName, dbName, nameModel } = req.query as {
    dbName: string;
    nameModel: string;
    collectionName?: string;
  };

  if (!dbName || !nameModel) {
    res.status(400).json({
      success: false,
      error:
        'Algumas dessas informações não foram fornecidas: dbName, nameModel, collectionName (OPCIONAL).',
    });
    return;
  }

  try {
    const { getAllDocuments } = await mongodb(
      dbName,
      nameModel,
      collectionName,
    );

    const documents = await getAllDocuments();

    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Ocorreu algum erro interno. Tente novamente mais tarde.',
    });
    return;
  }
});

router.get('/', async (req, res) => {
  const { collectionName, dbName, id } = req.query as {
    id: string;
    dbName: string;
    collectionName?: string;
  };

  if (!dbName || !id) {
    res.status(400).json({
      success: false,
      error:
        'Algumas dessas informações não foram fornecidas: dbName, id, collectionName (OPCIONAL)',
    });
    return;
  }

  try {
    const { getDocumentById } = await mongodb(dbName, dbName, collectionName);
    const document = await getDocumentById(id);
    res.status(200).json(document);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Ocorreu algum erro interno. Tente novamente mais tarde.',
    });
    return;
  }
});

export default router;
