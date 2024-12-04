import db from '../config/database.js';

class Payment {
  constructor(payment) {
    this.id = payment.payment_id;
    this.date = payment.payment_date;
    this.amount = payment.amount;
    this.method = payment.payment_method;
    this.status = payment.payment_status;
    this.client_id = payment.client_id;
    this.booking_id = payment.booking_id;
  }

  // Create a new payment with status "Pending" and amount equal to the tour price
  static create(paymentData, result) {
    const { payment_date, payment_method, client_id, booking_id } = paymentData;

    // Get the price of the tour from the booking ID
    const query = `
      SELECT t.price 
      FROM tour t
      JOIN booking b ON t.tour_id = b.tour_id
      WHERE b.booking_id = ?`;
    
    db.query(query, [booking_id], (err, res) => {
      if (err) {
        console.error('Error retrieving tour price:', err);
        return result({ message: 'Failed to retrieve tour price', error: err }, null);
      }

      if (res.length === 0) {
        return result({ message: 'Tour not found for the provided booking' }, null);
      }

      const amount = res[0].price;
      const payment_status = 'Pending'; // Initial status is 'Pending'

      // Insert the payment record
      const insertQuery = `
        INSERT INTO payment (payment_date, amount, payment_method, payment_status, client_id, booking_id)
        VALUES (?, ?, ?, ?, ?, ?)`;

      const values = [payment_date, amount, payment_method, payment_status, client_id, booking_id];

      db.query(insertQuery, values, (err, res) => {
        if (err) {
          console.error('Error creating payment:', err);
          return result({ message: 'Failed to create payment', error: err }, null);
        }
        return result(null, { message: 'Payment created successfully', payment_id: res.insertId });
      });
    });
  }

  // Update payment status to "Completed" or "Cancelled" and update corresponding booking status
  static updatePaymentStatus(payment_id, status, result) {
    let booking_status = '';
    
    // Determine the booking status based on the payment status
    if (status === 'Completed') {
      booking_status = 'Confirmed';
    } else if (status === 'Cancelled') {
      booking_status = 'Cancelled';
    } else {
      return result({ message: 'Invalid payment status' }, null);
    }

    // Update payment status and booking status
    const query = `
      UPDATE payment p
      JOIN booking b ON p.booking_id = b.booking_id
      SET p.payment_status = ?, b.booking_status = ?
      WHERE p.payment_id = ?`;

    db.query(query, [status, booking_status, payment_id], (err, res) => {
      if (err) {
        console.error('Error updating payment and booking status:', err);
        return result({ message: 'Failed to update payment status', error: err }, null);
      }
      if (res.affectedRows === 0) {
        return result({ message: 'Payment or booking not found' }, null);
      }
      return result(null, { message: 'Payment and booking status updated successfully', payment_id: payment_id });
    });
  }

  // Get payment by ID
  static getPaymentById(payment_id, result) {
    const query = 'SELECT * FROM payment WHERE payment_id = ?';
    const values = [payment_id];

    db.query(query, values, (err, res) => {
      if (err) {
        console.error('Error fetching payment by ID:', err);
        return result({ message: 'Failed to fetch payment', error: err }, null);
      }
      if (res.length) {
        const payment = new Payment(res[0]);
        return result(null, payment);
      }
      return result({ message: 'Payment not found' }, null);
    });
  }

  // Get payments by client ID
  static getPaymentsByClientId(client_id, result) {
    const query = 'SELECT * FROM payment WHERE client_id = ?';
    const values = [client_id];

    db.query(query, values, (err, res) => {
      if (err) {
        console.error('Error fetching payments:', err);
        return result({ message: 'Failed to fetch payments', error: err }, null);
      }
      if (res.length > 0) {
        const payments = res.map(payment => new Payment(payment)); // Map each row to a Payment instance
        return result(null, payments);
      }
      return result({ message: 'No payments found for this client' }, null);
    });
  }

  // Get payments by booking ID
  static getPaymentsByBookingId(booking_id, result) {
    const query = 'SELECT * FROM payment WHERE booking_id = ?';
    const values = [booking_id];

    db.query(query, values, (err, res) => {
      if (err) {
        console.error('Error fetching payments by booking ID:', err);
        return result({ message: 'Failed to fetch payments', error: err }, null);
      }
      if (res.length > 0) {
        const payments = res.map(payment => new Payment(payment)); // Map each row to a Payment instance
        return result(null, payments);
      }
      return result({ message: 'No payments found for this booking' }, null);
    });
  }
}

export default Payment;
