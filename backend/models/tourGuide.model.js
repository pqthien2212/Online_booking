import db from '../config/database.js'; 

class TourGuide {
    // Just from the database
  constructor(tour_guide) {
    this.id = tour_guide.user_id;
    this.description = tour_guide.description;
  }

  static getTourGuideById (id, result) {
    const query = 'SELECT * FROM tour_guide WHERE user_id = ?';
    const value = id;

    db.query(query, value, (err, res) => {
        if (err) {
            console.error('Database error:', err);
            return result(err, null);
        }
        if (res.length) {
            const user = new TourGuide (res[0]);
            console.log(res[0]);
            return result(null, user); // Tour guide found
        }
        return result(null, null); // No tour guide found
    })
  }

    static update(user_id, userData, result) {
        let query = 'UPDATE tour_guide SET ';
        const values = [];
    
        // Dynamically add fields to update based on userData
        if (userData.description) {
            query += 'description = ?, ';
            values.push(userData.description);
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
                console.error(`Database error while updating tour guide with user_id ${user_id}:`, err);
                return result({ message: 'Failed to update tour guide', error: err }, null);
            }
        
            // If no rows are affected, it means the user_id was not found
            if (res.affectedRows === 0) {
                return result({ message: 'Tour guide not found' }, null);
            }
    
            const updated = {
                user_id: user_id,
                ...userData // Include the updated fields in the response
            };

            return result(null, { message: 'Tour guide updated successfully', updated });
        });
    }
}

export default TourGuide; 
