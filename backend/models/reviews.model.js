import db from '../config/database.js'; 

class Reviews {
  constructor(reviews) {
    this.id = reviews.reviews_id;
    this.tour_id = reviews.tour_id;
    this.client_id = reviews.client_id;
    this.rating = reviews.rating;
    this.comment = reviews.comment;
    this.date = reviews.date_review;
  }

  static getByTourId({ tour_id, order = 'ASC' }, result) {
    // Validate order parameter to avoid SQL injection
    if (!['ASC', 'DESC'].includes(order.toUpperCase())) {
      return result(new Error('Invalid sorting order'), null);
    }

    const query = `
      SELECT * 
      FROM reviews 
      WHERE tour_id = ? 
      ORDER BY date_review ${order.toUpperCase()}
    `;
    const values = [tour_id];

    db.query(query, values, (err, res) => {
      if (err) {
        console.error('Database error:', err);
        return result(err, null);
      }
      const reviews = res.map(row => new Reviews(row));
      return result(null, reviews);
    });
  }

  static create(reviewData, result) {
    const { tour_id, client_id, rating, comment, date_review } = reviewData;

    // SQL query to insert a new review
    const query = `
      INSERT INTO reviews (tour_id, client_id, rating, comment, date_review)
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [tour_id, client_id, rating, comment, date_review];

    // Execute the query
    db.query(query, values, (err, res) => {
      if (err) {
        console.error('Database error:', err);
        return result(err, null);
      }
      console.log('Review created successfully:', res);
      return result(null, { review_id: res.insertId });
    });
  }

  static delete(review_id, result) {
    const query = `DELETE FROM reviews WHERE reviews_id = ?`;
    const values = [review_id];

    db.query(query, values, (err, res) => {
      if (err) {
        console.error('Database error:', err);
        return result(err, null);
      }

      if (res.affectedRows === 0) {
        return result(new Error('No review found with the given ID'), null);
      }

      console.log('Review deleted successfully:', res);
      return result(null, { message: 'Review deleted successfully' });
    });
  }
}

export default Reviews;
