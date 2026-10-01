import { Product, Category, Banner, StoreSettings, Order, Coupon } from '../types/catalog';

export const api = {
  async fetchStoreData() {
    try {
      const res = await fetch('/api/store');
      if (!res.ok) throw new Error('Error al cargar datos del servidor');
      return await res.json();
    } catch (err) {
      console.warn('Fallback a almacenamiento local por red:', err);
      return null;
    }
  },

  async saveProduct(product: Partial<Product>) {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      return await res.json();
    } catch (err) {
      console.error('Error al guardar producto:', err);
      return { success: false };
    }
  },

  async deleteProduct(id: string) {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      });
      return await res.json();
    } catch (err) {
      console.error('Error al eliminar producto:', err);
      return { success: false };
    }
  },

  async updateCategories(categories: Category[]) {
    try {
      const res = await fetch('/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categories })
      });
      return await res.json();
    } catch (err) {
      console.error('Error al actualizar categorías:', err);
      return { success: false };
    }
  },

  async updateBanners(banners: Banner[]) {
    try {
      const res = await fetch('/api/banners', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ banners })
      });
      return await res.json();
    } catch (err) {
      console.error('Error al actualizar banners:', err);
      return { success: false };
    }
  },

  async updateSettings(settings: StoreSettings) {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      return await res.json();
    } catch (err) {
      console.error('Error al actualizar configuración:', err);
      return { success: false };
    }
  },

  async logOrder(orderData: Partial<Order>) {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      return await res.json();
    } catch (err) {
      console.error('Error al registrar pedido:', err);
      return { success: false };
    }
  },

  async updateOrderStatus(id: string, status: Order['status']) {
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      return await res.json();
    } catch (err) {
      console.error('Error al actualizar estado del pedido:', err);
      return { success: false };
    }
  },

  async generateAiDescription(title: string, category: string, keywords?: string) {
    try {
      const res = await fetch('/api/ai/describe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category, keywords })
      });
      return await res.json();
    } catch (err) {
      console.error('Error con IA descripciones:', err);
      return null;
    }
  },

  async askAiShopperAssistant(message: string, history?: any[]) {
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history })
      });
      return await res.json();
    } catch (err) {
      console.error('Error con Asistente IA de compras:', err);
      return { reply: "Lo siento, tuve un problema temporal. ¡Pero puedes explorar las categorías arriba!", recommendedProductIds: [] };
    }
  }
};
