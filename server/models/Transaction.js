import mongoose from "mongoose";

// Declare the Schema of the Mongo model
var transactionSchema = new mongoose.Schema({
    cardId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "Card"
    },
    amount: {
        type: Number,
        required: true,
    },
    qty:{
        type:Number,
        min:1,

    },
    shipAddress:String,
    productId:{
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "Item"
    },
    userid: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "users"
    },
    status:{
        type:String,
        default:'pending',
        enum:['pending','approved','completed','rejected']
    }
},{
    timestamps:true
});

//Export the model
const TransactionModel = mongoose.model('Transaction', transactionSchema);
export default TransactionModel