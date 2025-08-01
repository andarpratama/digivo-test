import { Router } from 'express';
import { OrderController } from '../controllers/OrderController';

export function createOrderRoutes(orderController: OrderController): Router {
  const router = Router();

  router.post('/orders', orderController.createOrder);

  router.get('/orders/:id', orderController.getOrderById);

  router.get('/orders', orderController.getAllOrders);

  router.patch('/orders/:id/status', orderController.updateOrderStatus);

  router.get('/orders/status/:status', orderController.getOrdersByStatus);

  router.get('/orders/code/:kode_unik', orderController.getOrderByUniqueCode);

  router.post('/orders/generate-test', orderController.generateTestOrders);

  router.get('/orders/statistics', orderController.getOrderStatistics);

  return router;
} 