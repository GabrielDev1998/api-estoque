import mongoose, { Schema, SchemaDefinition } from 'mongoose';
import connectToDatabase from './connectToDatabase';

async function mongodb(
  dbName: string,
  nameModel: string,
  collectionName?: string,
) {
  const URL_MONGODB = process.env.MONGODB_URL_PRODUCTION as string;

  await connectToDatabase(URL_MONGODB, dbName);

  // Função para criar ou retornar um modelo dinâmico
  const Model = (schema: SchemaDefinition) => {
    // Verifica se o modelo já foi compilado
    if (mongoose.models[nameModel]) {
      return mongoose.models[nameModel]; // Retorna o modelo existente
    }

    // Cria o modelo se não existir
    return mongoose.model(nameModel, new Schema(schema), collectionName);
  };

  // Função para validar um ID
  const validateId = (id: string) => {
    const objectId = mongoose.Types.ObjectId.isValid(id)
      ? new mongoose.Types.ObjectId(id)
      : null;

    return objectId;
  };

  // Função para validar e compilar o modelo
  const validateCompiledModel = async (schema?: SchemaDefinition) => {
    try {
      // Verifica se o modelo já foi compilado
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

  // Função para criar um documento no banco de dados
  const createDocument = async (
    schema: SchemaDefinition,
    data: Record<string, any>,
  ) => {
    try {
      const DynamicModel = Model(schema); // Obtém o modelo
      const document = new DynamicModel(data); // Cria o documento
      const savedDocument = await document.save(); // Salva no banco
      return { success: true, data: savedDocument };
    } catch (error) {
      console.error('Erro ao criar documento:', (error as Error).message);
      throw new Error('Algum erro ocorreu ao tentar adicionar.');
    }
  };

  // Função para deletar um documento
  const deleteDocument = async (id: string) => {
    try {
      // Valida o ID e garante que seja um ObjectId
      const objectId = validateId(id);
      if (!objectId) {
        return {
          success: false,
          message: 'ID inválido.',
        };
      }

      // Valida e obtém o modelo correto
      const existingModel = await validateCompiledModel();

      const deletedDocument = await existingModel.findByIdAndDelete(objectId);

      if (!deletedDocument) {
        return {
          success: false,
          message: 'Documento não encontrado.',
        };
      }

      return {
        success: true,
        message: 'Documento deletado com sucesso',
      };
    } catch (error) {
      console.error('Erro ao excluir documento:', error);
      throw new Error('Falha ao excluir documento');
    }
  };

  // Função para atualizar um documento
  const updateDocumentById = async (
    schema: SchemaDefinition,
    id: string,
    data: any,
  ) => {
    try {
      const objectId = validateId(id);
      if (!objectId) {
        return {
          success: false,
          message: 'ID inválido.',
        };
      }

      const UpdateModel = await validateCompiledModel(schema);

      const updatedDocument = await UpdateModel.findByIdAndUpdate(
        objectId,
        data,
        {
          new: true, // Retorna o documento atualizado
          runValidators: true, // Valida o esquema antes de salvar
        },
      );

      if (!updatedDocument) {
        return {
          success: false,
          message: 'Documento não encontrado.',
        };
      }

      return {
        success: true,
        message: 'Documento atualizado com sucesso.',
        data: updatedDocument,
      };
    } catch (error) {
      console.error('Erro ao atualizar o documento:', (error as Error).message);
      throw new Error('Falha ao atualizar documento');
    }
  };

  // Função para listar todos os documentos de uma coleção
  const getAllDocuments = async () => {
    try {
      const GetModel = await validateCompiledModel();

      const documents = await GetModel.find();

      return {
        success: true,
        data: documents,
      };
    } catch (error) {
      console.error(
        'Erro ao listar todos os documentos:',
        (error as Error).message,
      );
      throw new Error('Falha ao listar todos os documentos');
    }
  };

  // Função para listar um documento específico por ID
  const getDocumentById = async (id: string) => {
    try {
      const objectId = validateId(id);
      if (!objectId) {
        return {
          success: false,
          message: 'ID inválido.',
        };
      }

      const GetModel = await validateCompiledModel();

      const document = await GetModel.findById(objectId);
      if (!document) {
        return {
          success: false,
          message: 'Documento não encontrado.',
        };
      }

      return {
        success: true,
        data: document,
      };
    } catch (error) {
      console.error('Erro ao listar o documento:', (error as Error).message);
      throw new Error('Falha ao listar o documento');
    }
  };

  return {
    createDocument,
    deleteDocument,
    updateDocumentById,
    getAllDocuments,
    getDocumentById,
    Model,
  };
}

export default mongodb;
