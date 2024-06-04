import mongoose from "mongoose";

// Declare the Schema of the Mongo model
var replySchma = new mongoose.Schema({
    ticketId:{
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "tickets"
    },
    userid: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "users"
    },
    message:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:'unread',
        enum:['unread','read']
    }
},{
    timestamps:true
});

//Export the model
const ReplyModel = mongoose.model('reply', replySchma);
export default ReplyModel