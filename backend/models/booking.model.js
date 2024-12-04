import db from '../config/database.js';

class Booking {
  constructor(booking) {
    this.id = booking.booking_id;
    this.date = booking.booking_date;
    this.status = booking.booking_status;
    this.participantNumber = booking.participant_no;
    this.tour_id = booking.tour_id;
    this.client_id = booking.client_id;
  }

  // Create a new booking with status as 'Pending' and booking_date as current date (YYYY-MM-DD)
  static create(bookingData, result) {
    const { tour_id, client_id } = bookingData;
    const booking_status = 'Pending'; // Initial status is 'Pending'
    
    // Get current date in 'YYYY-MM-DD' format
    const booking_date = new Date().toISOString().slice(0, 10); // Slice to 'YYYY-MM-DD'

    const query = `INSERT INTO booking (booking_date, booking_status, tour_id, client_id) 
                   VALUES (?, ?, ?, ?)`;
    const values = [booking_date, booking_status, tour_id, client_id];

    db.query(query, values, (err, res) => {
      if (err) {
        console.error('Error creating booking:', err);
        return result({ message: 'Failed to create booking', error: err }, null);
      }
      return result(null, { message: 'Booking created successfully', booking_id: res.insertId });
    });
  }

  // Fetch all bookings
  static getAllBookings(result) {
    const query = 'SELECT * FROM booking';

    db.query(query, (err, res) => {
      if (err) {
        console.error('Error fetching bookings:', err);
        return result({ message: 'Failed to fetch bookings', error: err }, null);
      }
      return result(null, res);
    });
  }

  // Get bookings by client_id
  static getBookingByClientId(client_id, result) {
    const query = 'SELECT * FROM booking WHERE client_id = ?';
    const value = client_id;

    db.query(query, value, (err, res) => {
      if (err) {
        console.error('Database error while fetching bookings:', err);
        return result({ message: 'Failed to fetch bookings', error: err }, null);
      }
      if (res.length > 0) {
        const bookings = res.map(booking => new Booking(booking)); // Map each row to a Booking instance
        return result(null, bookings); // Return the list of bookings
      }
      return result({ message: 'No bookings found for this client' }, null);
    });
  }

  // Fetch booking by booking_id
  static getBookingById(booking_id, result) {
    const query = 'SELECT * FROM booking WHERE booking_id = ?';
    const values = [booking_id];

    db.query(query, values, (err, res) => {
      if (err) {
        console.error('Error fetching booking by ID:', err);
        return result({ message: 'Failed to fetch booking', error: err }, null);
      }
      if (res.length) {
        const booking = new Booking(res[0]);
        return result(null, booking);
      }
      return result({ message: 'Booking not found' }, null);
    });
  }

  // Update booking status
  static updateBookingStatus(booking_id, status, result) {
    const query = 'UPDATE booking SET booking_status = ? WHERE booking_id = ?';
    const values = [status, booking_id];

    db.query(query, values, (err, res) => {
      if (err) {
        console.error('Error updating booking status:', err);
        return result({ message: 'Failed to update booking status', error: err }, null);
      }
      if (res.affectedRows === 0) {
        return result({ message: 'Booking not found' }, null);
      }
      return result(null, { message: 'Booking status updated successfully', booking_id: booking_id });
    });
  }
}

export default Booking;
