import db from '../config/database.js';

class TourActivity {
  constructor(tourActivity) {
    this.tour_id = tourActivity.tour_id;
    this.tour_activity = tourActivity.tour_activity;
  }

  // Get all activities for a specific tour
  static getActivitiesByTourId(tour_id, result) {
    const query = 'SELECT * FROM tour_activities WHERE tour_id = ?';
    db.query(query, [tour_id], (err, res) => {
      if (err) {
        console.error('Error fetching tour activities:', err);
        return result({ message: 'Failed to fetch tour activities', error: err }, null);
      }
      if (res.length > 0) {
        const activities = res.map(activity => new TourActivity(activity));
        return result(null, activities);
      }
      return result({ message: 'No activities found for this tour' }, null);
    });
  }

  // Add a new activity to a specific tour
  static addActivity(tour_id, tour_activity, result) {
    const query = 'INSERT INTO tour_activities (tour_id, tour_activity) VALUES (?, ?)';
    db.query(query, [tour_id, tour_activity], (err, res) => {
      if (err) {
        console.error('Error adding tour activity:', err);
        return result({ message: 'Failed to add tour activity', error: err }, null);
      }
      return result(null, { message: 'Tour activity added successfully', tour_id, tour_activity });
    });
  }

  // Remove an activity from a specific tour
  static deleteActivity(tour_id, tour_activity, result) {
    const query = 'DELETE FROM tour_activities WHERE tour_id = ? AND tour_activity = ?';
    db.query(query, [tour_id, tour_activity], (err, res) => {
      if (err) {
        console.error('Error deleting tour activity:', err);
        return result({ message: 'Failed to delete tour activity', error: err }, null);
      }
      if (res.affectedRows === 0) {
        return result({ message: 'Tour activity not found' }, null);
      }
      return result(null, { message: 'Tour activity deleted successfully', tour_id, tour_activity });
    });
  }

  // Update an existing activity for a specific tour
  static updateActivity(tour_id, old_activity, new_activity, result) {
    const query = `
      UPDATE tour_activities 
      SET tour_activity = ? 
      WHERE tour_id = ? AND tour_activity = ?
    `;
    db.query(query, [new_activity, tour_id, old_activity], (err, res) => {
      if (err) {
        console.error('Error updating tour activity:', err);
        return result({ message: 'Failed to update tour activity', error: err }, null);
      }
      if (res.affectedRows === 0) {
        return result({ message: 'Tour activity not found' }, null);
      }
      return result(null, { message: 'Tour activity updated successfully', tour_id, new_activity });
    });
  }

  // Fetch all tour activities
  static getAllActivities(result) {
    const query = 'SELECT * FROM tour_activities';
    db.query(query, (err, res) => {
      if (err) {
        console.error('Error fetching all tour activities:', err);
        return result({ message: 'Failed to fetch tour activities', error: err }, null);
      }
      const activities = res.map(activity => new TourActivity(activity));
      return result(null, activities);
    });
  }
}

export default TourActivity;
