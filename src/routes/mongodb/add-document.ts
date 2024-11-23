import express from 'express';
import mongodb from '../../mongodb/mongodb';
import { SchemaDefinition } from 'mongoose';

const router = express.Router();

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

  const { createDocument } = mongodb(dbName, nameModel, collectionName);

  try {
    const result = await createDocument(schema, data);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Ocorreu algum erro interno. Tente novamente mais tarde.',
    });
    return;
  }
});

export default router;
