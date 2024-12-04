import db from '../config/database.js';

class Cancellation {
  constructor(cancel) {
    this.id = cancel.cancel_id;
    this.date = cancel.cancel_date;
    this.status = cancel.cancel_status;
    this.refund_amount = cancel.refund_amount;
    this.booking_id = cancel.booking_id;
    this.client_id = cancel.client_id;
  }

  // Create a new cancellation record
  static create({ booking_id, refund_amount, cancel_status, client_id }, result) {
    // Call the stored procedure to cancel the booking
    const query = `CALL cancel_booking(?, ?, ?, ?)`;
    const values = [booking_id, refund_amount, cancel_status, client_id];

    db.query(query, values, (err, res) => {
      if (err) {
        console.error('Error during cancellation process:', err);
        return result({ message: 'Error during cancellation', error: err }, null);
      }

      // If successful, return the result
      return result(null, {
        message: 'Booking canceled successfully',
        cancellation_id: res[0][0].cancel_id, // Assuming stored procedure returns cancel_id
      });
    });
  }

  // Get cancellation details by booking_id
  static getCancellationByBookingId(booking_id, result) {
    const query = 'SELECT * FROM cancellation WHERE booking_id = ?';
    const value = [booking_id];

    db.query(query, value, (err, res) => {
      if (err) {
        console.error('Error fetching cancellation details:', err);
        return result({ message: 'Error fetching cancellation details', error: err }, null);
      }

      if (res.length) {
        const cancellation = new Cancellation(res[0]);
        return result(null, cancellation);
      }

      return result({ message: 'No cancellation found for this booking' }, null);
    });
  }

  // Get all cancellations for a client
  static getCancellationsByClientId(client_id, result) {
    const query = 'SELECT * FROM cancellation WHERE client_id = ?';
    const value = [client_id];

    db.query(query, value, (err, res) => {
      if (err) {
        console.error('Error fetching cancellations for client:', err);
        return result({ message: 'Error fetching cancellations', error: err }, null);
      }

      if (res.length) {
        const cancellations = res.map(c => new Cancellation(c));
        return result(null, cancellations);
      }

      return result({ message: 'No cancellations found for this client' }, null);
    });
  } 

}

export default Cancellation;
