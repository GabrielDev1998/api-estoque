import mongoose, { Document, Model, Schema, SchemaDefinition } from 'mongoose';
import connectToDatabase from './connectToDatabase';

interface DocumentData extends Document {
  [key: string]: any; // Defina os campos específicos do seu modelo, se necessário
}

const ErrorMessages = {
  INVALID_ID: 'ID inválido.',
  DOCUMENT_NOT_FOUND: 'Documento não encontrado.',
  CREATE_ERROR: 'Erro ao criar documento.',
  UPDATE_ERROR: 'Erro ao atualizar documento.',
  DELETE_ERROR: 'Erro ao excluir documento.',
  LIST_ERROR: 'Erro ao listar documentos.',
};

// Valida e retorna um ObjectId, lança exceção se for inválido
const validateId = (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error(ErrorMessages.INVALID_ID);
  }
  return new mongoose.Types.ObjectId(id);
};

const getModel = (
  nameModel: string,
  schema?: SchemaDefinition,
  collectionName?: string,
) => {
  // Verifica se o modelo já foi criado anteriormente
  if (mongoose.models[nameModel]) {
    return mongoose.models[nameModel] as Model<DocumentData>;
  }
  // Cria um novo modelo com o schema fornecido
  const DynamicModel = mongoose.model<DocumentData>(
    nameModel,
    new Schema(schema),
    collectionName,
  );

  return DynamicModel;
};

async function mongodb(
  dbName: string,
  nameModel: string,
  collectionName?: string,
) {
  const URL_MONGODB = process.env.MONGODB_URL_PRODUCTION as string;

  // Verifica ou conecta ao banco
  if (!mongoose.connection.readyState) {
    await connectToDatabase(URL_MONGODB, dbName);
  }

  // Função para criar um documento
  const createDocument = async (
    schema: SchemaDefinition,
    data: DocumentData,
  ) => {
    try {
      const DynamicModel = getModel(nameModel, schema, collectionName);
      const document = new DynamicModel(data);
      const savedDocument = await document.save();
      return { success: true, data: savedDocument };
    } catch (error) {
      console.error(ErrorMessages.CREATE_ERROR, (error as Error).message);
      throw new Error(ErrorMessages.CREATE_ERROR);
    }
  };

  // Função para deletar um documento
  const deleteDocument = async (id: string) => {
    try {
      const objectId = validateId(id);
      const DynamicModel = getModel(nameModel);
      const deletedDocument = await DynamicModel.findByIdAndDelete(objectId);

      if (!deletedDocument) {
        return { success: false, message: ErrorMessages.DOCUMENT_NOT_FOUND };
      }

      return { success: true, message: 'Documento deletado com sucesso' };
    } catch (error) {
      console.error(ErrorMessages.DELETE_ERROR, (error as Error).message);
      throw new Error(ErrorMessages.DELETE_ERROR);
    }
  };

  // Função para atualizar um documento
  const updateDocumentById = async (
    schema: SchemaDefinition,
    id: string,
    data: DocumentData,
  ) => {
    try {
      const objectId = validateId(id);
      const DynamicModel = getModel(nameModel, schema, collectionName);

      const updatedDocument = await DynamicModel.findByIdAndUpdate(
        objectId,
        data,
        {
          new: true, // Retorna o documento atualizado
          runValidators: true, // Valida os dados antes de salvar
        },
      );

      if (!updatedDocument) {
        return { success: false, message: ErrorMessages.DOCUMENT_NOT_FOUND };
      }

      return {
        success: true,
        message: 'Documento atualizado com sucesso.',
        data: updatedDocument,
      };
    } catch (error) {
      console.error(ErrorMessages.UPDATE_ERROR, (error as Error).message);
      throw new Error(ErrorMessages.UPDATE_ERROR);
    }
  };

  // Função para listar todos os documentos
  const getAllDocuments = async () => {
    try {
      const DynamicModel = getModel(nameModel);
      const documents = await DynamicModel.find();
      return { success: true, data: documents };
    } catch (error) {
      console.error(ErrorMessages.LIST_ERROR, (error as Error).message);
      throw new Error(ErrorMessages.LIST_ERROR);
    }
  };

  // Função para listar um documento por ID
  const getDocumentById = async (id: string) => {
    try {
      const objectId = validateId(id);
      const DynamicModel = getModel(nameModel);

      const document = await DynamicModel.findById(objectId);
      if (!document) {
        return { success: false, message: ErrorMessages.DOCUMENT_NOT_FOUND };
      }

      return { success: true, data: document };
    } catch (error) {
      console.error(ErrorMessages.LIST_ERROR, (error as Error).message);
      throw new Error(ErrorMessages.LIST_ERROR);
    }
  };

  return {
    createDocument,
    deleteDocument,
    updateDocumentById,
    getAllDocuments,
    getDocumentById,
    getModel,
  };
}

export default mongodb;
