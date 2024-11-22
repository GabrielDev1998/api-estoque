import express from 'express';
import mongodb from '../../mongodb/mongodb';
import mongoose, { SchemaDefinition } from 'mongoose';

const router = express.Router();

const { createDocument } = mongodb();

type IAddDocument = {
  collectionName: string;
  schema: SchemaDefinition;
  data: any;
  dbName: string;
  nameModel: string;
};

router.post('/', async (req, res) => {
  const { collectionName, schema, dbName, data, nameModel }: IAddDocument =
    req.body;

  if (!schema || !data || !dbName || !nameModel) {
    res.status(400).json({
      success: false,
      error:
        'Parâmetros inválidos. Envie schema, data, dbName, nameModel e collectionName (OPCIONAL).',
    });
    return;
  }

  try {
    const result = await createDocument(
      dbName,
      nameModel,
      schema,
      data,
      collectionName,
    );

    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        success: false,
        error:
          'Erro ao salvar documento no MongoDB: ' + (error as Error).message,
      });
  } finally {
    // Desconecta após salvar o documento
    await mongoose.disconnect();
  }
});

export default router;
