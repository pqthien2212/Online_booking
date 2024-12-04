import Payment from '../models/payment.model.js';

// Create a new payment

const PaymentController = {

    createPayment: (req, res) => {
      const paymentData = {
        payment_date: req.body.payment_date,
        payment_method: req.body.payment_method,
        client_id: req.body.client_id,
        booking_id: req.body.booking_id
      };
    
      // Call the model's create function
      Payment.create(paymentData, (err, result) => {
        if (err) {
          return res.status(500).json(err); // If there’s an error, return a 500 status code with the error message
        }
        return res.status(201).json(result); // Return the success message with a 201 status code
      });
    },
    
    // Update payment status (Completed or Cancelled)
    updatePaymentStatus: (req, res) => {
      const payment_id = req.params.payment_id;
      const { status } = req.body;
    
      // Validate the payment status
      if (!['Completed', 'Cancelled'].includes(status)) {
        return res.status(400).json({ message: 'Invalid payment status. Valid values are "Completed" or "Cancelled".' });
      }
    
      // Call the model's update function
      Payment.updatePaymentStatus(payment_id, status, (err, result) => {
        if (err) {
          return res.status(500).json(err); // If there’s an error, return a 500 status code with the error message
        }
        return res.status(200).json(result); // Return the success message with a 200 status code
      });
    },
    
    // Get payment details by payment ID
    getPaymentById: (req, res) => {
      const payment_id = req.params.payment_id;
    
      // Call the model's function to get the payment
      Payment.getPaymentById(payment_id, (err, result) => {
        if (err) {
          return res.status(500).json(err); // If there’s an error, return a 500 status code with the error message
        }
        if (!result) {
          return res.status(404).json({ message: 'Payment not found.' }); // Return 404 if payment is not found
        }
        return res.status(200).json(result); // Return the payment details
      });
    },
    
    // Get all payments by client ID
    getPaymentsByClientId: (req, res) => {
      const client_id = req.params.client_id;
    
      // Call the model's function to get payments by client ID
      Payment.getPaymentsByClientId(client_id, (err, result) => {
        if (err) {
          return res.status(500).json(err); // If there’s an error, return a 500 status code with the error message
        }
        if (result.length === 0) {
          return res.status(404).json({ message: 'No payments found for this client.' }); // Return 404 if no payments are found
        }
        return res.status(200).json(result); // Return the list of payments
      });
    },
    
    // Get all payments by booking ID
    getPaymentsByBookingId: (req, res) => {
      const booking_id = req.params.booking_id;
    
      // Call the model's function to get payments by booking ID
      Payment.getPaymentsByBookingId(booking_id, (err, result) => {
        if (err) {
          return res.status(500).json(err); // If there’s an error, return a 500 status code with the error message
        }
        if (result.length === 0) {
          return res.status(404).json({ message: 'No payments found for this booking.' }); // Return 404 if no payments are found
        }
        return res.status(200).json(result); // Return the list of payments
      });
    },
}

export default PaymentController;
