import mongoose, { Schema, Document, SchemaDefinition } from 'mongoose';
import connectToDatabase from './connectToDatabase';

const ErrorMessages = {
  INVALID_ID: 'ID inválido.',
  DOCUMENT_NOT_FOUND: 'Documento não encontrado.',
  CREATE_ERROR: 'Erro ao criar documento.',
  UPDATE_ERROR: 'Erro ao atualizar documento.',
  DELETE_ERROR: 'Erro ao excluir documento.',
  LIST_ERROR: 'Erro ao listar documentos.',
};

async function mongodb(
  dbName: string,
  nameModel: string,
  collectionName?: string,
) {
  const URL_DB = process.env.MONGODB_URL as string;
  if (!URL_DB) {
    throw new Error('Variável de ambiente MONGODB_URL não encontrada.');
  }

  console.log(URL_DB);

  await connectToDatabase(URL_DB, dbName);

  const getModel = async (schema?: SchemaDefinition) => {
    try {
      const existingModel = mongoose.models[nameModel];
      return (
        existingModel ||
        mongoose.model(nameModel, new Schema(schema), collectionName)
      );
    } catch (error) {
      console.error('Erro ao validar o modelo', (error as Error).message);
      throw new Error('Falha ao validar o modelo');
    }
  };

  const validID = (id: string) => mongoose.Types.ObjectId.isValid(id);

  // Helper para lidar com erros de banco de dados
  const handleDatabaseError = (operation: string, error: unknown) => {
    console.error(
      `Erro ao executar operação: ${operation}`,
      (error as Error).message,
    );
    throw new Error(operation);
  };

  const createDocument = async <T extends Document>(
    schema: SchemaDefinition,
    data: T,
  ): Promise<T | null> => {
    try {
      const Model = await getModel(schema);
      const document = new Model(data);
      return await document.save();
    } catch (err) {
      handleDatabaseError(ErrorMessages.CREATE_ERROR, err);
      return null;
    }
  };

  const getAllDocument = async () => {
    try {
      const Model = await getModel();
      return await Model.find();
    } catch (err) {
      handleDatabaseError(ErrorMessages.LIST_ERROR, err);
    }
  };

  const getDocumentById = async <T>(id: string): Promise<T | null> => {
    if (!validID(id)) throw new Error(ErrorMessages.INVALID_ID);

    try {
      const Model = await getModel();
      const document = await Model.findById(id);
      if (!document) throw new Error(ErrorMessages.DOCUMENT_NOT_FOUND);
      return document as T;
    } catch (err) {
      handleDatabaseError(ErrorMessages.DOCUMENT_NOT_FOUND, err);
      return null;
    }
  };

  const updateDocumentById = async (id: string, data: any) => {
    if (!validID(id)) {
      throw new Error(ErrorMessages.INVALID_ID);
    }

    try {
      const Model = await getModel();
      const document = await Model.findByIdAndUpdate(id, data, { new: true });
      if (!document) {
        throw new Error(ErrorMessages.DOCUMENT_NOT_FOUND);
      }
      return document;
    } catch (err) {
      handleDatabaseError(ErrorMessages.UPDATE_ERROR, err);
    }
  };

  const deleteDocumentById = async (id: string) => {
    if (!validID(id)) {
      throw new Error(ErrorMessages.INVALID_ID);
    }

    try {
      const Model = await getModel();
      const document = await Model.findByIdAndDelete(id);
      if (!document) {
        throw new Error(ErrorMessages.DOCUMENT_NOT_FOUND);
      }

      return { id: document._id.toString(), success: true };
    } catch (err) {
      handleDatabaseError(ErrorMessages.DELETE_ERROR, err);
    }
  };

  return {
    createDocument,
    getAllDocument,
    getDocumentById,
    updateDocumentById,
    deleteDocumentById,
  };
}

export default mongodb;
