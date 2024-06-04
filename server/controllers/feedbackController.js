import FeedbackModel from "../models/FeedbackModel.js";

export const getAllFeed = async (req, res) => {
    try {
        const feedbacks = await FeedbackModel.find().populate('userid');
        res.status(200).json(feedbacks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

export const getMyFeedbacks = async (req, res) => {
    try {
        const { userid } = req.body;
        const feedbacks = await FeedbackModel.find({ userid }).populate('userid');
        res.status(200).json(feedbacks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

export const createFeed = async (req, res) => {
    try {
        const data = req.body;
        const newFeedback = await FeedbackModel.create(data);
        res.status(201).json(newFeedback);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

export const updateFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const updatedFeedback = await FeedbackModel.findByIdAndUpdate(id, data, { new: true });
        res.status(200).json(updatedFeedback);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

export const getOneFeed = async (req, res) => {
    try {
        const { FeedbackId } = req.params;
        const feedback = await FeedbackModel.findById(FeedbackId).populate('userid');
        res.status(200).json(feedback);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}


export const deleteFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        await FeedbackModel.findByIdAndDelete(id);
        res.status(200).json({ message: "Feedback deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};



