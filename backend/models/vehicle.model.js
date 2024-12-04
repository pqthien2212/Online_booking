import db from '../config/database.js';

class Vehicle {
  constructor(vehicle) {
    this.id = vehicle.vehicle_id;
    this.type = vehicle.type;
    this.name = vehicle.name;
    this.plateNo = vehicle.plate_no;
    this.days = vehicle.days;
    this.dateBegin = vehicle.date_begin;
    this.dateEnd = vehicle.date_end;
  }

  // Fetch vehicle by ID
  static getById(id, result) {
    const query = `SELECT * FROM vehicle WHERE vehicle_id = ?`;
    db.query(query, [id], (err, res) => {
      if (err) {
        console.error('Database error:', err);
        return result(err, null);
      }
      if (res.length) {
        const vehicle = new Vehicle(res[0]);
        return result(null, vehicle); // Return the found vehicle
      }
      return result(null, null); // No vehicle found
    });
  }

  // Get all vehicles for a specific tour
  static getVehiclesByTourId(tourId, result) {
    const query = `
        SELECT v.* 
        FROM vehicle v
        INNER JOIN tour_vehicle tv ON v.vehicle_id = tv.vehicle_id
        WHERE tv.tour_id = ?
    `;
    db.query(query, [tourId], (err, res) => {
        if (err) {
            console.error('Error fetching vehicles for tour:', err);
            return result(err, null);
        }
        const vehicles = res.map(vehicle => new Vehicle(vehicle));
        return result(null, vehicles);
    });
  }

  // Create a new vehicle record
  static create(data, result) {
    const { type, name, plateNo, days, dateBegin, dateEnd } = data;
    const query = `
      INSERT INTO vehicle (type, name, plate_no, days, date_begin, date_end)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [type, name, plateNo, days, dateBegin, dateEnd];

    db.query(query, values, (err, res) => {
      if (err) {
        console.error('Error inserting vehicle:', err);
        return result(err, null);
      }
      return result(null, { vehicle_id: res.insertId });
    });
  }

  // Associate a vehicle with a tour
  static addVehicleToTour(vehicleId, tourId, result) {
    const query = 'INSERT INTO tour_vehicle (vehicle_id, tour_id) VALUES (?, ?)';
    db.query(query, [vehicleId, tourId], (err, res) => {
        if (err) {
            console.error('Error associating vehicle with tour:', err);
            return result(err, null);
        }
        console.log('Vehicle associated with tour successfully:', res);
        return result(null, res);
    });
  }

  // Update an existing vehicle record
  static updateByTourId(tourId, updatedData, result) {
    // Step 1: Find the vehicle(s) associated with the tour
    const queryGetVehicle = `
        SELECT vehicle_id
        FROM tour_vehicle
        WHERE tour_id = ?
    `;
  
    db.query(queryGetVehicle, [tourId], (err, res) => {
      if (err) {
        console.error('Error fetching vehicle for tour:', err);
        return result(err, null);
      }
  
      if (!res.length) {
        return result(null, { message: 'No vehicle found for the given tour ID.' });
      }
  
      const vehicleId = res[0].vehicle_id;
  
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
      if (updatedData.plateNo) {
        fieldsToUpdate.push('plate_no = ?');
        values.push(updatedData.plateNo);
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
      const queryUpdateVehicle = `
          UPDATE vehicle
          SET ${fieldsToUpdate.join(', ')}
          WHERE vehicle_id = ?
      `;
  
      values.push(vehicleId);
  
      // Step 4: Execute the update query
      db.query(queryUpdateVehicle, values, (err, updateRes) => {
        if (err) {
          console.error('Error updating vehicle:', err);
          return result(err, null);
        }
  
        console.log('Vehicle updated successfully:', updateRes);
      });
    });
  }

  // Delete a vehicle record
  static removeVehicleFromTour(vehicleId, tourId, result) {
    // Step 1: Delete the vehicle from the tour_vehicle table
    const queryDeleteVehicle = `
        DELETE FROM tour_vehicle WHERE vehicle_id = ? AND tour_id = ?
    `;
    
    db.query(queryDeleteVehicle, [vehicleId, tourId], (err, res) => {
      if (err) {
        console.error('Error removing vehicle from tour:', err);
        return result(err, null);
      }
      console.log('Vehicle removed from tour successfully:', res);
      return result(null, { message: 'Vehicle removed and tour updated successfully.' });
    });
  }
}

export default Vehicle;
