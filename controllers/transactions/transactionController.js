import transactionModel from '../../model/transactionModel.js';
import {EXPENSE, INCOME} from '../../lib/constants.js'

class TransactionController {


  async create(req, res) {
    try {
      const { transactionType, sum, category, destination } = req.body;
      const createTransaction = await transactionModel.create({
        transactionType,
        sum,
        category,
        destination,
      });
      console.log('req.body : ', req.body);
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


  async createExpense (req, res) {
    try {
      const {sum, category, destination, dateOfTransaction} = req.body;

      const createExpenseTransaction = await transactionModel.create({
        transactionType : EXPENSE,
        sum,
        category,
        destination,
        dateOfTransaction
      });
      console.log('req.body : ', req.body);
      res.status(201).json(createExpenseTransaction);
    } catch (err) {
      res.status(500).json(err);
    }
  }


  async getAllExpenses(req, res) {
    try {
      const allExpenses = await transactionModel.find({ transactionType: EXPENSE});
      return res.json(allExpenses);
    } catch (err) {
      res.status(500).json(err);
    }
  }


  async createIncome (req, res) {
    try {
      const {sum, category, destination, dateOfTransaction} = req.body;

      const createExpenseTransaction = await transactionModel.create({
        transactionType : INCOME,
        sum,
        category,
        destination,
        dateOfTransaction
      });
      console.log('req.body : ', req.body);
      res.status(201).json(createExpenseTransaction);
    } catch (err) {
      res.status(500).json(err);
    }
  }

   async getAllIncomes(req, res) {
    try {
      const allIncomes = await transactionModel.find({ transactionType: INCOME});
      return res.json(allIncomes);
    } catch (err) {
      res.status(500).json(err);
    }
  }



  /////////////////////--------------------------------------------
  async getSumOfAllIncomes  () {
        const data = await transactionModel.aggregate([
          { $match: { transactionType: INCOME } },
          {
            $group: {
              _id: 'sumOfAllIncomes',
              totalSum: { $sum: '$sum' },
            },
          },
        ])
        console.log ("data = ", data)
        return data
      }

      async getSumOfAllExpenses  () {
            const data = await transactionModel.aggregate([
              { $match: { transactionType: EXPENSE } },
              {
                $group: {
                  _id: 'sumOfAllExpenses',
                  totalSum: { $sum: '$sum' },
                },
              },
            ])
            console.log ("data = ", data)
            return data
          }
/////////////////////--------------------------------------------



      async getBalance (req, res) {
      
        try {
              const sumOfAllIncomes = await transactionModel.aggregate([
                { $match: { transactionType: INCOME } },
                {
                  $group: {
                    _id: 'sumOfAllIncomes',
                    totalSum: { $sum: '$sum' },
                  },
                },
              ])

              const sumOfAllExpenses = await transactionModel.aggregate([
                { $match: { transactionType: EXPENSE } },
                {
                  $group: {
                    _id: 'sumOfAllExpenses',
                    totalSum: { $sum: '$sum' },
                  },
                },
              ])

              
              // console.log (' sumOfAllIncomes = ', sumOfAllIncomes);
              // console.log (' sumOfAllIncomes[0].totalSum = ', sumOfAllIncomes[0].totalSum)

              // console.log (' sumOfAllExpenses = ', sumOfAllExpenses)
              // console.log (' sumOfAllExpenses[0].totalSum = ', sumOfAllExpenses[0].totalSum)
              
              let balance =  await sumOfAllIncomes[0].totalSum - sumOfAllExpenses[0].totalSum

              console.log ("balance = ", balance)
              return res.status(200).json( { balance:  balance } )

          } catch (err) {
            res.status(500).json(err);
          }

      }

}

export default new TransactionController();
