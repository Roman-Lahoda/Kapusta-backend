import transactionModel from '../../model/transactionModel.js';
import mongoose from 'mongoose';
const { Types } = mongoose;
import UserModel from '../../model/userModel.js';

import { monthList, HttpCode } from '../../lib/constants.js';

class TransactionController {
  async create(req, res) {
    const { id: userId } = req.user;
    try {
      const {
        transactionType,
        sum,
        category,
        description,
        dayCreate,
        monthCreate,
        yearCreate,
        dateOfTransaction,
        idT,
      } = req.body;
      const createTransaction = await transactionModel.create({
        transactionType,
        sum: Math.round(eval(sum) * 100) / 100,
        category,
        description,
        dayCreate,
        monthCreate,
        yearCreate,
        dateOfTransaction,
        owner: userId,
        idT,
      });
      // console.log(
      //   '🚀 ~ file: transactionController.js ~ line 33 ~ TransactionController ~ create ~ createTransaction',
      //   createTransaction,
      // );
      const user = await UserModel.findById(userId);
      if (transactionType === 'income') {
        await UserModel.findByIdAndUpdate(userId, { balance: user.balance + sum });
      } else if (transactionType === 'expense') {
        await UserModel.findByIdAndUpdate(userId, { balance: user.balance - sum });
      }
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

  async update(req, res) {
    const { id: userId } = req.user;
    try {
      const transaction = req.body;
      const { id } = req.params;
      if (!id) {
        return res.status(HttpCode.BAD_REQUEST).json({
          status: 'error',
          code: HttpCode.BAD_REQUEST,
          message: "Id is'nt indicated",
        });
      }

      const updatedTransaction = await transactionModel
        .findOneAndUpdate({ idT: id, owner: userId }, { ...transaction }, { new: true })
        .populate({ path: 'owner', select: 'email id balance' });
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

  async delete(req, res) {
    const { id: userId } = req.user;
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(HttpCode.BAD_REQUEST).json({
          status: 'error',
          code: HttpCode.BAD_REQUEST,
          message: "Id is'nt indicated",
        });
      }

      const user = await UserModel.findById(userId);
      const transaction = await transactionModel.findOne({ idT: id });
      switch (transaction?.transactionType) {
        case 'income':
          await UserModel.findByIdAndUpdate(userId, { balance: user.balance - transaction.sum });
          break;
        case 'expense':
          await UserModel.findByIdAndUpdate(userId, { balance: user.balance + transaction.sum });
          break;
        default:
          break;
      }

      const deletedTransaction = await transactionModel
        .findOneAndRemove({
          idT: id,
          owner: userId,
        })
        .populate({ path: 'owner', select: 'email id balance' });
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
    const { id: userId } = req.user;
    try {
      let { month = new Date().getMonth() + 1, year = new Date().getFullYear() } = req.query;
      month = Number(month);
      year = Number(year);
      async function getTotalSum(type) {
        const totalSum = await transactionModel.aggregate([
          {
            $match: {
              owner: Types.ObjectId(userId),
              transactionType: type,
              monthCreate: month,
              yearCreate: year,
            },
          },
          { $group: { _id: 'totalExpense', total: { $sum: '$sum' } } },
        ]);
        return totalSum;
      }

      async function findTransactions(category, type) {
        const result = await transactionModel.find({
          owner: userId,
          monthCreate: month,
          yearCreate: year,
          transactionType: type,
          category: category,
        });
        return result;
      }
      const result = {
        month: month,
        year: year,
        totalIncome: (await getTotalSum('income'))[0]?.total || 0,
        totalExpense: (await getTotalSum('expense'))[0]?.total || 0,
        income: {
          salary: await findTransactions('salary', 'income'),
          additionalIncome: await findTransactions('additionalIncome', 'income'),
        },
        expense: {
          food: await findTransactions('food', 'expense'),
          alcohol: await findTransactions('alcohol', 'expense'),
          entertainment: await findTransactions('entertainment', 'expense'),
          health: await findTransactions('health', 'expense'),
          transport: await findTransactions('transport', 'expense'),
          housing: await findTransactions('housing', 'expense'),
          technics: await findTransactions('technics', 'expense'),
          communal: await findTransactions('communal', 'expense'),
          sport: await findTransactions('sport', 'expense'),
          education: await findTransactions('education', 'expense'),
          other: await findTransactions('other', 'expense'),
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

  async getSummaryStatistics(req, res, next) {
    const { id: userId } = req.user;
    try {
      function getPrevMonth(x) {
        const currentMonth = new Date().getMonth() + 1;
        let year = new Date().getFullYear();
        let prevYear = year;
        let monthNumber;
        if (currentMonth - x >= 1) {
          monthNumber = currentMonth - x;
        } else {
          monthNumber = 12 + currentMonth - x;
          prevYear = year - 1;
        }
        const monthName = monthList[monthNumber - 1]?.name;
        return { monthNumber, prevYear, monthName };
      }

      const listOfAllTransaction = await transactionModel
        .find({
          owner: userId,
        })
        .populate({ path: 'owner', select: 'email id balance' });

      async function getTotalSumForMonth(type, month) {
        const data = getPrevMonth(month);
        const result = await transactionModel.aggregate([
          {
            $match: {
              owner: Types.ObjectId(userId),
              transactionType: type,
              monthCreate: data.monthNumber,
              yearCreate: data.prevYear,
            },
          },
          { $group: { _id: 1, total: { $sum: '$sum' } } },
        ]);
        return { id: data.monthNumber, month: data.monthName, sum: result[0]?.total || 0 };
      }

      const result = {
        listOfTransactions: listOfAllTransaction,
        summaryListIncome: [
          await getTotalSumForMonth('income', 0),
          await getTotalSumForMonth('income', 1),
          await getTotalSumForMonth('income', 2),
          await getTotalSumForMonth('income', 3),
          await getTotalSumForMonth('income', 4),
          await getTotalSumForMonth('income', 5),
        ],
        summaryListExpense: [
          await getTotalSumForMonth('expense', 0),
          await getTotalSumForMonth('expense', 1),
          await getTotalSumForMonth('expense', 2),
          await getTotalSumForMonth('expense', 3),
          await getTotalSumForMonth('expense', 4),
          await getTotalSumForMonth('expense', 5),
        ],
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
}

export default new TransactionController();
