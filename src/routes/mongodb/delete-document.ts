import express from 'express';
import mongodb from '../../mongodb/mongodb';

const router = express.Router();

router.delete('/', async (req, res) => {
  const querys = req.query as {
    id: string;
    nameModel: string;
    collectionName: string;
    dbName: string;
  };

  if (
    !querys.id ||
    !querys.collectionName ||
    !querys.collectionName ||
    !querys.dbName
  ) {
    res.status(400).json({
      success: false,
      error:
        'Algumas dessas informações não foram fornecidas: id, nameModel, collectionName, dbName.',
    });
    return;
  }

  const { deleteDocument } = mongodb(querys.dbName);

  try {
    const result = await deleteDocument(
      querys.id,
      querys.nameModel,
      querys.collectionName,
    );
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: 'Erro ao excluir documento.' });
    return;
  }
});

export default router;
