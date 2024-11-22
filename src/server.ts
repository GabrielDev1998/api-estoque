import express from 'express';
import cors from 'cors';

import { initFirebaseAdmin } from './firebase/config';

import 'dotenv/config';

import routerMain from './routes/main';

const app = express();

// Configurações
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
app.use(express.json());

// Inicializa Firebase Admin
initFirebaseAdmin();

// Rota inicial
app.use('/', routerMain);

// Iniciando o servidor
app.listen(process.env.PORT, () => {
  console.log(`API rodando na porta ${process.env.PORT}`);
});
