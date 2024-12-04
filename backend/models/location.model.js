import db from '../config/database.js';

class Location {
    constructor(location) {
        this.id = location.location_id;
        this.name = location.name;
        this.address = location.address;
        this.city = location.city;
        this.province = location.province;
        this.days = location.days;
        this.date_begin = location.date_begin;
        this.date_end = location.date_end;
    }

    // Retrieve location by name
    static getByName(name, result) {
        const query = 'SELECT * FROM locations WHERE name = ?';
        db.query(query, [name], (err, res) => {
            if (err) {
                console.error('Database error:', err);
                return result(err, null);
            }
            if (res.length) {
                const location = new Location(res[0]);
                return result(null, location); // Location found
            }
            return result(null, null); // No location found
        });
    }

    // Retrieve all locations
    static getAll(result) {
        const query = 'SELECT * FROM locations';
        db.query(query, (err, res) => {
            if (err) {
                console.error('Database error:', err);
                return result(err, null);
            }
            const locations = res.map(location => new Location(location));
            return result(null, locations);
        });
    }

    // Create a new location
    static createLocation(locationData, result) {
      const { name, address, city, province, days, dateBegin, dateEnd } = locationData;
  
      const query = `
          INSERT INTO locations (name, address, city, province, days, date_begin, date_end)
          VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [name, address, city, province, days, dateBegin, dateEnd];
  
      db.query(query, values, (err, res) => {
          if (err) {
              console.error('Error inserting location:', err);
              return result(err, null);
          }
          console.log('Location created successfully:', res);
  
          // After inserting the location, call the procedures to update tour days and dates
          db.query('CALL UpdateTourDays()', (err) => {
              if (err) {
                  console.error('Error updating tour days:', err);
                  return result(err, null);
              }
  
              db.query('CALL UpdateTourDates()', (err) => {
                  if (err) {
                      console.error('Error updating tour dates:', err);
                      return result(err, null);
                  }
  
                  // Successfully updated, return the location_id of the newly created location
                  return result(null, { location_id: res.insertId });
              });
          });
      });
    }  

    // Associate a location with a tour
    static addLocationToTour(locationId, tourId, result) {
        const query = 'INSERT INTO tour_location (location_id, tour_id) VALUES (?, ?)';
        db.query(query, [locationId, tourId], (err, res) => {
            if (err) {
                console.error('Error associating location with tour:', err);
                return result(err, null);
            }
            console.log('Location associated with tour successfully:', res);
            return result(null, res);
        });
    }

    // Remove a location from a tour
    static removeLocationFromTour(locationId, tourId, result) {
      const query = 'DELETE FROM tour_location WHERE location_id = ? AND tour_id = ?';
      db.query(query, [locationId, tourId], (err, res) => {
          if (err) {
              console.error('Error removing location from tour:', err);
              return result(err, null);
          }
          console.log('Location removed from tour successfully:', res);
  
          // Step 1: Check if there are any remaining locations for the given tour_id
          const checkRemainingLocationsQuery = `
              SELECT COUNT(*) AS remaining_locations 
              FROM tour_location 
              WHERE tour_id = ?
          `;
          
          db.query(checkRemainingLocationsQuery, [tourId], (err, checkRes) => {
              if (err) {
                  console.error('Error checking remaining locations:', err);
                  return result(err, null);
              }
  
              const remainingLocations = checkRes[0].remaining_locations;
  
              // Step 2: If no remaining locations, don't call the procedures
              if (remainingLocations === 0) {
                  console.log('No locations left for this tour, skipping procedures.');
                  return result(null, { message: 'Location removed, no locations left in the tour.' });
              }
  
              // Step 3: If there are remaining locations, call the procedures to update tour days and dates
              db.query('CALL UpdateTourDays()', (err) => {
                  if (err) {
                      console.error('Error updating tour days:', err);
                      return result(err, null);
                  }
  
                  db.query('CALL UpdateTourDates()', (err) => {
                      if (err) {
                          console.error('Error updating tour dates:', err);
                          return result(err, null);
                      }
  
                      // Successfully updated, return the result
                      return result(null, { message: 'Location removed and tour updated successfully.' });
                  });
              });
          });
      });
    }  

    // Get all locations for a specific tour
    static getLocationsByTourId(tourId, result) {
        const query = `
            SELECT l.* 
            FROM locations l
            INNER JOIN tour_location tl ON l.location_id = tl.location_id
            WHERE tl.tour_id = ?
        `;
        db.query(query, [tourId], (err, res) => {
            if (err) {
                console.error('Error fetching locations for tour:', err);
                return result(err, null);
            }
            const locations = res.map(location => new Location(location));
            return result(null, locations);
        });
    }

    static updateLocationByTourId(tourId, updatedData, result) {
      // Step 1: Find the location(s) associated with the tour
      const queryGetLocation = `
          SELECT location_id 
          FROM tour_location 
          WHERE tour_id = ?
      `;
  
      db.query(queryGetLocation, [tourId], (err, res) => {
          if (err) {
              console.error('Error fetching location for tour:', err);
              return result(err, null);
          }
  
          if (!res.length) {
              return result(null, { message: 'No location found for the given tour ID.' });
          }
  
          const locationId = res[0].location_id;
  
          // Step 2: Dynamically build the update query
          const fieldsToUpdate = [];
          const values = [];
  
          if (updatedData.name) {
              fieldsToUpdate.push('name = ?');
              values.push(updatedData.name);
          }
          if (updatedData.address) {
              fieldsToUpdate.push('address = ?');
              values.push(updatedData.address);
          }
          if (updatedData.city) {
              fieldsToUpdate.push('city = ?');
              values.push(updatedData.city);
          }
          if (updatedData.province) {
              fieldsToUpdate.push('province = ?');
              values.push(updatedData.province);
          }
          if (updatedData.days) {
              fieldsToUpdate.push('days = ?');
              values.push(updatedData.days);
          }
          if (updatedData.date_begin) {
              fieldsToUpdate.push('date_begin = ?');
              values.push(updatedData.date_begin);
          }
          if (updatedData.date_end) {
              fieldsToUpdate.push('date_end = ?');
              values.push(updatedData.date_end);
          }
          if (!fieldsToUpdate.length) {
              return result(null, { message: 'No fields to update.' });
          }
  
          const queryUpdateLocation = `
              UPDATE locations 
              SET ${fieldsToUpdate.join(', ')}
              WHERE location_id = ?
          `;
  
          values.push(locationId);
  
          // Step 3: Execute the update query
          db.query(queryUpdateLocation, values, (err, updateRes) => {
              if (err) {
                  console.error('Error updating location:', err);
                  return result(err, null);
              }

              // Update tour days + dates
              db.query('CALL UpdateTourDays()', (err) => {
                if (err) {
                    console.error('Error updating tour days:', err);
                    return result(err, null);
                }
    
                db.query('CALL UpdateTourDates()', (err) => {
                    if (err) {
                        console.error('Error updating tour dates:', err);
                        return result(err, null);
                    }
    
                    // Successfully updated, return the location_id of the newly created location
                    return result(null, { location_id: res.insertId });
                });
              });
              return result(null, { message: 'Location updated successfully.', updateRes });
          });
      });
    }  
}

export default Location;
