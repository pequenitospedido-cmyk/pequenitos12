import { supabase, isSupabaseConfigured } from '../supabase';
import { OrderRecord } from '../../types/product';
import { INITIAL_DEMO_ORDERS } from '../../data/products';

const ORDERS_STORAGE_KEY = 'pequenitos_cms_orders_v1';

function getLocalOrders(): OrderRecord[] {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_ORDERS));
      return INITIAL_DEMO_ORDERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMO_ORDERS;
  }
}

export const orderService = {
  async listOrders(): Promise<OrderRecord[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((row: any) => ({
          id: row.id,
          orderNumber: row.order_number,
          customerName: `${row.customer_first_name} ${row.customer_last_name}`.trim(),
          customerEmail: row.customer_email,
          customerPhone: row.customer_phone,
          address: row.shipping_address,
          city: row.shipping_city,
          department: row.shipping_department,
          notes: row.notes || undefined,
          subtotal: Number(row.subtotal ?? 0),
          shippingCost: Number(row.shipping_cost ?? 0),
          total: Number(row.total ?? 0),
          paymentGateway: row.payment_gateway || 'wompi',
          paymentStatus: row.payment_status || 'pending',
          fulfillmentStatus: row.fulfillment_status || 'unfulfilled',
          itemsCount: 1,
          createdAt: row.created_at,
          isDemo: false,
        }));
      }
    }
    return getLocalOrders();
  },

  async createOrder(order: Omit<OrderRecord, 'id' | 'createdAt'>): Promise<OrderRecord> {
    const newOrder: OrderRecord = {
      ...order,
      id: `ord-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isDemo: !isSupabaseConfigured(),
    };

    if (isSupabaseConfigured() && supabase) {
      const [firstName, ...restName] = order.customerName.split(' ');
      await supabase.from('orders').insert({
        order_number: order.orderNumber,
        customer_first_name: firstName || order.customerName,
        customer_last_name: restName.join(' ') || '',
        customer_email: order.customerEmail,
        customer_phone: order.customerPhone,
        shipping_address: order.address,
        shipping_city: order.city,
        shipping_department: order.department,
        notes: order.notes || null,
        subtotal: order.subtotal,
        shipping_cost: order.shippingCost,
        total: order.total,
        payment_gateway: order.paymentGateway,
        payment_status: order.paymentStatus,
        fulfillment_status: order.fulfillmentStatus,
      });
    }

    const current = getLocalOrders();
    current.unshift(newOrder);
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(current));
    } catch {
      // Ignore storage error
    }
    return newOrder;
  },
};
