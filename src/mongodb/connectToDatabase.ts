import mongoose from 'mongoose';

// Função para conectar ao banco de dados
const connectToDatabase = async (url_db: string, dbName: string) => {
  try {
    if (mongoose.connection.readyState === 0) {
      // Verifica se a conexão está fechada
      await mongoose.connect(url_db, { dbName });
      console.log('Conectado ao MongoDB');
    }
  } catch (err) {
    console.error('Erro ao se conectar ao banco de dados:', err);
    throw new Error('Falha ao se conectar ao banco de dados');
  }
};

export default connectToDatabase;
