import db from '../config/database.js'; // Ensure to include the correct file extension
import bcrypt from 'bcrypt';

class User {
  constructor(user) {
    this.id = user.user_id;
    this.username = user.user_name;
    this.password = user.user_password;
    this.role = user.user_role;
  }

  // For login + register
  static getByEmail(email, result) {
    db.query('SELECT * FROM users WHERE user_name = ?', [email], (err, res) => {
      if (err) {
        console.error('Database error:', err);
        return result(err, null);
      }
      if (res.length) {
        const user = new User(res[0]);
        console.log(res[0]);
        return result(null, user); // Found user
      }
      return result(null, null); // No user found
    });
  }

  // For register
  // For register
  static async create(email, password, role, additionalData, result) {
    try {
      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);

      // Prepare the data for the stored procedure
      const { level, clientType, toType, tgDescription } = additionalData || {};

      const query = `CALL insert_user(?, ?, ?, ?, ?, ?, ?)`;
      const values = [
        email,              // p_user_name
        hashedPassword,     // p_user_password
        role,               // p_user_role
        level || null,      // p_level
        clientType || null, // p_client_type
        toType || null,     // p_to_type
        tgDescription || null // p_tg_description
      ];

      db.query(query, values, (err, res) => {
        if (err) {
          console.error('Error inserting user:', err);
          return result(err, null);
        }

        // Return the newly created user ID
        return result(null, { user_id: res.insertId });
        return result(null, { id: res.insertId, username: email, role: role });
      });
    } catch (error) {
      console.error('Error hashing password:', error);
      return result(error, null);
    }
  }
}

export default User; // Exporting the User class