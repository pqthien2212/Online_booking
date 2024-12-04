import db from '../config/database.js';

class Accommodation {
  constructor(accommodation) {
    this.id = accommodation.accommodation_id;
    this.type = accommodation.type;
    this.name = accommodation.name;
    this.address = accommodation.address;
    this.days = accommodation.days;
    this.dateBegin = accommodation.date_begin;
    this.dateEnd = accommodation.date_end;
  }

  // Fetch accommodation by ID
  static getById(id, result) {
    const query = `SELECT * FROM accommodation WHERE accommodation_id = ?`;
    db.query(query, [id], (err, res) => {
      if (err) {
        console.error('Database error:', err);
        return result(err, null);
      }
      if (res.length) {
        const accommodation = new Accommodation(res[0]);
        return result(null, accommodation); // Return the found accommodation
      }
      return result(null, null); // No accommodation found
    });
  }

  // Get all accommodations for a specific tour
  static getAccommodationsByTourId(tourId, result) {
    const query = `
        SELECT a.* 
        FROM accommodation a
        INNER JOIN tour_accommodation tl ON a.accommodation_id = tl.accommodation_id
        WHERE tl.tour_id = ?
    `;
    db.query(query, [tourId], (err, res) => {
        if (err) {
            console.error('Error fetching accommodations for tour:', err);
            return result(err, null);
        }
        const accommodations = res.map(accommodation => new Accommodation(accommodation));
        return result(null, accommodations);
    });
  }

  // Create a new accommodation record
  static create(data, result) {
    const { type, name, address, days, dateBegin, dateEnd } = data;
    const query = `
      INSERT INTO accommodation (type, name, address, days, date_begin, date_end)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [type, name, address, days, dateBegin, dateEnd];

    db.query(query, values, (err, res) => {
      if (err) {
        console.error('Error inserting accommodation:', err);
        return result(err, null);
      }
      return result(null, { accommodation_id: res.insertId });
    });
  }

  // Associate a accommodation with a tour
  static addAccToTour(accommodationId, tourId, result) {
    const query = 'INSERT INTO tour_accommodation (accommodation_id, tour_id) VALUES (?, ?)';
    db.query(query, [accommodationId, tourId], (err, res) => {
        if (err) {
            console.error('Error associating accommodation with tour:', err);
            return result(err, null);
        }
        console.log('Accommodation associated with tour successfully:', res);
        return result(null, res);
    });
}

  // Update an existing accommodation record
  static updateByTourId(tourId, updatedData, result) {
    // Step 1: Find the accommodation(s) associated with the tour
    const queryGetAccommodation = `
        SELECT accommodation_id
        FROM tour_accommodation
        WHERE tour_id = ?
    `;
  
    db.query(queryGetAccommodation, [tourId], (err, res) => {
      if (err) {
        console.error('Error fetching accommodation for tour:', err);
        return result(err, null);
      }
  
      if (!res.length) {
        return result(null, { message: 'No accommodation found for the given tour ID.' });
      }
  
      const accommodationId = res[0].accommodation_id;
  
      // Step 2: Dynamically build the update query
      const fieldsToUpdate = [];
      const values = [];
  
      if (updatedData.type) {
        fieldsToUpdate.push('type = ?');
        values.push(updatedData.type);
      }
      if (updatedData.name) {
        fieldsToUpdate.push('name = ?');
        values.push(updatedData.name);
      }
      if (updatedData.address) {
        fieldsToUpdate.push('address = ?');
        values.push(updatedData.address);
      }
      if (updatedData.days) {
        fieldsToUpdate.push('days = ?');
        values.push(updatedData.days);
      }
      if (updatedData.dateBegin) {
        fieldsToUpdate.push('date_begin = ?');
        values.push(updatedData.dateBegin);
      }
      if (updatedData.dateEnd) {
        fieldsToUpdate.push('date_end = ?');
        values.push(updatedData.dateEnd);
      }
      if (!fieldsToUpdate.length) {
        return result(null, { message: 'No fields to update.' });
      }
  
      // Step 3: Prepare the update query
      const queryUpdateAccommodation = `
          UPDATE accommodation
          SET ${fieldsToUpdate.join(', ')}
          WHERE accommodation_id = ?
      `;
  
      values.push(accommodationId);
  
      // Step 4: Execute the update query
      db.query(queryUpdateAccommodation, values, (err, updateRes) => {
        if (err) {
          console.error('Error updating accommodation:', err);
          return result(err, null);
        }
  
        console.log('Accommodation updated successfully:', updateRes);
      });
    });
  }  

  // Delete an accommodation record
  static removeAccommodationFromTour(accommodationId, tourId, result) {
    // Step 1: Delete the accommodation from the tour_accommodation table
    const queryDeleteAccommodation = `
        DELETE FROM tour_accommodation WHERE accommodation_id = ? AND tour_id = ?
    `;
    
    db.query(queryDeleteAccommodation, [accommodationId, tourId], (err, res) => {
      if (err) {
        console.error('Error removing accommodation from tour:', err);
        return result(err, null);
      }
      console.log('Accommodation removed from tour successfully:', res);
      return result(null, { message: 'Accommodation removed and tour updated successfully.' });
    });
  }  
}

export default Accommodation;
