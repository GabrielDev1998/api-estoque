import express from 'express';

import routeVerifyToken from './auth/verify-token';

import routeAddDocument from './mongodb/add-document';
import routeGetDocuments from './mongodb/get-document';
import routeDeleteDocument from './mongodb/delete-document';
import routeUpdateDocument from './mongodb/update-document';
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
router.use('/api/mongodb/get', privateRoute, routeGetDocuments);
router.use('/api/mongodb/delete', privateRoute, routeDeleteDocument);
router.use('/api/mongodb/update', privateRoute, routeUpdateDocument);

export default router;
