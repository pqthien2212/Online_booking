import db from '../config/database.js'; // Ensure to include the correct file extension

class Tour {
  constructor(tour) {
    this.id = tour.tour_id;
    this.name = tour.tour_name;
    this.description = tour.tour_description;
    this.price = tour.price;
    this.capacity = tour.capacity;
    this.days = tour.days;
    this.date_begin = tour.date_begin;
    this.date_end = tour.date_end;
    this.tour_guide_id = tour.tg_id;
    this.tour_operator_id = tour.to_id;
    this.avg_rating = tour.avg_rating || null; // Average rating
  }

  /**
   * Search tours based on filters and sorting
   * @param {Object} filters - Filters and sorting options.
   * @param {Function} result - Callback to handle the result.
   */
  static getTours(filters, result) {
    let query = `
      SELECT 
        t.*, 
        ROUND(AVG(r.rating),1) AS avg_rating 
      FROM tour t
      LEFT JOIN reviews r ON t.tour_id = r.tour_id 
      WHERE 1=1
    `;
    const values = [];

    // Filtering logic
    if (filters.name) {
      query += ' AND t.tour_name LIKE ?';
      values.push(`%${filters.name}%`);
    }

    if (filters.minPrice) {
      query += ' AND t.price >= ?';
      values.push(filters.minPrice);
    }

    if (filters.maxPrice) {
      query += ' AND t.price <= ?';
      values.push(filters.maxPrice);
    }

    // Grouping to calculate average ratings
    query += ' GROUP BY t.tour_id';

    // Sorting logic
    if (filters.sortBy) {
      switch (filters.sortBy.toLowerCase()) {
        case 'name_asc':
          query += ' ORDER BY t.tour_name ASC';
          break;
        case 'name_desc':
          query += ' ORDER BY t.tour_name DESC';
          break;
        case 'price_asc':
          query += ' ORDER BY t.price ASC';
          break;
        case 'price_desc':
          query += ' ORDER BY t.price DESC';
          break;
        case 'rating_asc':
          query += ' ORDER BY avg_rating ASC';
          break;
        case 'rating_desc':
          query += ' ORDER BY avg_rating DESC';
          break;
        default:
          break; // No sorting if invalid parameter
      }
    }

    db.query(query, values, (err, res) => {
      if (err) {
        console.error('Database error:', err);
        return result(err, null);
      }
      const tours = res.map(row => new Tour(row)); // Map results to Tour instances
      return result(null, tours);
    });
  }

  static create(tourData, result) {  
    // Prepare the SQL query to insert the new tour
    let query = `
      INSERT INTO tour (tour_name, tour_description, price, capacity, days, date_begin, date_end, tg_id, to_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    // Values for the query based on the tourData input
    const values = [
      tourData.name, 
      tourData.description || null,  // Optional field
      tourData.price,
      tourData.capacity,
      null, // days
      null, // date_begin
      null, // date_end
      tourData.tour_guide_id,   // Make sure this field is correctly mapped
      tourData.tour_operator_id // Make sure this field is correctly mapped
    ];
  
    // Execute the query
    db.query(query, values, (err, res) => {
      if (err) {
        console.error('Database error:', err);
        return result({ message: 'Failed to create tour', error: err }, null);
      }
  
      // If the insertion is successful, return the inserted tour with the generated ID
      const newTour = new Tour({
        tour_id: res.insertId,  // Assuming the database is using auto-increment for the `tour_id`
        ...tourData
      });
  
      return result(null, newTour);
    });
  }
  
  static update(tour_id, tourData, result) {
    // Ensure tour_id is provided for updating the correct tour
    if (!tour_id) {
      return result({ message: 'Tour ID is required for update' }, null);
    }
  
    // Start building the UPDATE query
    let query = 'UPDATE tour SET ';
    const values = [];
  
    // Dynamically add fields to update
    if (tourData.name) {
      query += 'tour_name = ?, ';
      values.push(tourData.name);
    }
    if (tourData.description) {
      query += 'tour_description = ?, ';
      values.push(tourData.description);
    }
    if (tourData.price) {
      query += 'price = ?, ';
      values.push(tourData.price);
    }
    if (tourData.capacity) {
      query += 'capacity = ?, ';
      values.push(tourData.capacity);
    }
    if (tourData.tour_guide_id) {
      query += 'tg_id = ?, ';
      values.push(tourData.tour_guide_id);
    }
    if (tourData.tour_operator_id) {
      query += 'to_id = ?, ';
      values.push(tourData.tour_operator_id);
    }
  
    // Remove the trailing comma and space
    query = query.slice(0, -2);
  
    // Add the WHERE clause to ensure we're updating the correct tour
    query += ' WHERE tour_id = ?';
    values.push(tour_id); // Add tour_id to the query values
  
    // Execute the query
    db.query(query, values, (err, res) => {
      if (err) {
        console.error('Database error:', err);
        return result({ message: 'Failed to update tour', error: err }, null);
      }
  
      // If no rows are affected, it means the tour with the specified ID was not found
      if (res.affectedRows === 0) {
        return result({ message: 'Tour not found' }, null);
      }
  
      // Optionally, query the updated tour data to return a consistent result with the database
      const updatedTour = {
        tour_id: tour_id,
        ...tourData // Merge the updated fields from tourData
      };
  
      // Return the updated tour data
      return result(null, { message: 'Tour updated successfully', updatedTour });
    });
  }

  static delete(tour_id, result) {
    // Ensure tour_id is provided for deleting the correct tour
    if (!tour_id) {
      return result({ message: 'Tour ID is required for deletion' }, null);
    }
  
    // Prepare the DELETE query
    const query = 'DELETE FROM tour WHERE tour_id = ?';
  
    // Execute the DELETE query
    db.query(query, [tour_id], (err, res) => {
      if (err) {
        console.error('Database error:', err);
        return result({ message: 'Failed to delete tour', error: err }, null);
      }
  
      // If no rows are affected, it means the tour with the specified ID was not found
      if (res.affectedRows === 0) {
        return result({ message: 'Tour not found' }, null);
      }
  
      // Return a success message
      return result(null, { message: 'Tour deleted successfully' });
    });
  }

}

export default Tour;
