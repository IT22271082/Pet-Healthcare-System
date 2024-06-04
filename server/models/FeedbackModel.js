import mongoose from "mongoose";

// Custom validator function to check if the rating is between 1 and 5
const validateRating = (value) => {
    return value >= 1 && value <= 5;
};

// Declare the Schema of the Mongo model
const feedbackSchema = new mongoose.Schema({
    phone: {
        type: Number, // Changed from 'int' to 'Number'
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
       
    },
    comment: {
        type: String,
        required: true,
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId, // Changed from 'mongoose.SchemaTypes.ObjectId' to 'mongoose.Schema.Types.ObjectId'
        required: true,
        ref: "users"
    },
   
}, {
    timestamps: true
});

// Export the model
const FeedbackModel = mongoose.model('feedbacks', feedbackSchema);
export default FeedbackModel;
