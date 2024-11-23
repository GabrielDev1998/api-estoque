import mongoose, { Schema, SchemaDefinition } from 'mongoose';

function mongodb(dbName: string) {
  const URL_MONGODB = process.env.MONGODB_URL as string;

  // Função para conectar ao banco de dados
  const connectToDatabase = async () => {
    try {
      if (mongoose.connection.readyState === 0) {
        // Verifica se a conexão está fechada
        await mongoose.connect(URL_MONGODB, { dbName });
        console.log('Conectado ao MongoDB');
      }
    } catch (err) {
      console.error('Erro ao se conectar ao banco de dados:', err);
      throw new Error('Falha ao se conectar ao banco de dados');
    }
  };

  // Inicia a conexão com o banco de dados ao criar o serviço
  connectToDatabase();

  // Função para criar ou retornar um modelo dinâmico
  const Model = (
    nameModel: string,
    schema: SchemaDefinition,
    collectionName?: string,
  ) => {
    // Verifica se o modelo já foi compilado
    if (mongoose.models[nameModel]) {
      return mongoose.models[nameModel]; // Retorna o modelo existente
    }

    // Cria o modelo se não existir
    return mongoose.model(
      nameModel,
      new Schema(schema, { collection: collectionName || nameModel }),
    );
  };

  // Função para validar um ID
  const validateId = (id: string) => {
    const objectId = mongoose.Types.ObjectId.isValid(id)
      ? new mongoose.Types.ObjectId(id)
      : null;

    return objectId;
  };

  // Função para validar e compilar o modelo
  const validateCompiledModel = async (
    nameModel: string,
    schema?: SchemaDefinition,
    collectionName?: string,
  ) => {
    try {
      // Verifica se o modelo já foi compilado
      const existingModel = mongoose.models[nameModel];
      return (
        existingModel ||
        mongoose.model(
          nameModel,
          new Schema(schema, { collection: collectionName }),
        )
      );
    } catch (error) {
      console.error('Erro ao validar o modelo', (error as Error).message);
      throw new Error('Falha ao validar o modelo');
    }
  };

  // Função para criar um documento no banco de dados
  const createDocument = async (
    nameModel: string,
    schema: SchemaDefinition,
    data: Record<string, any>,
    collectionName?: string,
  ) => {
    try {
      const DynamicModel = Model(nameModel, schema, collectionName); // Obtém o modelo
      const document = new DynamicModel(data); // Cria o documento
      const savedDocument = await document.save(); // Salva no banco
      return { success: true, data: savedDocument };
    } catch (error) {
      console.error('Erro ao criar documento:', (error as Error).message);
      throw new Error('Algum erro ocorreu ao tentar adicionar.');
    }
  };

  // Função para deletar um documento
  const deleteDocument = async (
    id: string,
    nameModel: string,
    collectionName: string,
  ) => {
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
      const existingModel = await validateCompiledModel(
        nameModel,
        undefined,
        collectionName,
      );

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
    nameModel: string,
    schema: SchemaDefinition,
    id: string,
    data: any,
    collectionName?: string,
  ) => {
    try {
      const objectId = validateId(id);
      if (!objectId) {
        return {
          success: false,
          message: 'ID inválido.',
        };
      }

      const UpdateModel = await validateCompiledModel(
        nameModel,
        schema,
        collectionName,
      );

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
  const getAllDocuments = async (
    nameModel: string,
    collectionName?: string,
  ) => {
    try {
      const GetModel = await validateCompiledModel(
        nameModel,
        undefined,
        collectionName,
      );

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
  const getDocumentById = async (
    id: string,
    nameModel: string,
    collectionName?: string,
  ) => {
    try {
      const objectId = validateId(id);
      if (!objectId) {
        return {
          success: false,
          message: 'ID inválido.',
        };
      }

      const GetModel = await validateCompiledModel(
        nameModel,
        undefined,
        collectionName,
      );

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
