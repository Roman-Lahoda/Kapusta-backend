import Router from 'express';
import transactionModel from '../../model/transactionModel.js';
import TransactionController from '../../controllers/transactions/transactionController.js';
import { validateCreateTransaction, validateUpdateTransaction } from '../../middlewares/validateTransaction.js'

const router = new Router();

//Чтобы роутинг работал без ошибок эти маршруты должны быть раньше/выше в коде

router.get('/transactions/balance', TransactionController.getBalance);

router.post('/transactions/expense', TransactionController.createExpense);
router.get('/transactions/expense', TransactionController.getAllExpenses);

router.get('/transactions/income', TransactionController.getAllIncomes);
router.post('/transactions/income', TransactionController.createIncome);


router.post('/transactions', validateCreateTransaction, TransactionController.create);
router.get('/transactions', TransactionController.getAll);
router.put('/transactions/:id', validateUpdateTransaction, TransactionController.update);
router.delete('/transactions/:id', TransactionController.delete);
router.get('/transactions/month', TransactionController.getMonthStatistic);
router.get('/transactions/summary', TransactionController.getSummaryStatistics);
router.get('/transactions/:id', TransactionController.getOne);


export default router;
