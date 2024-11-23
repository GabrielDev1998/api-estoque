import express from 'express';
import mongodb from '../../mongodb/mongodb';
import mongoose from 'mongoose';

const router = express.Router();

router.put('/', async (req, res) => {
  const querys = req.query as { id: string };
  const { dbName, nameModel, schema, collectionName, data } = req.body;

  if (!dbName || !nameModel || !schema || !collectionName || !data) {
    res.status(400).json({
      success: false,
      error:
        'Algumas dessas informações não foram fornecidas: dbName, nameModel, schema, collectionName, data',
    });
    return;
  }

  const { updateDocumentById } = mongodb(dbName);

  try {
    const result = await updateDocumentById(
      nameModel,
      schema,
      querys.id,
      data,
      collectionName,
    );

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error:
        'Erro ao atualizar documento no MongoDB: ' + (error as Error).message,
    });
  } finally {
    // Desconecta após salvar o documento
    await mongoose.disconnect();
  }
});

export default router;
