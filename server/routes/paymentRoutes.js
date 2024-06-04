import express from 'express'
import { loginValidator } from '../middlewares/loginValidator.js';
import { deleteCardDetails, deleteTransaction, getAllCards, getAllTheTransactions, getAllTransactions, getCardDetails, getOneCard, saveCardDetails, updateCardDetails, updateTransaction } from '../controllers/paymentController.js';
const payRouter = express.Router();

payRouter.get('/', loginValidator,getCardDetails)
payRouter.get('/transactions',loginValidator, getAllTransactions )
payRouter.get('/transactions/all', getAllTheTransactions )
payRouter.get('/all',getAllCards)
payRouter.get('/:id',getOneCard )


payRouter.post('/save',loginValidator, saveCardDetails)
payRouter.put('/:id', updateCardDetails);
payRouter.put('/order/:id', updateTransaction);
payRouter.delete('/:id', deleteCardDetails)
payRouter.delete('/order/:id', deleteTransaction)



export default payRouter;