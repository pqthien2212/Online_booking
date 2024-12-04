import db from '../config/database.js'; 

class Client {
    // Just from the database
    constructor(client) {
        this.id = client.user_id;
        this.type = client.client_type;
    }

    static getClientById(id, result) {
        const query = 'SELECT * FROM client WHERE user_id = ?';
        const value = id;

        db.query(query, value, (err, res) => {
            if (err) {
                console.error('Database error:', err);
                return result(err, null); // Pass the error to the callback
            }
            if (res.length) {
                const user = new Client(res[0]);
                console.log(res[0]);
                return result(null, user); // Client found
            }
            return result(null, null); // No client found
        });
    }

    static update(user_id, userData, result) {
        
        let query = 'UPDATE client SET ';
        const values = [];
      
        // Dynamically add fields to update based on userData
        if (userData.client_type) {
          query += 'client_type = ?, ';
          values.push(userData.client_type);
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
                return result({ message: 'Failed to update client type', error: err }, null);
            }
        
            // If no rows are affected, it means the contact info with the specified user_id was not found
            if (res.affectedRows === 0) {
                return result({ message: 'Client not found' }, null);
            }
      
            const updated = {
                user_id: user_id,
                ...userData // Merge the updated fields from userData
            };

            return result(null, { message: 'Client type updated successfully', updated });

        });
    }  
}

export default Client; 
