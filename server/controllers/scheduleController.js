import ScheduleModel from "../models/ScheduleModel.js";


export const createSchedule = async(req,res)=>{
    try {
        const data = req.body;
        const resp = await ScheduleModel.create(data);
        res.status(200).json(resp)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

// Read all schedules
export const getAllSchedules = async (req, res) => {
    try {
        const schedules = await ScheduleModel.find();
        res.status(200).json(schedules);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Read a single schedule by ID
export const getScheduleById = async (req, res) => {
    try {
        const schedule = await ScheduleModel.findById(req.params.id);
        if (!schedule) {
            res.status(404).json({ message: "Schedule not found" });
            return;
        }
        res.status(200).json(schedule);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Read this week's schedule
export const getScheduleThisWeek = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(23,59,59,900)
        const startDay = new Date();
        startDay.setHours(0, 1, 0, 0); // Set start of the day time

        const schedule = await ScheduleModel.findOne({
            dateFrom: { $lt: today },
            dateTo: { $gte: startDay } // Use $lte for end of the day
        });

        res.status(200).json(schedule);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Update a schedule by ID
export const updateScheduleById = async (req, res) => {
    try {
        const updatedSchedule = await ScheduleModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedSchedule) {
            res.status(404).json({ message: "Schedule not found" });
            return;
        }
        res.status(200).json(updatedSchedule);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a schedule by ID
export const deleteScheduleById = async (req, res) => {
    try {
        const deletedSchedule = await ScheduleModel.findByIdAndDelete(
            req.params.id
        );
        if (!deletedSchedule) {
            res.status(404).json({ message: "Schedule not found" });
            return;
        }
        res.status(200).json({ message: "Schedule deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

