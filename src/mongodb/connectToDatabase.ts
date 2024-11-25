import mongoose from 'mongoose';

// Função para conectar ao banco de dados
const connectToDatabase = async (url_db: string, dbName: string) => {
  try {
    if (mongoose.connection.readyState === 0) {
      // Estado 0: Desconectado
      console.log('Conectando ao MongoDB...');
      await mongoose.connect(url_db, { dbName });
      console.log(`Conectado ao MongoDB na base de dados "${dbName}"`);
    } else if (mongoose.connection.readyState === 1) {
      // Estado 1: Conectado
      console.log('Já conectado ao MongoDB');
    } else if (mongoose.connection.readyState === 2) {
      // Estado 2: Conectando
      console.log('Conexão com MongoDB está em progresso...');
    } else if (mongoose.connection.readyState === 3) {
      // Estado 3: Desconectando
      console.log('Desconectando do MongoDB...');
    }
  } catch (err) {
    console.error('Erro ao se conectar ao banco de dados:', err);
    throw new Error('Falha ao se conectar ao banco de dados');
  }
};

export default connectToDatabase;
