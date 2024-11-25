import express from 'express';

import routeVerifyToken from './auth/verify-token';

import routeAddDocument from './mongodb/add-document';
import routeGetDocument from './mongodb/get-document';
import routePutDocument from './mongodb/put-document';
import routeDeleteDocument from './mongodb/del-document';

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
router.use('/api/mongodb/get', privateRoute, routeGetDocument);
router.use('/api/mongodb/put', privateRoute, routePutDocument);
router.use('/api/mongodb/del', privateRoute, routeDeleteDocument);

export default router;
