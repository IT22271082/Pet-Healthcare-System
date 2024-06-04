import express from 'express'
import { loginValidator } from '../middlewares/loginValidator.js';
import { buyItem, changeStatusOfOrder, createItem, getAllItems, getOneitem, getOverview } from '../controllers/itemController.js';
const itemRouter = express.Router();

itemRouter.get('/',getAllItems)
itemRouter.get('/:id',getOneitem)
itemRouter.get('/sales/overview',getOverview)
itemRouter.post('/', createItem)
itemRouter.put('/buy',loginValidator, buyItem);
itemRouter.put('/order/status/:id',loginValidator, changeStatusOfOrder);



export default itemRouter;