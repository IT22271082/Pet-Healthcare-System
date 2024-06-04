import express from 'express';
import { loginValidator } from '../middlewares/loginValidator.js';
import { createFeed, deleteFeedback, getAllFeed, getMyFeedbacks, getOneFeed, updateFeedback } from '../controllers/feedbackController.js';

const feedbackRouter = express.Router();

feedbackRouter.get('/', getAllFeed);
feedbackRouter.get('/my', loginValidator, getMyFeedbacks);
feedbackRouter.get('/:id', getOneFeed); // Added route for getting a single feedback by ID

feedbackRouter.post('/', loginValidator, createFeed);

feedbackRouter.put('/:id', updateFeedback); // Adjusted parameter name to match controller
feedbackRouter.delete('/:id', deleteFeedback);

export default feedbackRouter;
