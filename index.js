import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import transactionModel from './model/transactionModel.js';
import router from './routers/transactions/transactionRouters.js';
import routerUser from './routers/users/authenticationRouters.js';

// const PORT = process.env.PORT;

const app = express();

app.use(express.json());

app.use(cors());
app.use('/api', router);
app.use('/api/users', routerUser);

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
    app.listen(process.env.PORT, () =>
      console.log('Server is running on PORT ' + process.env.PORT),
    );
  } catch (err) {
    console.log('err : ', err);
  }
}

startApp();
