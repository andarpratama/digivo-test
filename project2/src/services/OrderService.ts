import { Database } from '../utils/database';
import { UniqueCodeGenerator } from '../utils/uniqueCodeGenerator';
import { Order, CreateOrderRequest, OrderResponse, OrdersResponse } from '../models/Order';

export class OrderService {
  private database: Database;
  private uniqueCodeGenerator: UniqueCodeGenerator;

  constructor(database: Database) {
    this.database = database;
    this.uniqueCodeGenerator = UniqueCodeGenerator.getInstance(database);
  }

  public async createOrder(orderData: CreateOrderRequest): Promise<OrderResponse> {
    try {
      const kodeUnik = await this.uniqueCodeGenerator.generateUniqueCode();

      const order: Omit<Order, 'id' | 'tanggal' | 'created_at' | 'updated_at'> = {
        produk_id: orderData.produk_id,
        nama_produk: orderData.nama_produk,
        harga: 299000,
        kode_unik: kodeUnik,
        status: 'pending'
      };

      const result = await this.database.query(
        `INSERT INTO orders (produk_id, nama_produk, harga, kode_unik, status) 
         VALUES (?, ?, ?, ?, ?)`,
        [order.produk_id, order.nama_produk, order.harga, order.kode_unik, order.status]
      );

      const insertedId = (result as any).insertId;
      const createdOrder = await this.getOrderById(insertedId);

      const response: OrderResponse = {
        success: true,
        message: 'Order created successfully'
      };

      if (createdOrder.data) {
        response.data = createdOrder.data;
      }

      return response;
    } catch (error) {
      console.error('Error creating order:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  public async getOrderById(id: number): Promise<OrderResponse> {
    try {
      const result = await this.database.query<Order>(
        'SELECT * FROM orders WHERE id = ?',
        [id]
      );

      if (result.length === 0) {
        return {
          success: false,
          error: 'Order not found'
        };
      }

      const response: OrderResponse = {
        success: true
      };

      if (result[0]) {
        response.data = result[0];
      }

      return response;
    } catch (error) {
      console.error('Error getting order:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  public async getAllOrders(page: number = 1, limit: number = 10): Promise<OrdersResponse> {
    try {
      const offset = (page - 1) * limit;

      const orders = await this.database.query<Order>(
        'SELECT * FROM orders ORDER BY created_at DESC LIMIT ? OFFSET ?',
        [limit, offset]
      );

      const totalResult = await this.database.query<{ count: number }>(
        'SELECT COUNT(*) as count FROM orders'
      );

      const total = totalResult[0]?.count || 0;

      return {
        success: true,
        data: orders,
        total,
        page,
        limit
      };
    } catch (error) {
      console.error('Error getting orders:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  public async updateOrderStatus(id: number, status: Order['status']): Promise<OrderResponse> {
    try {
      const result = await this.database.query(
        'UPDATE orders SET status = ? WHERE id = ?',
        [status, id]
      );

      if ((result as any).affectedRows === 0) {
        return {
          success: false,
          error: 'Order not found'
        };
      }

      const updatedOrder = await this.getOrderById(id);

      const response: OrderResponse = {
        success: true,
        message: 'Order status updated successfully'
      };

      if (updatedOrder.data) {
        response.data = updatedOrder.data;
      }

      return response;
    } catch (error) {
      console.error('Error updating order status:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  public async getOrdersByStatus(status: Order['status'], page: number = 1, limit: number = 10): Promise<OrdersResponse> {
    try {
      const offset = (page - 1) * limit;

      const orders = await this.database.query<Order>(
        'SELECT * FROM orders WHERE status = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
        [status, limit, offset]
      );

      const totalResult = await this.database.query<{ count: number }>(
        'SELECT COUNT(*) as count FROM orders WHERE status = ?',
        [status]
      );

      const total = totalResult[0]?.count || 0;

      return {
        success: true,
        data: orders,
        total,
        page,
        limit
      };
    } catch (error) {
      console.error('Error getting orders by status:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  public async getOrderByUniqueCode(kodeUnik: string): Promise<OrderResponse> {
    try {
      const result = await this.database.query<Order>(
        'SELECT * FROM orders WHERE kode_unik = ?',
        [kodeUnik]
      );

      if (result.length === 0) {
        return {
          success: false,
          error: 'Order not found'
        };
      }

      const response: OrderResponse = {
        success: true
      };

      if (result[0]) {
        response.data = result[0];
      }

      return response;
    } catch (error) {
      console.error('Error getting order by unique code:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  public async generateTestOrders(count: number = 50): Promise<{ success: boolean; message: string; created: number }> {
    try {
      const productNames = ['Produk A', 'Produk B', 'Produk C', 'Produk D', 'Produk E'];
      let created = 0;

      for (let i = 0; i < count; i++) {
        try {
          const randomProductId = Math.floor(Math.random() * 5) + 1;
          const randomProductName = productNames[randomProductId - 1] || 'Unknown Product';

          const orderData: CreateOrderRequest = {
            produk_id: randomProductId,
            nama_produk: randomProductName
          };

          const result = await this.createOrder(orderData);
          if (result.success) {
            created++;
          }
        } catch (error) {
          console.error(`Error creating test order ${i + 1}:`, error);
        }
      }

      return {
        success: true,
        message: `Successfully created ${created} test orders`,
        created
      };
    } catch (error) {
      console.error('Error generating test orders:', error);
      let errorMessage = 'Unknown error occurred';
      if (error instanceof Error && typeof error.message === 'string') {
        errorMessage = error.message;
      }
      return {
        success: false,
        message: errorMessage,
        created: 0
      };
    }
  }

  public async getOrderStatistics(): Promise<{
    success: boolean;
    data?: {
      totalOrders: number;
      pendingOrders: number;
      paidOrders: number;
      cancelledOrders: number;
      completedOrders: number;
      codeStatistics: any;
    };
    error?: string;
  }> {
    try {
      const totalResult = await this.database.query<{ count: number }>(
        'SELECT COUNT(*) as count FROM orders'
      );

      const statusResults = await this.database.query<{ status: string; count: number }>(
        'SELECT status, COUNT(*) as count FROM orders GROUP BY status'
      );

      const codeStatistics = await this.uniqueCodeGenerator.getCodeStatistics();

      const stats = {
        totalOrders: totalResult[0]?.count || 0,
        pendingOrders: 0,
        paidOrders: 0,
        cancelledOrders: 0,
        completedOrders: 0,
        codeStatistics
      };

      statusResults.forEach(row => {
        switch (row.status) {
          case 'pending':
            stats.pendingOrders = row.count;
            break;
          case 'paid':
            stats.paidOrders = row.count;
            break;
          case 'cancelled':
            stats.cancelledOrders = row.count;
            break;
          case 'completed':
            stats.completedOrders = row.count;
            break;
        }
      });

      return {
        success: true,
        data: stats
      };
    } catch (error) {
      console.error('Error getting order statistics:', error);
      return {
        success: false,
        error: error instanceof Error ? (error.message ?? 'Unknown error occurred') : 'Unknown error occurred'
      };
    }
  }
} 