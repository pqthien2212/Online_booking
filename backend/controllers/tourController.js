import Tour from "../models/tour.model.js";
import TourActivity from "../models/tourActivities.model.js";
import TourImage from "../models/tourImages.model.js";
import Location from "../models/location.model.js";
import Accommodation from "../models/accommodation.model.js";
import Vehicle from "../models/vehicle.model.js";

const TourController = {
    search: (req, res) => {
        const filters = {
            name: req.query.name || null,
            minPrice: req.query.minPrice ? parseFloat(req.query.minPrice) : null,
            maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice) : null,
            sortBy: req.query.sortBy || null, // Sorting criteria: name_asc, name_desc, price_asc, price_desc, rating_asc, rating_desc
        };

        Tour.getTours(filters, (err, tours) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to fetch tours', error: err.message });
            }
            return res.status(200).json({ tours });
        });
    },

    getAllTours: (req, res) => {
        const filters = {
            name: null,
            minPrice: null,
            maxPrice: null,
            sortBy: null,
        };

        Tour.getTours(filters, (err, tours) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to fetch tours', error: err.message });
            }
            return res.status(200).json({ tours });
        });
    },

    createTour: (req, res) => {
        const { name, description, price, capacity, days, date_begin, date_end, tour_guide_id, tour_operator_id, activities, images, locations, accommodations, vehicles } = req.body;
    
        if (!name || !price || !capacity || !days || !date_begin || !date_end) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
    
        const tourData = {
            name,
            description: description || null,
            price,
            capacity,
            days,
            date_begin,
            date_end,
            tour_guide_id,
            tour_operator_id,
        };
    
        Tour.create(tourData, (err, newTour) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to create tour', error: err.message });
            }
    
            // Add activities if provided
            const activityPromises = activities
                ? activities.map(activity =>
                    new Promise((resolve, reject) => {
                        TourActivity.addActivity(newTour.tour_id, activity, err => {
                            if (err) reject(err);
                            else resolve();
                        });
                    })
                )
                : [];
    
            // Add images if provided
            const imagePromises = images
                ? images.map(image =>
                    new Promise((resolve, reject) => {
                        TourImage.addImage(newTour.tour_id, image, err => {
                            if (err) reject(err);
                            else resolve();
                        });
                    })
                )
                : [];
    
            // Add locations if provided
            const locationPromises = locations
                ? locations.map(location =>
                    new Promise((resolve, reject) => {
                        Location.addLocationToTour(location.location_id, newTour.tour_id, err => {
                            if (err) reject(err);
                            else resolve();
                        });
                    })
                )
                : [];
    
            // Add accommodations if provided
            const accommodationPromises = accommodations
                ? accommodations.map(accommodation =>
                    new Promise((resolve, reject) => {
                        Accommodation.addAccommodation(newTour.tour_id, accommodation, err => {
                            if (err) reject(err);
                            else resolve();
                        });
                    })
                )
                : [];

                const vehiclePromises = vehicles
                ? vehicles.map(vehicle =>
                    new Promise((resolve, reject) => {
                        Vehicle.addVehicleToTour(newTour.tour_id, vehicle, err => {
                            if (err) reject(err);
                            else resolve();
                        });
                    })
                )
                : [];
                
            // Wait for all promises to complete
            Promise.all([
                ...activityPromises,
                ...imagePromises,
                ...locationPromises,
                ...accommodationPromises,
                ...vehiclePromises, // Include vehicle promises here
            ])
                .then(() => res.status(201).json({ message: 'Tour created successfully', tour: newTour }))
                .catch(err => res.status(500).json({ message: 'Failed to add related entities', error: err.message }));
        });
    },
    
    updateTour: (req, res) => {
        const tour_id = req.params.tour_id;
        const { tourData, activities, images, locations, accommodations, vehicles } = req.body;
    
        if (!tour_id) {
            return res.status(400).json({ message: 'Tour ID is required' });
        }
    
        Tour.update(tour_id, tourData, err => {
            if (err) {
                return res.status(500).json({ message: 'Failed to update tour', error: err.message });
            }
    
            const updateActivities = () => {
                if (!activities) return Promise.resolve();
    
                return new Promise((resolve, reject) => {
                    TourActivity.getActivitiesByTourId(tour_id, (err, existingActivities) => {
                        if (err) return reject(err);
    
                        const deletePromises = existingActivities.map(activity =>
                            new Promise((resolve, reject) => {
                                TourActivity.deleteActivity(tour_id, activity.tour_activity, err => {
                                    if (err) reject(err);
                                    else resolve();
                                });
                            })
                        );
    
                        Promise.all(deletePromises)
                            .then(() => {
                                const addPromises = activities.map(activity =>
                                    new Promise((resolve, reject) => {
                                        TourActivity.addActivity(tour_id, activity, err => {
                                            if (err) reject(err);
                                            else resolve();
                                        });
                                    })
                                );
    
                                return Promise.all(addPromises);
                            })
                            .then(resolve)
                            .catch(reject);
                    });
                });
            };
    
            const updateImages = () => {
                if (!images) return Promise.resolve();
    
                return new Promise((resolve, reject) => {
                    TourImage.getImagesByTourId(tour_id, (err, existingImages) => {
                        if (err) return reject(err);
    
                        const deletePromises = existingImages.map(image =>
                            new Promise((resolve, reject) => {
                                TourImage.deleteImage(tour_id, image.tour_img, err => {
                                    if (err) reject(err);
                                    else resolve();
                                });
                            })
                        );
    
                        Promise.all(deletePromises)
                            .then(() => {
                                const addPromises = images.map(image =>
                                    new Promise((resolve, reject) => {
                                        TourImage.addImage(tour_id, image, err => {
                                            if (err) reject(err);
                                            else resolve();
                                        });
                                    })
                                );
    
                                return Promise.all(addPromises);
                            })
                            .then(resolve)
                            .catch(reject);
                    });
                });
            };
    
            const updateLocations = () => {
                if (!locations) return Promise.resolve();
    
                return new Promise((resolve, reject) => {
                    Location.getLocationsByTourId(tour_id, (err, existingLocations) => {
                        if (err) return reject(err);
    
                        const deletePromises = existingLocations.map(location =>
                            new Promise((resolve, reject) => {
                                Location.removeLocationFromTour(location.location_id, tour_id, err => {
                                    if (err) reject(err);
                                    else resolve();
                                });
                            })
                        );
    
                        Promise.all(deletePromises)
                            .then(() => {
                                const addPromises = locations.map(location =>
                                    new Promise((resolve, reject) => {
                                        Location.addLocationToTour(location.location_id, tour_id, err => {
                                            if (err) reject(err);
                                            else resolve();
                                        });
                                    })
                                );
    
                                return Promise.all(addPromises);
                            })
                            .then(resolve)
                            .catch(reject);
                    });
                });
            };
    
            const updateAccommodations = () => {
                if (!accommodations) return Promise.resolve();
    
                return new Promise((resolve, reject) => {
                    Accommodation.getAccommodationsByTourId(tour_id, (err, existingAccommodations) => {
                        if (err) return reject(err);
    
                        const deletePromises = existingAccommodations.map(accommodation =>
                            new Promise((resolve, reject) => {
                                Accommodation.deleteAccommodation(tour_id, accommodation.accommodation_id, err => {
                                    if (err) reject(err);
                                    else resolve();
                                });
                            })
                        );
    
                        Promise.all(deletePromises)
                            .then(() => {
                                const addPromises = accommodations.map(accommodation =>
                                    new Promise((resolve, reject) => {
                                        Accommodation.addAccommodation(tour_id, accommodation, err => {
                                            if (err) reject(err);
                                            else resolve();
                                        });
                                    })
                                );
    
                                return Promise.all(addPromises);
                            })
                            .then(resolve)
                            .catch(reject);
                    });
                });
            };
    
            const updateVehicles = () => {
                if (!vehicles) return Promise.resolve();
    
                return new Promise((resolve, reject) => {
                    Vehicle.getVehiclesByTourId(tour_id, (err, existingVehicles) => {
                        if (err) return reject(err);
    
                        const deletePromises = existingVehicles.map(vehicle =>
                            new Promise((resolve, reject) => {
                                Vehicle.deleteVehicle(tour_id, vehicle.vehicle_id, err => {
                                    if (err) reject(err);
                                    else resolve();
                                });
                            })
                        );
    
                        Promise.all(deletePromises)
                            .then(() => {
                                const addPromises = vehicles.map(vehicle =>
                                    new Promise((resolve, reject) => {
                                        Vehicle.addVehicle(tour_id, vehicle, err => {
                                            if (err) reject(err);
                                            else resolve();
                                        });
                                    })
                                );
    
                                return Promise.all(addPromises);
                            })
                            .then(resolve)
                            .catch(reject);
                    });
                });
            };
    
            Promise.all([updateActivities(), updateImages(), updateLocations(), updateAccommodations(), updateVehicles()])
                .then(() => res.status(200).json({ message: 'Tour updated successfully' }))
                .catch(err => res.status(500).json({ message: 'Failed to update activities, images, locations, accommodations, or vehicles', error: err.message }));
        });
    },

    deleteTour: (req, res) => {
        const tour_id = req.params.tour_id;

        if (!tour_id) {
            return res.status(400).json({ message: 'Tour ID is required' });
        }

        Tour.delete(tour_id, err => {
            if (err) {
                return res.status(500).json({ message: 'Failed to delete tour', error: err.message });
            }

            res.status(200).json({ message: 'Tour deleted successfully' });
        });
    },

    getActivities: (req, res) => {
        const tour_id = req.params.tour_id;

        if (!tour_id) {
            return res.status(400).json({ message: 'Tour ID is required' });
        }

        TourActivity.getActivitiesByTourId(tour_id, (err, activities) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to fetch activities', error: err.message });
            }

            res.status(200).json({ activities });
        });
    },

    addActivity: (req, res) => {
        const tour_id = req.params.tour_id;
        const { activity } = req.body;

        if (!tour_id || !activity) {
            return res.status(400).json({ message: 'Tour ID and activity are required' });
        }

        TourActivity.addActivity(tour_id, activity, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to add activity', error: err.message });
            }

            res.status(201).json({ message: 'Activity added successfully' });
        });
    },

    deleteActivity: (req, res) => {
        const tour_id = req.params.tour_id;
        const { activity } = req.body;

        if (!tour_id || !activity) {
            return res.status(400).json({ message: 'Tour ID and activity are required' });
        }

        TourActivity.deleteActivity(tour_id, activity, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to delete activity', error: err.message });
            }

            res.status(200).json({ message: 'Activity deleted successfully' });
        });
    },

    getImages: (req, res) => {
        const tour_id = req.params.tour_id;

        if (!tour_id) {
            return res.status(400).json({ message: 'Tour ID is required' });
        }

        TourImage.getImagesByTourId(tour_id, (err, images) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to fetch images', error: err.message });
            }

            res.status(200).json({ images });
        });
    },

    addImage: (req, res) => {
        const tour_id = req.params.tour_id;
        const { image } = req.body;

        if (!tour_id || !image) {
            return res.status(400).json({ message: 'Tour ID and image are required' });
        }

        TourImage.addImage(tour_id, image, err => {
            if (err) {
                return res.status(500).json({ message: 'Failed to add image', error: err.message });
            }

            res.status(201).json({ message: 'Image added successfully' });
        });
    },

    deleteImage: (req, res) => {
        const tour_id = req.params.tour_id;
        const { image } = req.body;

        if (!tour_id || !image) {
            return res.status(400).json({ message: 'Tour ID and image are required' });
        }

        TourImage.deleteImage(tour_id, image, err => {
            if (err) {
                return res.status(500).json({ message: 'Failed to delete image', error: err.message });
            }

            res.status(200).json({ message: 'Image deleted successfully' });
        });
    },

    removeLocations: (req, res) => {
        const { tour_id } = req.params;
        const { location_id } = req.body; // Expecting an array of location_ids

        if (!tour_id || !location_id || location_id.length === 0) {
            return res.status(400).json({ message: 'Tour ID and location IDs are required' });
        }

        Location.removeLocationFromTour(location_id, tour_id, err => {
            if (err) {
                return res.status(500).json({ message: 'Failed to delete location', error: err.message });
            }

            res.status(200).json({ message: 'Location deleted successfully' });
        });
    },

    // Get all locations by tour ID
    getLocationsByTourId: (req, res) => {
        const { tour_id } = req.params;

        if (!tour_id) {
            return res.status(400).json({ message: 'Tour ID is required' });
        }

        Location.getLocationsByTourId(tour_id, (err, locations) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to fetch locations', error: err.message });
            }

            return res.status(200).json({ locations });
        });
    },

    // Update a location for a tour
    updateLocation: (req, res) => {
        const { tour_id, location_id } = req.params;
        const updatedData = req.body;

        if (!tour_id || !location_id || !updatedData) {
            return res.status(400).json({ message: 'Tour ID, location ID, and updated data are required' });
        }

        Location.updateLocationByTourId(tour_id, updatedData, (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to update location', error: err.message });
            }

            return res.status(200).json({ message: 'Location updated successfully', result });
        });
    },

    removeAccommodations: (req, res) => {
        const { tour_id } = req.params;
        const { accommodation_id } = req.body; // Expecting an array of location_ids

        if (!tour_id || !accommodation_id || accommodation_id.length === 0) {
            return res.status(400).json({ message: 'Tour ID and accommodation IDs are required' });
        }

        Accommodation.removeAccommodationFromTour(accommodation_id, tour_id, err => {
            if (err) {
                return res.status(500).json({ message: 'Failed to delete accommodation', error: err.message });
            }

            res.status(200).json({ message: 'Accommodation deleted successfully' });
        });
    },

    // Get all accommodations by tour ID
    getAccommodationByTourId: (req, res) => {
        const { tour_id } = req.params;

        if (!tour_id) {
            return res.status(400).json({ message: 'Tour ID is required' });
        }

        Accommodation.getAccommodationsByTourId(tour_id, (err, accommodations) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to fetch accommodations', error: err.message });
            }

            return res.status(200).json({ accommodations });
        });
    },

    // Update a accommodation for a tour
    updateAccommodations: (req, res) => {
        const { tour_id, accommodation_id } = req.params;
        const updatedData = req.body;

        if (!tour_id || !accommodation_id || !updatedData) {
            return res.status(400).json({ message: 'Tour ID, accommodation ID, and updated data are required' });
        }

        Accommodation.updateByTourId(tour_id, updatedData, (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to update accommodation', error: err.message });
            }

            return res.status(200).json({ message: 'Accommodation updated successfully', result });
        });
    },

    removeVehicles: (req, res) => {
        const { tour_id } = req.params;
        const { vehicle_id } = req.body; // Expecting an array of location_ids

        if (!tour_id || !vehicle_id || vehicle_id.length === 0) {
            return res.status(400).json({ message: 'Tour ID and vehicle IDs are required' });
        }

        Vehicle.removeVehicleFromTour(vehicle_id, tour_id, err => {
            if (err) {
                return res.status(500).json({ message: 'Failed to delete vehicle', error: err.message });
            }

            res.status(200).json({ message: 'Vehicle deleted successfully' });
        });
    },

    // Get all locations by tour ID
    getVehiclesByTourId: (req, res) => {
        const { tour_id } = req.params;

        if (!tour_id) {
            return res.status(400).json({ message: 'Tour ID is required' });
        }

        Vehicle.getVehiclesByTourId(tour_id, (err, vehicles) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to fetch locations', error: err.message });
            }

            return res.status(200).json({ vehicles });
        });
    },

    // Update a location for a tour
    updateVehicles: (req, res) => {
        const { tour_id, vehicle_id } = req.params;
        const updatedData = req.body;

        if (!tour_id || !vehicle_id || !updatedData) {
            return res.status(400).json({ message: 'Tour ID, vehicle ID, and updated data are required' });
        }

        Vehicle.updateByTourId(tour_id, updatedData, (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to update vehicle', error: err.message });
            }

            return res.status(200).json({ message: 'Vehicle updated successfully', result });
        });
    },
};

export default TourController;
