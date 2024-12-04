import express from 'express';
import ReviewController from '../controllers/reviewController.js';

const router = express.Router();

// Example: /api/reviews/:tour_id
router.get('/:tour_id', ReviewController.getReviewsByTour);

// Create a new review
// Example: /api/reviews/
router.post('/', ReviewController.createReview);

// Delete a review
// Example: /api/reviews/:review_id
router.delete('/:review_id', ReviewController.deleteReview);

export default router; 
