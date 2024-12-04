import Booking from "../models/booking.model.js";

const BookingController = {
  // Create a booking
  createBooking: (req, res) => {
    const { tour_id } = req.body; // Only tour_id is passed in the body
    const { client_id } = req.params; // Get client_id from URL parameters
    
    // Validate required fields
    if (!tour_id || !client_id) {
      return res.status(400).json({ message: "Tour ID and Client ID are required" });
    }

    // Create the booking data object
    const bookingData = { tour_id, client_id };

    // Call the model to create the booking
    Booking.create(bookingData, (err, result) => {
      if (err) {
        console.error('Error creating booking:', err);
        return res.status(500).json({ message: err.message || 'Failed to create booking' });
      }

      return res.status(201).json(result); // Return the result (including the booking ID)
    });
  },

  // Get bookings by client_id
  getBookingsByClientId: (req, res) => {
    const { client_id } = req.params;
    
    // Validate client_id
    if (!client_id) {
      return res.status(400).json({ message: "Client ID is required" });
    }

    // Call the model to fetch bookings by client_id
    Booking.getBookingByClientId(client_id, (err, bookings) => {
      if (err) {
        console.error('Error fetching bookings:', err);
        return res.status(500).json({ message: err.message || 'Failed to fetch bookings' });
      }

      if (bookings && bookings.length > 0) {
        return res.status(200).json({ bookings });
      }

      return res.status(404).json({ message: 'No bookings found for this client' });
    });
  },

  // Fetch a booking by booking_id
  getBookingById: (req, res) => {
    const { booking_id } = req.params;
    
    // Validate booking_id
    if (!booking_id) {
      return res.status(400).json({ message: "Booking ID is required" });
    }

    // Call the model to fetch the booking by booking_id
    Booking.getBookingById(booking_id, (err, booking) => {
      if (err) {
        console.error('Error fetching booking:', err);
        return res.status(500).json({ message: err.message || 'Failed to fetch booking' });
      }

      if (booking) {
        return res.status(200).json({ booking });
      }

      return res.status(404).json({ message: 'Booking not found' });
    });
  },

  // Update booking status
  updateBookingStatus: (req, res) => {
    const { booking_id } = req.params.booking_id;
    const { status } = req.body;

    // Validate booking_id and status
    if (!booking_id || !status) {
      return res.status(400).json({ message: "Booking ID and status are required" });
    }

    // Call the model to update the booking status
    Booking.updateBookingStatus(booking_id, status, (err, result) => {
      if (err) {
        console.error('Error updating booking status:', err);
        return res.status(500).json({ message: err.message || 'Failed to update booking status' });
      }

      return res.status(200).json(result); // Return the result of the update
    });
  },
};

export default BookingController;
