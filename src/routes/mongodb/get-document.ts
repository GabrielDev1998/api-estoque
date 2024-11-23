import express from 'express';
import mongodb from '../../mongodb/mongodb';

const router = express.Router();

router.get('/all', async (req, res) => {
  const querys = req.query as {
    dbName: string;
    collectionName: string;
  };

  if (!querys.dbName || !querys.collectionName) {
    res.status(400).json({
      success: false,
      error:
        'Algumas dessas informações não foram fornecidas: dbName, collectionName',
    });
    return;
  }

  const { getAllDocuments } = mongodb(querys.dbName);

  try {
    const documents = await getAllDocuments(
      querys.dbName,
      querys.collectionName,
    );
    res.status(200).json(documents);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: 'Erro ao recuperar documentos.' });
    return;
  }
});

router.get('/', async (req, res) => {
  const querys = req.query as {
    id: string;
    dbName: string;
    collectionName: string;
  };

  const { getDocumentById } = mongodb(querys.dbName);

  if (!querys.dbName || !querys.collectionName || !querys.id) {
    res.status(400).json({
      success: false,
      error:
        'Algumas dessas informações não foram fornecidas: dbName, collectionName, id',
    });
    return;
  }

  try {
    const document = await getDocumentById(
      querys.id,
      querys.dbName,
      querys.collectionName,
    );
    res.status(200).json(document);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: 'Erro ao recuperar documento.' });
    return;
  }
});

export default router;
