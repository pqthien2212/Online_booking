import express from 'express';
import TourController from '../controllers/tourController.js';

const router = express.Router();

// Search for tours with filters
// Example: /api/tours/search?name=Ha Long&minPrice=100&maxPrice=300
router.get('/search', TourController.search);

// Get all tours
// Example: /api/tours
router.get('/', TourController.getAllTours);

// Create a new tour
// Example: /api/tours
router.post('/', TourController.createTour);

// Update an existing tour
// Example: /api/tours/:tour_id
router.put('/:tour_id', TourController.updateTour);

// Delete a tour
// Example: /api/tours/:tour_id
router.delete('/:tour_id', TourController.deleteTour);

// Get activities of a specific tour
// Example: /api/tours/:tour_id/activities
router.get('/:tour_id/activities', TourController.getActivities);

// Add an activity to a specific tour
// Example: /api/tours/:tour_id/activities
router.post('/:tour_id/activities', TourController.addActivity);

// Delete an activity from a specific tour
// Example: /api/tours/:tour_id/activities
router.delete('/:tour_id/activities', TourController.deleteActivity);

// Get images of a specific tour
// Example: /api/tours/:tour_id/images
router.get('/:tour_id/images', TourController.getImages);

// Add an image to a specific tour
// Example: /api/tours/:tour_id/images
router.post('/:tour_id/images', TourController.addImage);

// Delete an image from a specific tour
// Example: /api/tours/:tour_id/images
router.delete('/:tour_id/images', TourController.deleteImage);

// Get locations of a specific tour
// Example: /api/tours/:tour_id/locations
router.get('/:tour_id/locations', TourController.getLocationsByTourId);

// Add a location to a specific tour
// Example: /api/tours/:tour_id/locations/:location_id
router.put('/:tour_id/locations/:location_id', TourController.updateLocation);

// Delete a location from a specific tour
// Example: /api/tours/:tour_id/locations
router.delete('/:tour_id/locations', TourController.removeLocations);

// Get accommodations of a specific tour
// Example: /api/tours/:tour_id/accommodations
router.get('/:tour_id/accommodations', TourController.getAccommodationByTourId);

// Add an accommodation to a specific tour
// Example: /api/tours/:tour_id/accommodations/:accommodation_id
router.put('/:tour_id/accommodations/:accommodation_id', TourController.updateAccommodations);

// Delete an accommodation from a specific tour
// Example: /api/tours/:tour_id/accommodations
router.delete('/:tour_id/accommodations', TourController.removeAccommodations);

// Get vehicles of a specific tour
// Example: /api/tours/:tour_id/vehicles
router.get('/:tour_id/vehicles', TourController.getVehiclesByTourId);

// Add a vehicle to a specific tour
// Example: /api/tours/:tour_id/accommodations/:vehicle_id
router.put('/:tour_id/vehicles/:vehicle_id', TourController.updateVehicles);

// Delete a vehicle from a specific tour
// Example: /api/tours/:tour_id/vehicles
router.delete('/:tour_id/vehicles', TourController.removeVehicles);


export default router;
