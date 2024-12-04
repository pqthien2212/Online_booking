import Contact from "../models/contact.model.js";
import TourGuide from "../models/tourGuide.model.js"; 
import Client from "../models/client.model.js";
import TourOperator from "../models/tourOperator.model.js";
import Admin from "../models/admin.model.js";

const UserController = {

    // Get user contact information by user ID
    getUsers: (req, res) => {
        const user_id = req.params.user_id; // Access user_id from params

        // Validate that user_id is provided
        if (!user_id) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Find user's contact information by their ID
        Contact.getContactInfoById(user_id, (err, contact) => {
            if (err) {
                // Send error response if there's an issue
                return res.status(500).json({ message: err.message || 'Failed to retrieve contact information' });
            }

            if (!contact) {
                // If no contact found for the user_id
                return res.status(404).json({ message: 'Contact not found' });
            }

            // Return the contact information in the response
            return res.status(200).json(contact);
        });
    },

    updateContactInfo: (req, res) => {
        const user_id = req.params.user_id;

        const userData = req.body; // Get updated contact info from the request body

        // Validate that user_id is provided
        if (!user_id) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Validate that at least one field is provided for update
        if (!userData || Object.keys(userData).length === 0) {
            return res.status(400).json({ message: 'No data provided to update' });
        }

        // Update user's contact information
        Contact.update(user_id, userData, (err, result) => {
            if (err) {
                // Send error response if there's an issue
                return res.status(500).json({ message: err.message || 'Failed to update contact information' });
            }

            if (result && result.message === 'User contact info not found') {
                // If no contact info is found for the user_id
                return res.status(404).json({ message: result.message });
            }

            // Successfully updated contact info
            return res.status(200).json({ message: 'Contact information updated successfully', updatedContact: result.updatedContact });
        });
    },

    getTourGuideDescription: (req, res) => {
        const user_id = req.params.user_id; 
    
        // Validate that user_id is provided
        if (!user_id) {
            return res.status(400).json({ message: 'User ID is required' });
        }
    
        // Get description from tour guide
        TourGuide.getTourGuideById(user_id, (err, result) => {
            if (err) {
                // Send error response if there's an issue
                return res.status(500).json({ message: err.message || 'Failed to retrieve tour guide description' });
            }
    
            if (!result) {
                // If no tour guide found for the user_id
                return res.status(404).json({ message: 'Tour guide not found' });
            }
    
            // Return the description in the response
            return res.status(200).json(result); 
        });
    },

    updateTourGuideDescription: (req, res) => {
        const user_id = req.params.user_id;
        const userData = req.body;
    
        // Validate inputs
        if (!user_id) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        if (!userData || Object.keys(userData).length === 0) {
            return res.status(400).json({ message: 'No data provided to update' });
        }
    
        // Perform update
        TourGuide.update(user_id, userData, (err, result) => {
            if (err) {
                console.error('Error updating tour guide:', err);
                return res.status(500).json({ message: err.message || 'Failed to update tour guide' });
            }
            if (result && result.message === 'Tour guide not found') {
                return res.status(404).json({ message: result.message });
            }
            return res.status(200).json({ message: 'Tour guide updated successfully', updated: result.updated });
        });
    },    

    getClientType: (req, res) => {
        const user_id = req.params.user_id; 
    
        // Validate that user_id is provided
        if (!user_id) {
            return res.status(400).json({ message: 'User ID is required' });
        }
    
        // Get client information
        Client.getClientById(user_id, (err, result) => {
            if (err) {
                // Send error response if there's an issue
                return res.status(500).json({ message: err.message || 'Failed to retrieve client information' });
            }
    
            if (!result) {
                // If no client found for the user_id
                return res.status(404).json({ message: 'Client not found' });
            }
    
            // Return the client information in the response
            return res.status(200).json(result); 
        });
    },

    updateClientType: (req, res) => {
        const user_id = req.params.user_id;
        const userData = req.body; // Get updated client data from the request body
    
        // Validate that user_id is provided
        if (!user_id) {
            return res.status(400).json({ message: 'User ID is required' });
        }
    
        // Validate that at least one field is provided for update
        if (!userData || Object.keys(userData).length === 0) {
            return res.status(400).json({ message: 'No data provided to update' });
        }
    
        // Optional: Validate allowed fields
        const allowedFields = ['client_type'];
        const isValidField = Object.keys(userData).every(key => allowedFields.includes(key));
        if (!isValidField) {
            return res.status(400).json({ message: 'Invalid field in request data' });
        }
    
        // Update the client type
        Client.update(user_id, userData, (err, result) => {
            if (err) {
                console.error(`Error updating client type for user_id ${user_id}:`, err);
                // Send error response if there's an issue
                return res.status(500).json({ message: err.message || 'Failed to update client type' });
            }
    
            // Handle the case where no client was found
            if (result && result.message === 'Client not found') {
                return res.status(404).json({ message: result.message });
            }
    
            // Successfully updated the client type
            return res.status(200).json({ message: 'Client type updated successfully', updated: result.updated });
        });
    },    
    
    getTourOperatorType: (req, res) => {
        const user_id = req.params.user_id; 
    
        // Validate that user_id is provided
        if (!user_id) {
            return res.status(400).json({ message: 'User ID is required' });
        }
    
        // Get client information
        TourOperator.getTourOperatorById(user_id, (err, result) => {
            if (err) {
                // Send error response if there's an issue
                return res.status(500).json({ message: err.message || 'Failed to retrieve client information' });
            }
    
            if (!result) {
                // If no client found for the user_id
                return res.status(404).json({ message: 'Client not found' });
            }
    
            // Return the client information in the response
            return res.status(200).json(result); 
        });
    },

    updateTourOperatorType: (req, res) => {
        const user_id = req.params.user_id;
        const userData = req.body;
    
        // Validate inputs
        if (!user_id) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        if (!userData || Object.keys(userData).length === 0) {
            return res.status(400).json({ message: 'No data provided to update' });
        }
    
        // Perform update
        TourOperator.update(user_id, userData, (err, result) => {
            if (err) {
                console.error('Error updating tour operator:', err);
                return res.status(500).json({ message: err.message || 'Failed to update tour operator' });
            }
            if (result && result.message === 'Tour operator not found') {
                return res.status(404).json({ message: result.message });
            }
            return res.status(200).json({ message: 'Tour operator updated successfully', updated: result.updated });
        });
    },    
    
    getAdminLevel: (req, res) => {
        const user_id = req.params.user_id; 
    
        // Validate that user_id is provided
        if (!user_id) {
            return res.status(400).json({ message: 'User ID is required' });
        }
    
        // Get client information
        Admin.getAdminById(user_id, (err, result) => {
            if (err) {
                // Send error response if there's an issue
                return res.status(500).json({ message: err.message || 'Failed to retrieve client information' });
            }
    
            if (!result) {
                // If no client found for the user_id
                return res.status(404).json({ message: 'Client not found' });
            }
    
            // Return the client information in the response
            return res.status(200).json(result); 
        });
    },

    updateAdminLevel: (req, res) => {
        const user_id = req.params.user_id;
        const userData = req.body; // Get updated admin info from the request body
    
        // Validate that user_id is provided
        if (!user_id) {
            return res.status(400).json({ message: 'User ID is required' });
        }
    
        // Validate that at least one field is provided for update
        if (!userData || Object.keys(userData).length === 0) {
            return res.status(400).json({ message: 'No data provided to update' });
        }
    
        // Optional: Validate allowed fields
        const allowedFields = ['level'];
        const isValidField = Object.keys(userData).every(key => allowedFields.includes(key));
        if (!isValidField) {
            return res.status(400).json({ message: 'Invalid field in request data' });
        }
    
        // Update the admin level
        Admin.update(user_id, userData, (err, result) => {
            if (err) {
                console.error(`Error updating admin level for user_id ${user_id}:`, err);
                return res.status(500).json({ message: err.message || 'Failed to update admin level' });
            }
    
            if (result && result.message === 'Admin not found') {
                return res.status(404).json({ message: result.message });
            }
    
            return res.status(200).json({ message: 'Admin level updated successfully', updated: result.updated });
        });
    },

}

export default UserController;

