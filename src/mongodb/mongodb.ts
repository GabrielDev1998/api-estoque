import mongoose, { Schema, Document } from 'mongoose';
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

  await connectToDatabase(URL_DB, dbName);

  const getModel = async () => {
    try {
      const existingModel = mongoose.models[nameModel];
      return (
        existingModel ||
        mongoose.model(
          nameModel,
          new Schema({}, { strict: false }),
          collectionName,
        )
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

  const createDocument = async <T extends Document>(data: T) => {
    try {
      const Model = await getModel();
      const document = new Model(data);
      const savedDocument = await document.save();

      return {
        success: true,
        data: savedDocument,
      };
    } catch (err) {
      handleDatabaseError(ErrorMessages.CREATE_ERROR, err);
      return {
        success: false,
        error: ErrorMessages.CREATE_ERROR,
      };
    }
  };

  const getAllDocument = async () => {
    try {
      const Model = await getModel();
      return {
        success: true,
        data: await Model.find(),
      };
    } catch (err) {
      handleDatabaseError(ErrorMessages.LIST_ERROR, err);
      return {
        success: false,
        error: ErrorMessages.LIST_ERROR,
      };
    }
  };

  const getDocumentById = async (id: string) => {
    if (!validID(id)) throw new Error(ErrorMessages.INVALID_ID);

    try {
      const Model = await getModel();
      const document = await Model.findById(id);
      if (!document) throw new Error(ErrorMessages.DOCUMENT_NOT_FOUND);
      return {
        success: true,
        data: document,
      };
    } catch (err) {
      handleDatabaseError(ErrorMessages.DOCUMENT_NOT_FOUND, err);
      return {
        success: false,
        error: ErrorMessages.DOCUMENT_NOT_FOUND,
      };
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
      return {
        success: true,
        data: document,
      };
    } catch (err) {
      handleDatabaseError(ErrorMessages.UPDATE_ERROR, err);
      return {
        success: false,
        error: ErrorMessages.UPDATE_ERROR,
      };
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

      return {
        success: true,
        data: document,
      };
    } catch (err) {
      handleDatabaseError(ErrorMessages.DELETE_ERROR, err);
      return {
        success: false,
        error: ErrorMessages.DELETE_ERROR,
      };
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
