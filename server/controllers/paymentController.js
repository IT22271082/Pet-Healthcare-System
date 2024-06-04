import CardModel from "../models/Card.js";
import TransactionModel from "../models/Transaction.js";


export const saveCardDetails = async (req, res) => {
    try {
        const data = req.body;

        if (!data.cardNumber || !data.expYear, !data.expMonth || !data.cvv || !data.name || !data.email) {
            throw Error('required fields are missing cardNumber , expYear, expMonth, cvv , name , email')
        }
        if (data.cardNumber.length < 16) {
            throw Error('Card number should 16 digits')
        }
        if (data.expYear < new Date().getFullYear()) {
            throw Error('Card is expired')
        }

        const card = await CardModel.create(data);

        res.status(200).json(card)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message })
    }
}

export const deleteCardDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const card = await CardModel.findByIdAndDelete(id)
        res.status(200).json(card);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message })
    }
}

export const updateCardDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const card = await CardModel.findByIdAndUpdate(id, req.body)
        res.status(200).json(card);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message })
    }
}

export const getCardDetails = async (req, res) => {
    try {
        const card = await CardModel.find({ userid: req.body?.userid })
        res.status(200).json(card);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message })
    }
}

export const getAllCards = async (req, res) => {
    try {
        const card = await CardModel.find()
        res.status(200).json(card);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message })
    }
}



export const getOneCard = async (req, res) => {
    try {
        const { id } = req.params;

        const card = await CardModel.findById(id)
        res.status(200).json(card);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message })
    }
}

export const getAllTransactions = async (req, res) => {
    try {
        const { userid } = req.body;
        const resp = await TransactionModel.find({ userid }).populate('productId')
        res.status(200).json(resp)
    } catch (error) {
        console.log(error);
        res.status(500), json({ message: error.message })
    }
}

export const getAllTheTransactions = async (req, res) => {
    try {
        const resp = await TransactionModel.find().populate('productId').populate('userid')
        res.status(200).json(resp)
    } catch (error) {
        console.log(error);
        res.status(500), json({ message: error.message })
    }
}

export const updateTransaction = async (req, res) => {
    try {
        const {id} = req.params;
        const resp = await TransactionModel.findByIdAndUpdate(id,req.body)
        res.status(200).json(resp)
    } catch (error) {
        console.log(error);
        res.status(500), json({ message: error.message })
    }
}

export const deleteTransaction = async (req, res) => {
    try {
        const {id} = req.params;
        const resp = await TransactionModel.findByIdAndDelete(id)
        res.status(200).json(resp)
    } catch (error) {
        console.log(error);
        res.status(500), json({ message: error.message })
    }
}