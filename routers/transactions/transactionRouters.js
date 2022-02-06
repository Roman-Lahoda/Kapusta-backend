import Router from 'express';
import transactionModel from '../../model/transactionModel.js';
import TransactionController from '../../controllers/transactions/transactionController.js';

const router = new Router();

//Чтобы роутинг работал без ошибок эти маршруты должны быть раньше/выше в коде

router.get('/transactions/balance', TransactionController.getBalance);

router.post('/transactions/expense', TransactionController.createExpense);
router.get('/transactions/expense', TransactionController.getAllExpenses);

router.get('/transactions/income', TransactionController.getAllIncomes);
router.post('/transactions/income', TransactionController.createIncome);


router.post('/transactions', TransactionController.create);
router.get('/transactions', TransactionController.getAll);
router.get('/transactions/:id', TransactionController.getOne);
router.put('/transactions', TransactionController.update);
router.delete('/transactions/:id', TransactionController.delete);


export default router;
