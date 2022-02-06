import Router from 'express';
import transactionModel from '../../model/transactionModel.js';
import TransactionController from '../../controllers/transactions/transactionController.js';

const router = new Router();

router.post('/transactions', TransactionController.create);
router.get('/transactions', TransactionController.getAll);
router.put('/transactions', TransactionController.update);
router.delete('/transactions/:id', TransactionController.delete);
router.get('/transactions/date', TransactionController.getDayStatistic);
router.get('/transactions/month', TransactionController.getMonthStatistic);
router.get('/transactions/summary', TransactionController.getSummaryStatistics);
router.get('/transactions/:id', TransactionController.getOne);

export default router;
