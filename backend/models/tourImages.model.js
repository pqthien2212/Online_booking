import db from '../config/database.js';

class TourImage {
  constructor(tourImage) {
    this.tour_id = tourImage.tour_id;
    this.tour_img = tourImage.tour_img;
  }

  // Get all images for a specific tour
  static getImagesByTourId(tour_id, result) {
    const query = 'SELECT * FROM tour_images WHERE tour_id = ?';
    db.query(query, [tour_id], (err, res) => {
      if (err) {
        console.error('Error fetching tour images:', err);
        return result({ message: 'Failed to fetch tour images', error: err }, null);
      }
      if (res.length > 0) {
        const images = res.map(image => new TourImage(image));
        return result(null, images);
      }
      return result({ message: 'No images found for this tour' }, null);
    });
  }

  // Add a new image to a specific tour
  static addImage(tour_id, tour_img, result) {
    const query = 'INSERT INTO tour_images (tour_id, tour_img) VALUES (?, ?)';
    db.query(query, [tour_id, tour_img], (err, res) => {
      if (err) {
        console.error('Error adding tour image:', err);
        return result({ message: 'Failed to add tour image', error: err }, null);
      }
      return result(null, { message: 'Tour image added successfully', tour_id, tour_img });
    });
  }

  // Remove an image from a specific tour
  static deleteImage(tour_id, tour_img, result) {
    const query = 'DELETE FROM tour_images WHERE tour_id = ? AND tour_img = ?';
    db.query(query, [tour_id, tour_img], (err, res) => {
      if (err) {
        console.error('Error deleting tour image:', err);
        return result({ message: 'Failed to delete tour image', error: err }, null);
      }
      if (res.affectedRows === 0) {
        return result({ message: 'Tour image not found' }, null);
      }
      return result(null, { message: 'Tour image deleted successfully', tour_id, tour_img });
    });
  }

  // Update an existing image for a specific tour
  static updateImage(tour_id, old_img, new_img, result) {
    const query = `
      UPDATE tour_images 
      SET tour_img = ? 
      WHERE tour_id = ? AND tour_img = ?
    `;
    db.query(query, [new_img, tour_id, old_img], (err, res) => {
      if (err) {
        console.error('Error updating tour image:', err);
        return result({ message: 'Failed to update tour image', error: err }, null);
      }
      if (res.affectedRows === 0) {
        return result({ message: 'Tour image not found' }, null);
      }
      return result(null, { message: 'Tour image updated successfully', tour_id, new_img });
    });
  }

  // Fetch all tour images
  static getAllImages(result) {
    const query = 'SELECT * FROM tour_images';
    db.query(query, (err, res) => {
      if (err) {
        console.error('Error fetching all tour images:', err);
        return result({ message: 'Failed to fetch tour images', error: err }, null);
      }
      const images = res.map(image => new TourImage(image));
      return result(null, images);
    });
  }
}

export default TourImage;
