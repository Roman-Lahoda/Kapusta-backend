import Joi from 'joi'

const createTransactionSchema = Joi.object({
    transactionType: Joi.string().min(2).max(100).required(),
    sum: Joi.number().min(0.01).required(),
    category: Joi.string().min(2).max(100).required(),
    destination: Joi.string().min(2).max(100).required(),
    dayCreate: Joi.number().min(1).max(31).required(),
    monthCreate: Joi.number().min(1).max(12).required(),
    yearCreate: Joi.number().min(2018).max(2030).required(),
})

const updateTransactionSchema = Joi.object({
    transactionType: Joi.string().min(2).max(100).optional(),
    sum: Joi.number().min(0.01).optional(),
    category: Joi.string().optional(),
    destination: Joi.string().optional(),
    dayCreate: Joi.number().min(1).max(31).optional(),
    monthCreate: Joi.number().min(1).max(12).optional(),
    yearCreate: Joi.number().min(2018).max(2030).optional(),
}).or('transactionType', 'sum', 'category', 'destination', 'dayCreate', 'monthCreate', 'yearCreate')


export const validateCreateTransaction = async (req, res, next) => {
    try {
        const value = await createTransactionSchema.validateAsync(req.body);
    }
    catch (err) { 
        return res.status(400).json({message: `Field ${err.message.replace(/"/g, '')}` })
    }
    next()
}


export const validateUpdateTransaction = async (req, res, next) => {
    try {
        const value = await updateTransactionSchema.validateAsync(req.body);
    }
    catch (err) { 
        return res.status(400).json({message: `Field ${err.message.replace(/"/g, '')}` })
    }
    next()
}