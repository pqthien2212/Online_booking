import db from '../config/database.js'; 

class Admin {
    // Just from the database
  constructor(admin) {
    this.id = admin.user_id;
    this.level = admin.level;
  }

    static getAdminById(id, result) {
        const query = 'SELECT * FROM administrator WHERE user_id = ?';
        const value = id;

        db.query(query, value, (err, res) => {
            if (err) {
                console.error('Database error:', err);
                return result(err, null); // Pass the error to the callback
            }
            if (res.length) {
                const user = new Admin(res[0]);
                console.log(res[0]);
                return result(null, user); // admin found
            }
            return result(null, null); // No admin found
        });
    }

    static update(user_id, userData, result) {
        
        let query = 'UPDATE administator SET ';
        const values = [];
      
        // Dynamically add fields to update based on userData
        if (userData.level) {
          query += 'level = ?, ';
          values.push(userData.level);
        }
        
        if (values.length === 0) {
            return result({ message: 'No valid fields to update' }, null);
        }
        
        // Remove the trailing comma and space
        query = query.slice(0, -2);
      
        // Add the WHERE clause to ensure we're updating the correct user contact info
        query += ' WHERE user_id = ?';
        values.push(user_id); // Add user_id to the query values
      
        // Execute the query
        db.query(query, values, (err, res) => {
            if (err) {
                console.error('Database error:', err);
                return result({ message: 'Failed to update admin level', error: err }, null);
            }
        
            // If no rows are affected, it means the contact info with the specified user_id was not found
            if (res.affectedRows === 0) {
                return result({ message: 'Admin not found' }, null);
            }
      
            const updated = {
                user_id: user_id,
                ...userData // Merge the updated fields from userData
            };

            return result(null, { message: 'Admin level updated successfully', updated });

        });
    }  
}

export default Admin; 
