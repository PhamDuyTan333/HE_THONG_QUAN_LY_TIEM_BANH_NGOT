// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Public routes (temporarily disabled auth for testing)
router.get('/', orderController.getAllOrders);
router.get('/stats', orderController.getOrderStatistics);
router.get('/customer/:customerId', orderController.getCustomerOrders);
router.get('/:id', orderController.getOrderById);
router.post('/', orderController.createOrder);
router.put('/:id', orderController.updateOrder);
router.delete('/:id', orderController.deleteOrder);

// Update order status
router.patch('/:id/status', orderController.updateOrderStatus);
router.patch('/:id/payment', orderController.updatePaymentStatus);

module.exports = router;
