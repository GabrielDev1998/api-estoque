import express from 'express';

import routeVerifyToken from './auth/verify-token';

import routeAddDocument from './mongodb/add-document';
import routeGetDocuments from './mongodb/get-document';
import routeDeleteDocument from './mongodb/delete-document';
import routeUpdateDocument from './mongodb/update-document';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('API Sequoia');
});

// ## Rotas

// Autenticação
router.use('/api/verify-token', routeVerifyToken);

// Banco de Dados

router.use('/api/mongodb/add', routeAddDocument);
router.use('/api/mongodb/get', routeGetDocuments);
router.use('/api/mongodb/delete', routeDeleteDocument);
router.use('/api/mongodb/update', routeUpdateDocument);

export default router;
