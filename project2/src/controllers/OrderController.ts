import { Request, Response } from 'express';
import { OrderService } from '../services/OrderService';
import { CreateOrderRequest } from '../models/Order';

export class OrderController {
  private orderService: OrderService;

  constructor(orderService: OrderService) {
    this.orderService = orderService;
  }

  public createOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const { produk_id, nama_produk }: CreateOrderRequest = req.body;

      if (!produk_id || !nama_produk) {
        res.status(400).json({
          success: false,
          error: 'produk_id and nama_produk are required'
        });
        return;
      }

      if (typeof produk_id !== 'number' || produk_id < 1) {
        res.status(400).json({
          success: false,
          error: 'produk_id must be a positive number'
        });
        return;
      }

      const result = await this.orderService.createOrder({ produk_id, nama_produk });

      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Error in createOrder controller:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  };

  public getOrderById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id || '');

      if (isNaN(id) || id < 1) {
        res.status(400).json({
          success: false,
          error: 'Invalid order ID'
        });
        return;
      }

      const result = await this.orderService.getOrderById(id);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      console.error('Error in getOrderById controller:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  };

  public getAllOrders = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (page < 1 || limit < 1 || limit > 100) {
        res.status(400).json({
          success: false,
          error: 'Invalid pagination parameters'
        });
        return;
      }

      const result = await this.orderService.getAllOrders(page, limit);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      console.error('Error in getAllOrders controller:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  };

  public updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id || '');
      const { status } = req.body;

      if (isNaN(id) || id < 1) {
        res.status(400).json({
          success: false,
          error: 'Invalid order ID'
        });
        return;
      }

      const validStatuses = ['pending', 'paid', 'cancelled', 'completed'];
      if (!status || !validStatuses.includes(status)) {
        res.status(400).json({
          success: false,
          error: 'Invalid status. Must be one of: pending, paid, cancelled, completed'
        });
        return;
      }

      const result = await this.orderService.updateOrderStatus(id, status);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      console.error('Error in updateOrderStatus controller:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  };

  public getOrdersByStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { status } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const validStatuses = ['pending', 'paid', 'cancelled', 'completed'];
      if (!status || !validStatuses.includes(status)) {
        res.status(400).json({
          success: false,
          error: 'Invalid status. Must be one of: pending, paid, cancelled, completed'
        });
        return;
      }

      if (page < 1 || limit < 1 || limit > 100) {
        res.status(400).json({
          success: false,
          error: 'Invalid pagination parameters'
        });
        return;
      }

      const result = await this.orderService.getOrdersByStatus(status as any, page, limit);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      console.error('Error in getOrdersByStatus controller:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  };

  public getOrderByUniqueCode = async (req: Request, res: Response): Promise<void> => {
    try {
      const { kode_unik } = req.params;

      if (!kode_unik || kode_unik.length !== 2) {
        res.status(400).json({
          success: false,
          error: 'Invalid unique code format'
        });
        return;
      }

      const result = await this.orderService.getOrderByUniqueCode(kode_unik);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      console.error('Error in getOrderByUniqueCode controller:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  };

  public generateTestOrders = async (req: Request, res: Response): Promise<void> => {
    try {
      const count = parseInt(req.query.count as string) || 50;

      if (count < 1 || count > 1000) {
        res.status(400).json({
          success: false,
          error: 'Count must be between 1 and 1000'
        });
        return;
      }

      const result = await this.orderService.generateTestOrders(count);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      console.error('Error in generateTestOrders controller:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  };

  public getOrderStatistics = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.orderService.getOrderStatistics();

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      console.error('Error in getOrderStatistics controller:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  };
} 