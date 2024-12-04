import db from '../config/database.js'; // Ensure to include the correct file extension

class Contact {
  constructor(contact) {
    this.contact_id = contact.contact_id;
    this.user_id = contact.user_id;
    this.phone_number = contact.phone_number;
    this.first_name = contact.firstname;
    this.middle_name = contact.middlename;
    this.last_name = contact.lastname;
    this.address = contact.address;
    this.email = contact.email;
  }

  static getContactInfoById(user_id, result) {

    if (!user_id) {
        return result({ message: 'User ID is required' }, null);
    }
    // SQL query to fetch contact information by user_id
    const query = 'SELECT * FROM contact WHERE user_id = ?';

    // Execute the query
    db.query(query, [user_id], (err, res) => {
      if (err) {
        console.error('Database error:', err);
        return result({ message: 'Failed to retrieve contact information', error: err }, null);
      }

      // If no contact information is found, return a message
      if (res.length === 0) {
        return result({ message: 'Contact not found' }, null);
      }

      // Return the contact information
      const contact = new Contact(res[0]); // Assuming there's one contact per user_id
      return result(null, contact);
    });
  }

  static update(user_id, userData, result) {
    if (!user_id) {
      return result({ message: 'User ID is required' }, null);
    }
  
    // Start building the UPDATE query for the contact_detail table
    let query = 'UPDATE contact_detail SET ';
    const values = [];
  
    // Dynamically add fields to update based on userData
    if (userData.phone_number) {
      query += 'phone_number = ?, ';
      values.push(userData.phone_number);
    }
    if (userData.first_name) {
      query += 'firstname = ?, ';
      values.push(userData.first_name);
    }
    if (userData.middle_name) {
      query += 'middlename = ?, ';
      values.push(userData.middle_name);
    }
    if (userData.last_name) {
      query += 'lastname = ?, ';
      values.push(userData.last_name);
    }
    if (userData.address) {
      query += 'address = ?, ';
      values.push(userData.address);
    }
    if (userData.email) {
      query += 'email = ?, ';
      values.push(userData.email);
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
        return result({ message: 'Failed to update user contact info', error: err }, null);
      }
  
      // If no rows are affected, it means the contact info with the specified user_id was not found
      if (res.affectedRows === 0) {
        return result({ message: 'User contact info not found' }, null);
      }
  
      // Now fetch the updated contact info, including the contact_id
      const fetchQuery = 'SELECT * FROM contact_detail WHERE user_id = ?';
      db.query(fetchQuery, [user_id], (fetchErr, fetchRes) => {
        if (fetchErr) {
          console.error('Database error while fetching updated contact info:', fetchErr);
          return result({ message: 'Failed to retrieve updated contact info', error: fetchErr }, null);
        }
  
        // Assuming only one contact per user_id, fetch the first result
        if (fetchRes.length === 0) {
          return result({ message: 'User contact info not found' }, null);
        }
  
        // Return the updated contact info, including contact_id
        const updatedContact = {
          contact_id: fetchRes[0].contact_id, // Fetch contact_id from the result
          user_id: user_id,
          ...userData // Merge the updated fields from userData
        };
  
        return result(null, { message: 'User contact info updated successfully', updatedContact });
      });
    });
  }  
}

export default Contact;
