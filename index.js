import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';
// import transactionModel from './model/transactionModel.js';
import router from './routers/transactions/transactionRouters.js';
import { LIMIT_JSON } from './lib/constants.js';
import { HttpCode } from './lib/constants.js';

const PORT = 3000;

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: LIMIT_JSON }));

app.use('/api', router);

app.use((_req, res) => {
  res
    .status(HttpCode.NOT_FOUND)
    .json({ status: 'error', code: HttpCode.NOT_FOUND, message: 'Not found' });
});

// app.get ('/api/transactions', (req,res)=>{
//     res.status (200).json('Сервер работает! Это страница для доступа к транзакциям. ')
//  })

//  app.post ('/api/transactions', async (req,res)=>{
//      try {
//             const {transactionType, sum, category, destination} =req.body
//             const createTransaction = await transactionModel.create({transactionType, sum, category, destination})
//             console.log ('req.body : ', req.body)
//             res.status (201).json(createTransaction)
//      } catch (err){
//         res.status (500).json (err)
//      }

//     }
//  )

async function startApp() {
  try {
    await mongoose.connect(process.env.DB_URL);
    app.listen(PORT, () => console.log('Server is running on PORT ' + PORT));
  } catch (err) {
    console.log('err : ', err);
  }
}

startApp();
