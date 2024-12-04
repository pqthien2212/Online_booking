import Reviews from "../models/reviews.model.js";

const ReviewController = {
    // Login Function
    getReviewsByTour: (req, res) => {
        const { tour_id } = req.params; // Extract tour_id from request parameters
        const order = req.query.order || 'ASC'; // Default sorting order

        // Validate tour_id
        if (!tour_id) {
            return res.status(400).json({ message: 'Tour ID is required' });
        }

        Reviews.getByTourId({ tour_id, order }, (err, reviews) => {
            if (err) {
            return res.status(500).json({ message: 'Failed to fetch reviews', error: err.message });
            }

            if (!reviews.length) {
            return res.status(404).json({ message: 'No reviews found for this tour' });
            }

            return res.status(200).json({ reviews });
        });
    },

    createReview: (req, res) => {
        const { tour_id, client_id, rating, comment } = req.body; 

        // Validate input
        if (!tour_id || !client_id || !rating || !comment) {
            return res.status(400).json({ message: 'All fields (tour_id, client_id, rating, comment) are required' });
        }

        if (typeof rating !== 'number' || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be a number between 1 and 5' });
        }

        const reviewData = {
            tour_id,
            client_id,
            rating,
            comment,
            date_review: new Date() // Automatically set the review date
        };

        Reviews.create(reviewData, (err, reviewId) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to create review', error: err.message });
            }

            return res.status(201).json({ message: 'Review created successfully', reviewId });
        });
    },

    deleteReview: (req, res) => {
        const { review_id } = req.params; // Extract review_id from request parameters
    
        // Validate input
        if (!review_id) {
            return res.status(400).json({ message: 'Review ID is required' });
        }
    
        Reviews.delete(review_id, (err, result) => {
            if (err) {
                // Check if the error indicates no review found
                if (err.message === 'No review found with the given ID') {
                    return res.status(404).json({ message: err.message });
                }
                return res.status(500).json({ message: 'Failed to delete review', error: err.message });
            }
    
            return res.status(200).json({ message: 'Review deleted successfully' });
        });
    },
}

export default ReviewController;

