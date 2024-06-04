import AppointmentModel from "../models/AppointmentModel.js";



export const getAllApps = async(req,res)=>{
    try {
        const app = await AppointmentModel.find().populate('userid');
        res.status(200).json(app)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message})
    }
}
export const getMyApps = async(req,res)=>{
    try {
        const {userid} = req.body 
        console.log(userid);
        const app = await AppointmentModel.find({userid}).populate('userid');
        res.status(200).json(app)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message})
    }
}
export const createAppointment = async(req,res)=>{
    try {
        const data = req.body;

        const app = await AppointmentModel.create(data);
        res.status(200).json(app)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message})
    }
}

export const updateAppointment = async(req,res)=>{
    try {
        const {id} = req.params;
        const data = req.body;
        const app = await AppointmentModel.findByIdAndUpdate(id,data);
        res.status(200).json(app)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message})
    }
}

export const getOneAppt = async(req,res)=>{
    try {
        const {id} = req.params;
        const app = await AppointmentModel.findById(id).populate('userid');
        res.status(200).json(app)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message})
    }
}


export const deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        await AppointmentModel.findByIdAndDelete(id);
        res.status(200).json({ message: "Appointment deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};