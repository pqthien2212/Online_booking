import Cancellation from "../models/cancellation.model.js";

const CancellationController = {
  // Create a new cancellation
  createCancellation: (req, res) => {
    const { booking_id, refund_amount, cancel_status } = req.body;
    const client_id = req.params.client_id; // Assuming client_id comes from the route parameter

    // Validate required fields
    if (!booking_id || !refund_amount || !cancel_status || !client_id) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Call the Cancellation model's create method to process the cancellation
    Cancellation.create({ booking_id, refund_amount, cancel_status, client_id }, (err, result) => {
      if (err) {
        console.error("Error during cancellation:", err);
        return res.status(500).json({ message: err.message || "Failed to process cancellation" });
      }

      // Return success response
      return res.status(201).json({
        message: "Booking canceled successfully",
        cancellation_id: result.cancellation_id, // Assuming result contains cancellation_id
      });
    });
  },

  // Get cancellation details by booking_id
  getCancellationByBookingId: (req, res) => {
    const { booking_id } = req.params;

    // Validate booking_id
    if (!booking_id) {
      return res.status(400).json({ message: "Booking ID is required" });
    }

    // Call the Cancellation model's getCancellationByBookingId method
    Cancellation.getCancellationByBookingId(booking_id, (err, cancellation) => {
      if (err) {
        console.error("Error fetching cancellation details:", err);
        return res.status(500).json({ message: err.message || "Failed to fetch cancellation details" });
      }

      if (cancellation) {
        return res.status(200).json({ cancellation });
      }

      return res.status(404).json({ message: "No cancellation found for this booking" });
    });
  },

  // Get all cancellations for a specific client
  getCancellationsByClientId: (req, res) => {
    const { client_id } = req.params;

    // Validate client_id
    if (!client_id) {
      return res.status(400).json({ message: "Client ID is required" });
    }

    // Call the Cancellation model's getCancellationsByClientId method
    Cancellation.getCancellationsByClientId(client_id, (err, cancellations) => {
      if (err) {
        console.error("Error fetching cancellations:", err);
        return res.status(500).json({ message: err.message || "Failed to fetch cancellations" });
      }

      if (cancellations && cancellations.length > 0) {
        return res.status(200).json({ cancellations });
      }

      return res.status(404).json({ message: "No cancellations found for this client" });
    });
  },
};

export default CancellationController;
