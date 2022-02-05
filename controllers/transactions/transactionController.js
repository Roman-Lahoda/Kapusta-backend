import transactionModel from '../../model/transactionModel.js'

class TransactionController {

    async create (req, res) {
        try {
            const {transactionType, sum, category, destination} =req.body
            const createTransaction = await transactionModel.create({transactionType, sum, category, destination})
            console.log ('req.body : ', req.body)
            res.status (201).json(createTransaction)
        } catch (err){
            res.status (500).json (err)
        }

    }


    async getAll (req, res) {
        try {
            const transactionsAll  = await transactionModel.find();
            return res.json(transactionsAll)
        } catch (err){
            res.status (500).json (err)
        }
    }


    async getOne (req, res) {
        try {
            const {id} =req.params

                if(!id){
                    res.status(400).json ( {message: 'Id не указан'})
                }

            const transactionOne= await transactionModel.findById (id)
            return res.json(transactionOne)
        } catch (err){
            res.status (500).json (err)
        }
    }

    

    async update (req, res) {
        try {
            const transaction = req.body
            if (!transaction._id){
                res.status(400).json ({message: 'Id не указан'})
            }

            const updatedTransaction = await transactionModel.findByIdAndUpdate(transaction._id, transaction, {new: true})
            return  res.json(updatedTransaction)
        } catch (err){
            res.status (500).json (err)
        }
    }



    async delete (req, res) {
        try {
            const {id} = req.params
            if(!id){
                res.status(400).json ( {message: 'Id не указан'})
            }

            const deletedTransaction = await transactionModel.findByIdAndRemove(id);
            return res.json (deletedTransaction)

        } catch (err){
            res.status (500).json (err)
        }
    }



}

export default new TransactionController