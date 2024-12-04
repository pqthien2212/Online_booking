import express from 'express';
import UserController from '../controllers/userController.js';
import BookingController from '../controllers/bookingController.js';
import CancellationController from '../controllers/cancellationController.js';
import PaymentController from '../controllers/paymentController.js';

const router = express.Router();

/* ********* Contact information *********** */

// Route to get user contact information
router.get('/:user_id/contact', UserController.getUsers);

// Route to update user contact information
router.put('/:user_id/contact', UserController.updateContactInfo);

// Route to get tour guide description
router.get('/:user_id/tour-guide', UserController.getTourGuideDescription);

// Route to update tour guide description
router.put('/:user_id/tour-guide', UserController.updateTourGuideDescription);

// Route to get client type
router.get('/:user_id/client', UserController.getClientType);

// Route to update client type
router.put('/:user_id/client', UserController.updateClientType);

// Route to get tour operator type
router.get('/:user_id/tour-operator', UserController.getTourOperatorType);

// Route to update tour operator type
router.put('/:user_id/tour-operator', UserController.updateTourOperatorType);

// Route to get admin level
router.get('/:user_id/admin', UserController.getAdminLevel);

// Route to update admin level
router.put('/:user_id/admin', UserController.updateAdminLevel);



/* ********* Booking *********** */

// Route to create a booking
router.post('/:client_id/bookings', BookingController.createBooking);

// Route to get bookings by client_id
router.get('/:client_id/bookings', BookingController.getBookingsByClientId);

// Route to update booking status
router.put('/:booking_id/bookings', BookingController.updateBookingStatus);



/* ********* Cancellation *********** */

// Route to create cancellations
router.post('/:client_id/cancellation', CancellationController.createCancellation);

// Route to get cancellations by client id
router.get('/:client_id/cancellation', CancellationController.getCancellationsByClientId);

// Route to get cancellations by booking id
router.post('/:booking_id/cancellation', CancellationController.getCancellationByBookingId);



/* ********* Payment *********** */

// Route to create a payment
router.post('/:client_id/payments', PaymentController.createPayment);

// Route to get payments by client id
router.get('/:client_id/payments', PaymentController.getPaymentsByClientId);

// Route to get payments by booking id
router.get('/:booking_id/payments', PaymentController.getPaymentsByBookingId);

// Route to update payment status
router.put('/:payment_id/payments', PaymentController.updatePaymentStatus);

export default router;
