import Router from 'express';
import guard from '../../middlewares/guard.js';
import TransactionController from '../../controllers/transactions/transactionController.js';
import {
  validateCreateTransaction,
  validateUpdateTransaction,
} from '../../middlewares/validateTransaction.js';

const router = new Router();

router.post('/transactions', guard, validateCreateTransaction, TransactionController.create);
router.put('/transactions/:id', guard, validateUpdateTransaction, TransactionController.update);
router.delete('/transactions/:id', guard, TransactionController.delete);
router.get('/transactions/month', guard, TransactionController.getMonthStatistic);
router.get('/transactions/summary', guard, TransactionController.getSummaryStatistics);

export default router;
