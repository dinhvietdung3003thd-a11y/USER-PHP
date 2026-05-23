import { appConfig } from '../config/appConfig';
import type { OrderDetail, OrderItem, OrderSummary } from '../types/order.types';
import { buildApiErrorMessage, isNetworkError } from './apiError';

interface ApiOrderDetailItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface ApiClientOrder {
  orderId: number;
  createdAt: string;
  totalAmount: number;
  tableId: number | null;
  status: string;
  customerId: number;
  customerName: string | null;
  details: ApiOrderDetailItem[];
}

interface CreateOrderDetailRequest {
  productId: number;
  quantity: number;
}

interface CreateOrderRequest {
  orderDate: string;
  tableId: null;
  note: string;
  details: CreateOrderDetailRequest[];
}

interface CreateOrderResponse {
  orderId: number;
}

const resolveApiUrl = (path: string) => `${appConfig.apiBaseUrl}${path}`;

const mapOrderItem = (item: ApiOrderDetailItem): OrderItem => ({
  productId: String(item.productId),
  productName: item.productName,
  quantity: item.quantity,
  unitPrice: item.unitPrice,
  subtotal: item.subtotal
});

const mapOrderSummary = (order: ApiClientOrder): OrderSummary => ({
  orderId: String(order.orderId),
  orderDate: order.createdAt,
  status: order.status,
  totalAmount: order.totalAmount
});

const mapOrderDetail = (order: ApiClientOrder): OrderDetail => ({
  ...mapOrderSummary(order),
  items: order.details.map(mapOrderItem)
});

export const orderService = {
  async fetchClientOrders(token: string): Promise<OrderSummary[]> {
    try {
      const response = await fetch(resolveApiUrl('/api/client/orders'), {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(await buildApiErrorMessage(response, 'Unable to load orders.'));
      }

      const data = (await response.json()) as ApiClientOrder[];
      return data.map(mapOrderSummary);
    } catch (error) {
      if (isNetworkError(error)) {
        throw new Error('Cannot connect to server. Please try again later.');
      }

      throw error;
    }
  },

  async fetchClientOrderById(orderId: string, token: string): Promise<OrderDetail | null> {
    try {
      const response = await fetch(resolveApiUrl(`/api/client/orders/${orderId}`), {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error(await buildApiErrorMessage(response, 'Unable to load order detail.'));
      }

      const data = (await response.json()) as ApiClientOrder;
      return mapOrderDetail(data);
    } catch (error) {
      if (isNetworkError(error)) {
        throw new Error('Cannot connect to server. Please try again later.');
      }

      throw error;
    }
  },

  async createClientOrder(payload: CreateOrderRequest, token: string): Promise<CreateOrderResponse> {
    try {
      const response = await fetch(resolveApiUrl('/api/client/orders'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(await buildApiErrorMessage(response, 'Unable to create order. Please try again.'));
      }

      return (await response.json()) as CreateOrderResponse;
    } catch (error) {
      if (isNetworkError(error)) {
        throw new Error('Cannot connect to server. Please try again later.');
      }

      throw error;
    }
  }
};
