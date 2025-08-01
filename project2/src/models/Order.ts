export interface Order {
  id?: number;
  produk_id: number;
  nama_produk: string;
  harga: number;
  kode_unik: string;
  status: 'pending' | 'paid' | 'cancelled' | 'completed';
  tanggal?: Date;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateOrderRequest {
  produk_id: number;
  nama_produk: string;
}

export interface OrderResponse {
  success: boolean;
  data?: Order;
  message?: string;
  error?: string;
}

export interface OrdersResponse {
  success: boolean;
  data?: Order[];
  message?: string;
  error?: string;
  total?: number;
  page?: number;
  limit?: number;
} 