import ReplyModel from "../models/Reply.js";
import TicketModel from "../models/TicketModel.js";



export const getAllTick = async(req,res)=>{
    try {
        const app = await TicketModel.find().populate('userid');
        res.status(200).json(app)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message})
    }
}
export const getMyTickets = async(req,res)=>{
    try {
        const {userid} = req.body;
        const app = await TicketModel.find({userid}).populate('userid');
        res.status(200).json(app)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message})
    }
}
export const createTick = async(req,res)=>{
    try {
        const data = req.body;

        const app = await TicketModel.create(data);
        res.status(200).json(app)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message})
    }
}

export const updateTick = async(req,res)=>{
    try {
        const {id} = req.params;
        const data = req.body;
        console.log(data);
        const app = await TicketModel.findByIdAndUpdate(id,data);
        res.status(200).json(app)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message})
    }
}

export const getOneTick = async(req,res)=>{
    try {
        const {id} = req.params;
        const app = await TicketModel.findById(id).populate('userid');
        res.status(200).json(app)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message})
    }
}

export const reply = async(req,res)=>{
    try {
        const {ticketId} = req.params;
        const data = req.body;
        if(!ticketId){
            throw Error('Ticket id is required')
        }
        if(!data.message){
            throw Error('Message required')
        }
        if(!data.userid){
            throw Error('User Id Required')
        }

        const app = await ReplyModel.create({...data,ticketId})
        res.status(200).json(app)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message})
    }
}
export const getMyReplies = async(req,res)=>{
    try {
        const {userid} = req.body;
        const app = await ReplyModel.find({userid}).populate('ticketId')
        res.status(200).json(app)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message})
    }
}

export const deleteTicket = async (req, res) => {
    try {
        const { id } = req.params;
        await TicketModel.findByIdAndDelete(id);
        res.status(200).json({ message: "Ticket deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};