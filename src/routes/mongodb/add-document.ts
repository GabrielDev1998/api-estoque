import express from 'express';
import mongodb from '../../mongodb/mongodb';
import { SchemaDefinition } from 'mongoose';

const router = express.Router();

type IAddDocument = {
  dbName: string;
  nameModel: string;
  collectionName?: string;
  schema: SchemaDefinition;
  data: any;
};

router.post('/', async (req, res) => {
  const { collectionName, schema, dbName, data, nameModel }: IAddDocument =
    req.body;

  if (!schema || !data || !dbName || !nameModel) {
    res.status(400).json({
      success: false,
      error:
        'Parâmetros inválidos. Envie schema, data, dbName, nameModel, collectionName (OPCIONAL)',
    });
    return;
  }

  try {
    const { createDocument } = await mongodb(dbName, nameModel, collectionName);
    const result = await createDocument(schema, data);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Erro ao adicionar documento.',
    });
  }
});

export default router;
