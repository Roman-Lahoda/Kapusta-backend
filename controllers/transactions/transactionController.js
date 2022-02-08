import transactionModel from '../../model/transactionModel.js';

import { EXPENSE, INCOME, monthList, HttpCode } from '../../lib/constants.js';

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
      return res.status(HttpCode.CREATED).json({
        status: 'success',
        code: HttpCode.CREATED,
        data: createTransaction,
      });
    } catch (err) {
      return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        code: HttpCode.INTERNAL_SERVER_ERROR,
        message: err.message,
      });
    }
  }

  async getAll(req, res) {
    try {
      const transactionsAll = await transactionModel.find();
      return res.status(HttpCode.OK).json({
        status: 'succes',
        code: HttpCode.OK,
        data: transactionsAll,
      });
    } catch (err) {
      return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        code: HttpCode.INTERNAL_SERVER_ERROR,
        message: err.message,
      });
    }
  }

  async getOne(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(HttpCode.BAD_REQUEST).json({
          status: 'error',
          code: HttpCode.BAD_REQUEST,
          message: "Id is'nt indicated",
        });
      }
      const transactionOne = await transactionModel.findById(id);
      if (!transactionOne) {
        return res.status(HttpCode.NOT_FOUND).json({
          status: 'error',
          code: HttpCode.NOT_FOUND,
          message: 'Transaction not found',
        });
      }
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        data: transactionOne,
      });
    } catch (err) {
      return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        code: HttpCode.INTERNAL_SERVER_ERROR,
        message: err.message,
      });
    }
  }


  async update(req, res) {
    try {
      const transaction = req.body;
      console.log ('req.body ', req.body )
      const { id } = req.params;
      if (!id) {
        return res.status(HttpCode.BAD_REQUEST).json({
          status: 'error',
          code: HttpCode.BAD_REQUEST,
          message: "Id is'nt indicated",
        });
      }

      const updatedTransaction = await transactionModel.findByIdAndUpdate(
        id,
        {...transaction},
        { new: true },
      );
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        data: updatedTransaction,
      });
    } catch (err) {
      return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        code: HttpCode.INTERNAL_SERVER_ERROR,
        message: err.message,
      });
    }
  }



  /////////////////





  async delete(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(HttpCode.BAD_REQUEST).json({
          status: 'error',
          code: HttpCode.BAD_REQUEST,
          message: "Id is'nt indicated",
        });
      }

      const deletedTransaction = await transactionModel.findByIdAndRemove(id);
      if (!deletedTransaction) {
        return res.status(HttpCode.NOT_FOUND).json({
          status: 'error',
          code: HttpCode.NOT_FOUND,
          message: 'Transaction not found',
        });
      }
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        data: deletedTransaction,
      });
    } catch (err) {
      return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        code: HttpCode.INTERNAL_SERVER_ERROR,
        message: err.message,
      });
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
      return res.status(HttpCode.OK).json({
        status: 'succes',
        code: HttpCode.OK,
        data: result,
      });
    } catch (err) {
      return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        code: HttpCode.INTERNAL_SERVER_ERROR,
        message: err.message,
      });
    }
  }

  async createExpense(req, res) {
    try {
      const { sum, category, destination, dateOfTransaction, dayCreate, monthCreate, yearCreate } =
        req.body;

      const createExpenseTransaction = await transactionModel.create({
        transactionType: EXPENSE,
        sum,
        category,
        destination,
        dateOfTransaction,
        dayCreate,
        monthCreate,
        yearCreate,
      });
      return res.status(HttpCode.CREATED).json({
        status: 'success',
        code: HttpCode.CREATED,
        data: createExpenseTransaction,
      });
    } catch (err) {
      return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        code: HttpCode.INTERNAL_SERVER_ERROR,
        message: err.message,
      });
    }
  }

  async getAllExpenses(req, res) {
    try {
      const allExpenses = await transactionModel.find({ transactionType: EXPENSE });
      return res.status(HttpCode.OK).json({
        status: 'succes',
        code: HttpCode.OK,
        data: allExpenses,
      });
    } catch (err) {
      return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        code: HttpCode.INTERNAL_SERVER_ERROR,
        message: err.message,
      });
    }
  }

  async getSummaryStatistics(req, res, next) {
    try {
      const transactionType = req.query.type;
      if (!transactionType) {
        return res.status(HttpCode.BAD_REQUEST).json({
          status: 'error',
          code: HttpCode.BAD_REQUEST,
          message: 'Transaction type in query string is required',
        });
      }
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

      const listTransaction = await transactionModel.find({ transactionType: transactionType });
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
        listOfTransactions: listTransaction,
        summaryList: {
          [monthList[currentMonth - 1].name]: currentMonthSum[0]?.total || 0,
          [monthList[getPrevMonth(1) - 1].name]: month1[0]?.total || 0,
          [monthList[getPrevMonth(2) - 1].name]: month2[0]?.total || 0,
          [monthList[getPrevMonth(3) - 1].name]: month3[0]?.total || 0,
          [monthList[getPrevMonth(4) - 1].name]: month4[0]?.total || 0,
          [monthList[getPrevMonth(5) - 1].name]: month5[0]?.total || 0,
        },
      };
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        data: result,
      });
    } catch (err) {
      return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        code: HttpCode.INTERNAL_SERVER_ERROR,
        message: err.message,
      });
    }
  }

  async createIncome(req, res) {
    try {
      const { sum, category, destination, dateOfTransaction, dayCreate, monthCreate, yearCreate } =
        req.body;

      const createIncomeTransaction = await transactionModel.create({
        transactionType: INCOME,
        sum,
        category,
        destination,
        dateOfTransaction,
        dayCreate,
        monthCreate,
        yearCreate,
      });
      return res.status(HttpCode.CREATED).json({
        status: 'success',
        code: HttpCode.CREATED,
        data: createIncomeTransaction,
      });
    } catch (err) {
      return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        code: HttpCode.INTERNAL_SERVER_ERROR,
        message: err.message,
      });
    }
  }

  async getAllIncomes(req, res) {
    try {
      const allIncomes = await transactionModel.find({ transactionType: INCOME });
      return res.status(HttpCode.OK).json({
        status: 'succes',
        code: HttpCode.OK,
        data: allIncomes,
      });
    } catch (err) {
      return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        code: HttpCode.INTERNAL_SERVER_ERROR,
        message: err.message,
      });
    }
  }

  /////////////////////--------------------------------------------
  async getSumOfAllIncomes() {
    try {
      const data = await transactionModel.aggregate([
        { $match: { transactionType: INCOME } },
        {
          $group: {
            _id: 'sumOfAllIncomes',
            totalSum: { $sum: '$sum' },
          },
        },
      ]);
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        data: data,
      });
    } catch (err) {
      return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        code: HttpCode.INTERNAL_SERVER_ERROR,
        message: err.message,
      });
    }
  }

  async getSumOfAllExpenses() {
    try {
      const data = await transactionModel.aggregate([
        { $match: { transactionType: EXPENSE } },
        {
          $group: {
            _id: 'sumOfAllExpenses',
            totalSum: { $sum: '$sum' },
          },
        },
      ]);
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        data: data,
      });
    } catch (err) {
      return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        code: HttpCode.INTERNAL_SERVER_ERROR,
        message: err.message,
      });
    }
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
      return res.status(HttpCode.CREATED).json({
        status: 'success',
        code: HttpCode.CREATED,
        data: balance,
      });
    } catch (err) {
      return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        code: HttpCode.INTERNAL_SERVER_ERROR,
        message: err.message,
      });
    }
  }
}

export default new TransactionController();
