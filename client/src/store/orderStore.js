import { create } from 'zustand';
import api from '../services/api';

export const useOrderStore = create((set, get) => ({
  orders: [],
  loading: false,

  fetchOrders: async (params = {}) => {
    set({ loading: true });
    try {
      const { data } = await api.get('/orders', { params });
      set({ orders: data, loading: false });
    } catch { set({ loading: false }); }
  },

  createOrder: async (orderData) => {
    const { data } = await api.post('/orders', orderData);
    set((s) => ({ orders: [data, ...s.orders] }));
    return data;
  },

  updateStatus: async (id, status) => {
    const { data } = await api.patch(`/orders/${id}/status`, { status });
    set((s) => ({ orders: s.orders.map((o) => (o._id === id ? data : o)) }));
    return data;
  },

  updateItemStatus: async (orderId, itemId, status) => {
    const { data } = await api.patch(`/orders/${orderId}/item-status`, { itemId, status });
    set((s) => ({ orders: s.orders.map((o) => (o._id === orderId ? data : o)) }));
  },

  addSocketOrder: (order) => set((s) => ({ orders: [order, ...s.orders] })),
  updateSocketOrder: (order) => set((s) => ({ orders: s.orders.map((o) => (o._id === order._id ? order : o)) })),
}));
