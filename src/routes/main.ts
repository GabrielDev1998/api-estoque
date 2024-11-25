import express from 'express';

import routeVerifyToken from './auth/verify-token';

import routeAddDocument from './mongodb/add-document';

import { privateRoute } from '../middlewares/private-route';

const router = express.Router();

router.get('/', async (req, res) => {
  res.send('API Sequoia');
});

// ## Rotas

// Autenticação
router.use('/api/verify-token', routeVerifyToken);

// Banco de Dados

router.use('/api/mongodb/add', privateRoute, routeAddDocument);

export default router;
