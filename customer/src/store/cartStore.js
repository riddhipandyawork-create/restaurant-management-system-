import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  cart: [],
  isOpen: false,

  toggleCart: () => set(state => ({ isOpen: !state.isOpen })),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),

  addItem: (item) => {
    set(state => {
      const existing = state.cart.find(c => c.menuItem === item._id);
      if (existing) {
        return {
          cart: state.cart.map(c => c.menuItem === item._id ? { ...c, quantity: c.quantity + 1 } : c),
          isOpen: true
        };
      }
      return {
        cart: [...state.cart, { menuItem: item._id, name: item.name, price: item.price, quantity: 1, image: item.image }],
        isOpen: true
      };
    });
  },

  updateQuantity: (id, quantity) => {
    if (quantity <= 0) {
      get().removeItem(id);
      return;
    }
    set(state => ({
      cart: state.cart.map(c => c.menuItem === id ? { ...c, quantity } : c)
    }));
  },

  removeItem: (id) => set(state => ({
    cart: state.cart.filter(c => c.menuItem !== id)
  })),

  clearCart: () => set({ cart: [] })
}));
