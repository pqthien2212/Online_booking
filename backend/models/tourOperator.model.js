import db from '../config/database.js'; 

class TourOperator {
    // Just from the database
  constructor(tour_operator) {
    this.id = tour_operator.user_id;
    this.type = tour_operator.to_type;
  }

  static getTourOperatorById(id, result) {
    const query = 'SELECT * FROM tour_operator WHERE user_id = ?';
    const value = id;

    db.query(query, value, (err, res) => {
        if (err) {
            console.error('Database error:', err);
            return result(err, null); // Pass the error to the callback
        }
        if (res.length) {
            const user = new TourOperator(res[0]);
            console.log(res[0]);
            return result(null, user); // Client found
        }
        return result(null, null); // No client found
    });
  }

  static update(user_id, userData, result) {
    let query = 'UPDATE tour_operator SET ';
    const values = [];
  
    // Dynamically add fields to update based on userData
    if (userData.to_type) {
        query += 'to_type = ?, ';
        values.push(userData.to_type);
    }
  
    // Validate that at least one field is provided for update
    if (values.length === 0) {
        return result({ message: 'No valid fields to update' }, null);
    }

    // Remove the trailing comma and space
    query = query.slice(0, -2);
  
    // Add the WHERE clause to ensure we're updating the correct user record
    query += ' WHERE user_id = ?';
    values.push(user_id); // Add user_id to the query values
  
    // Execute the query
    db.query(query, values, (err, res) => {
        if (err) {
            console.error(`Database error while updating tour operator with user_id ${user_id}:`, err);
            return result({ message: 'Failed to update tour operator', error: err }, null);
        }
    
        // If no rows are affected, it means the user_id was not found
        if (res.affectedRows === 0) {
            return result({ message: 'Tour operator not found' }, null);
        }
  
        const updated = {
            user_id: user_id,
            ...userData // Include the updated fields in the response
        };

        return result(null, { message: 'Tour operator updated successfully', updated });
    });
  }

}

export default TourOperator; 
