import CardModel from "../models/Card.js";
import ItemModel from "../models/Item.js";
import TransactionModel from "../models/Transaction.js";

export const createItem = async (req, res) => {
    try {
        const data = req.body;

        const item = await ItemModel.create(data)
        res.status(200).json(item)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message })
    }
}

export const getAllItems = async (req, res) => {
    try {
        const items = await ItemModel.find()
        res.status(200).json(items)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message })
    }
}

export const getOneitem = async (req, res) => {
    try {
        const { id } = req.params;
        const items = await ItemModel.findById(id)
        res.status(200).json(items)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message })
    }
}

export const buyItem = async (req, res) => {
    try {
        const { cardId, userid, products,shipAddress } = req.body;

        const card = await CardModel.findById(cardId);
        if (!card) {
            throw Error('Card not found')
        }
        const totalAmount = products.reduce((acc, p) => acc + p.price * p.qty, 0);
        console.log(totalAmount);
        if (card.balance < totalAmount) {
            throw Error('Insufficient Balance');
        }

        for (const product of products) {
            const { _id, price, qty } = product;
            const amount = price * qty;

            card.balance -= amount;
            await card.save();

            const tsc = await TransactionModel.create({ cardId, productId : _id,qty,amount, userid,shipAddress });
            console.log(`Transaction created for product ${_id}`);
        }

        res.status(200).json({ message: 'Transactions created successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message })
    }
}

export const changeStatusOfOrder = async( req,res)=>{
    try {
        const { id } = req.params;
        console.log(req.query);
        const {status} = req.query || 'paid';
        const order = await TransactionModel.findByIdAndUpdate(id,{status},{new:true});
        res.status(200).json(order)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message })
    }
}

export const getOverview = async(req,res)=>{
    try {
        const totalPendingOrders = await TransactionModel.countDocuments({status:'pending'})
        const totalApprovedOrders = await TransactionModel.countDocuments({status:'approved'})
        const totalRejectedOrders = await TransactionModel.countDocuments({status:'rejected'})

        const totSales = await TransactionModel.find({status:'approved'});
        const totPen = await TransactionModel.find({status:'pending'});
        const totalSaleAmount = totSales.reduce((acc, p) => acc + p.amount, 0);
        const pendingAmount = totPen.reduce((acc, p) => acc + p.amount, 0);

        res.status(200).json({
            totalApprovedOrders,
            totalPendingOrders,
            totalRejectedOrders,
            totalSaleAmount,
            pendingAmount
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message })
    }
}