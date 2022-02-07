import transactionModel from '../../model/transactionModel.js';

import { EXPENSE, INCOME, monthList } from '../../lib/constants.js';

class TransactionController {
  async create(req, res) {
    try {
      const { transactionType, sum, category, destination, dayCreate, monthCreate, yearCreate } =
        req.body;
      const createTransaction = await transactionModel.create({
        transactionType,
        sum,
        category,
        destination,
        dayCreate,
        monthCreate,
        yearCreate,
      });
      res.status(201).json(createTransaction);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  async getAll(req, res) {
    try {
      const transactionsAll = await transactionModel.find();
      return res.json(transactionsAll);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  async getOne(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ message: 'Id не указан' });
      }

      const transactionOne = await transactionModel.findById(id);
      return res.json(transactionOne);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  async update(req, res) {
    try {
      const transaction = req.body;
      if (!transaction._id) {
        res.status(400).json({ message: 'Id не указан' });
      }

      const updatedTransaction = await transactionModel.findByIdAndUpdate(
        transaction._id,
        transaction,
        { new: true },
      );
      return res.json(updatedTransaction);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ message: 'Id не указан' });
      }

      const deletedTransaction = await transactionModel.findByIdAndRemove(id);
      return res.json(deletedTransaction);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  async getMonthStatistic(req, res, next) {
    try {
      let { month = new Date().getMonth() + 1, year = new Date().getFullYear() } = req.query;
      month = Number(month);
      year = Number(year);
      const totalIncome = await transactionModel.aggregate([
        {
          $match: {
            transactionType: 'income',
            monthCreate: month,
            yearCreate: year,
          },
        },
        { $group: { _id: 'income', total: { $sum: '$sum' } } },
      ]);
      const totalExpense = await transactionModel.aggregate([
        {
          $match: {
            transactionType: 'expense',
            monthCreate: month,
            yearCreate: year,
          },
        },
        { $group: { _id: 'totalExpense', total: { $sum: '$sum' } } },
      ]);
      const salary = await transactionModel.find({
        monthCreate: month,
        yearCreate: year,
        transactionType: 'income',
        category: 'salary',
      });
      const additionalIncome = await transactionModel.find({
        monthCreate: month,
        yearCreate: year,
        transactionType: 'income',
        category: 'additionalIncome',
      });
      const products = await transactionModel.find({
        monthCreate: month,
        yearCreate: year,
        transactionType: 'expense',
        category: 'products',
      });
      const alcohol = await transactionModel.find({
        monthCreate: month,
        yearCreate: year,
        transactionType: 'expense',
        category: 'alcohol',
      });
      const entertainment = await transactionModel.find({
        monthCreate: month,
        yearCreate: year,
        transactionType: 'expense',
        category: 'entertainment',
      });
      const health = await transactionModel.find({
        monthCreate: month,
        yearCreate: year,
        transactionType: 'expense',
        category: 'health',
      });
      const transport = await transactionModel.find({
        monthCreate: month,
        yearCreate: year,
        transactionType: 'expense',
        category: 'transport',
      });
      const housing = await transactionModel.find({
        monthCreate: month,
        yearCreate: year,
        transactionType: 'expense',
        category: 'housing',
      });
      const technics = await transactionModel.find({
        monthCreate: month,
        yearCreate: year,
        transactionType: 'expense',
        category: 'technics',
      });
      const communal = await transactionModel.find({
        monthCreate: month,
        yearCreate: year,
        transactionType: 'expense',
        category: 'communal',
      });
      const sport = await transactionModel.find({
        monthCreate: month,
        yearCreate: year,
        transactionType: 'expense',
        category: 'sport',
      });
      const education = await transactionModel.find({
        monthCreate: month,
        yearCreate: year,
        transactionType: 'expense',
        category: 'education',
      });
      const other = await transactionModel.find({
        monthCreate: month,
        yearCreate: year,
        transactionType: 'expense',
        category: 'other',
      });

      const result = {
        month: monthList[month - 1].name,
        year: year,
        totalIncome: totalIncome[0]?.total || 0,
        totalExpense: totalExpense[0]?.total || 0,
        income: { salary: salary, additionalIncome: additionalIncome },
        expense: {
          products: products,
          alcohol: alcohol,
          entertainment: entertainment,
          health: health,
          transport: transport,
          housing: housing,
          technics: technics,
          communal: communal,
          sport: sport,
          education: education,
          other: other,
        },
      };
      return res.json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  async createExpense(req, res) {
    try {
      const { sum, category, destination, dateOfTransaction } = req.body;

      const createExpenseTransaction = await transactionModel.create({
        transactionType: EXPENSE,
        sum,
        category,
        destination,
        dateOfTransaction,
      });
      console.log('req.body : ', req.body);
      res.status(201).json(createExpenseTransaction);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  async getAllExpenses(req, res) {
    try {
      const allExpenses = await transactionModel.find({ transactionType: EXPENSE });
      return res.json(allExpenses);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  async getSummaryStatistics(req, res, next) {
    try {
      const transactionType = req.query.type;
      const currentMonth = new Date().getMonth() + 1;
      let year = new Date().getFullYear();
      let prevYear = year;

      function getPrevMonth(x) {
        let prevMonth;
        if (currentMonth - x >= 1) {
          prevMonth = currentMonth - x;
        } else {
          prevMonth = 12 + currentMonth - x;
          prevYear = year - 1;
        }
        return prevMonth;
      }

      const allExpense = await transactionModel.find({ transactionType: 'expense' });
      const allIncome = await transactionModel.find({ transactionType: 'income' });

      const currentMonthSum = await transactionModel.aggregate([
        {
          $match: {
            transactionType: transactionType,
            monthCreate: currentMonth,
            yearCreate: prevYear,
          },
        },
        { $group: { _id: 1, total: { $sum: '$sum' } } },
      ]);
      const month1 = await transactionModel.aggregate([
        {
          $match: {
            transactionType: transactionType,
            monthCreate: getPrevMonth(1),
            yearCreate: prevYear,
          },
        },
        { $group: { _id: 2, total: { $sum: '$sum' } } },
      ]);

      const month2 = await transactionModel.aggregate([
        {
          $match: {
            transactionType: transactionType,
            monthCreate: getPrevMonth(2),
            yearCreate: prevYear,
          },
        },
        { $group: { _id: 3, total: { $sum: '$sum' } } },
      ]);

      const month3 = await transactionModel.aggregate([
        {
          $match: {
            transactionType: transactionType,
            monthCreate: getPrevMonth(3),
            yearCreate: prevYear,
          },
        },
        { $group: { _id: 4, total: { $sum: '$sum' } } },
      ]);

      const month4 = await transactionModel.aggregate([
        {
          $match: {
            transactionType: transactionType,
            monthCreate: getPrevMonth(4),
            yearCreate: prevYear,
          },
        },
        { $group: { _id: 5, total: { $sum: '$sum' } } },
      ]);

      const month5 = await transactionModel.aggregate([
        {
          $match: {
            transactionType: transactionType,
            monthCreate: getPrevMonth(5),
            yearCreate: prevYear,
          },
        },
        { $group: { _id: 6, total: { $sum: '$sum' } } },
      ]);

      const result = {
        type: transactionType,
        expenseList: allExpense,
        incomeList: allIncome,
        summaryList: {
          [monthList[currentMonth - 1].name]: currentMonthSum[0]?.total || 0,
          [monthList[getPrevMonth(1) - 1].name]: month1[0]?.total || 0,
          [monthList[getPrevMonth(2) - 1].name]: month2[0]?.total || 0,
          [monthList[getPrevMonth(3) - 1].name]: month3[0]?.total || 0,
          [monthList[getPrevMonth(4) - 1].name]: month4[0]?.total || 0,
          [monthList[getPrevMonth(5) - 1].name]: month5[0]?.total || 0,
        },
      };
      return res.json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  async createIncome(req, res) {
    try {
      const { sum, category, destination, dateOfTransaction } = req.body;

      const createExpenseTransaction = await transactionModel.create({
        transactionType: INCOME,
        sum,
        category,
        destination,
        dateOfTransaction,
      });
      console.log('req.body : ', req.body);
      res.status(201).json(createExpenseTransaction);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  async getAllIncomes(req, res) {
    try {
      const allIncomes = await transactionModel.find({ transactionType: INCOME });
      return res.json(allIncomes);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  /////////////////////--------------------------------------------
  async getSumOfAllIncomes() {
    const data = await transactionModel.aggregate([
      { $match: { transactionType: INCOME } },
      {
        $group: {
          _id: 'sumOfAllIncomes',
          totalSum: { $sum: '$sum' },
        },
      },
    ]);
    console.log('data = ', data);
    return data;
  }

  async getSumOfAllExpenses() {
    const data = await transactionModel.aggregate([
      { $match: { transactionType: EXPENSE } },
      {
        $group: {
          _id: 'sumOfAllExpenses',
          totalSum: { $sum: '$sum' },
        },
      },
    ]);
    console.log('data = ', data);
    return data;
  }
  /////////////////////--------------------------------------------

  async getBalance(req, res) {
    try {
      const sumOfAllIncomes = await transactionModel.aggregate([
        { $match: { transactionType: INCOME } },
        {
          $group: {
            _id: 'sumOfAllIncomes',
            totalSum: { $sum: '$sum' },
          },
        },
      ]);

      const sumOfAllExpenses = await transactionModel.aggregate([
        { $match: { transactionType: EXPENSE } },
        {
          $group: {
            _id: 'sumOfAllExpenses',
            totalSum: { $sum: '$sum' },
          },
        },
      ]);

      // console.log (' sumOfAllIncomes = ', sumOfAllIncomes);
      // console.log (' sumOfAllIncomes[0].totalSum = ', sumOfAllIncomes[0].totalSum)

      // console.log (' sumOfAllExpenses = ', sumOfAllExpenses)
      // console.log (' sumOfAllExpenses[0].totalSum = ', sumOfAllExpenses[0].totalSum)

      let balance = (await sumOfAllIncomes[0].totalSum) - sumOfAllExpenses[0].totalSum;

      console.log('balance = ', balance);
      return res.status(200).json({ balance: balance });
    } catch (err) {
      res.status(500).json(err);
    }
  }
}

export default new TransactionController();
