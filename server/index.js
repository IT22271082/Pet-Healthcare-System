import express from 'express';
import dotenv from 'dotenv';
import { dbConfig } from './utils/dbconfig.js';
import cors from 'cors'
import morgan from 'morgan'
import userRouter from './routes/userRoutes.js';
import payRouter from './routes/paymentRoutes.js';
import itemRouter from './routes/itemRouter.js';
import appRoutes from './routes/appRoutes.js';
import ticketRouter from './routes/ticketRoutes.js';
import schRoutes from './routes/scheduleRoutes.js';
import feedbackRouter from './routes/feedbackRoutes.js';
dotenv.config();
const PORT = process.env.PORT || 3000
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'))

app.get('/', (req, res) => {
    res.status(200).json({message:"Server is up and running"})
})	

app.use('/', userRouter)
app.use('/card', payRouter)
app.use('/item', itemRouter)
app.use('/appointment', appRoutes)
app.use('/ticket', ticketRouter)
app.use('/feedback', feedbackRouter)
app.use('/schedules', schRoutes)

dbConfig();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}🚀`);
});
