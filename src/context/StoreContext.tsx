import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Category,
  Banner,
  StoreSettings,
  CartItem,
  Order,
  Coupon
} from '../types/catalog';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_BANNERS,
  INITIAL_SETTINGS,
  INITIAL_COUPONS
} from '../data/initialData';
import { api } from '../services/api';

interface StoreContextType {
  products: Product[];
  categories: Category[];
  banners: Banner[];
  settings: StoreSettings;
  orders: Order[];
  coupons: Coupon[];
  
  // Cart state
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, options?: { color?: { name: string; hex: string }; size?: string; customNotes?: string; quantity?: number }) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  appliedCoupon: Coupon | null;
  applyCouponCode: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Cart calculations
  cartSubtotal: number;
  cartDiscount: number;
  cartShippingFee: number;
  cartTotal: number;

  // Wishlist
  wishlist: string[]; // product IDs
  toggleWishlist: (productId: string) => void;

  // Catalog filters
  activeCategory: string; // 'all' or category name
  setActiveCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
  setSortBy: (sort: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest') => void;
  inStockOnly: boolean;
  setInStockOnly: (val: boolean) => void;

  // Modal Detail state
  selectedProduct: Product | null;
  openProductModal: (product: Product) => void;
  closeProductModal: () => void;

  // Ultra HD Zoom Lightbox state
  zoomImage: { url: string; title: string } | null;
  openZoomLightbox: (url: string, title: string) => void;
  closeZoomLightbox: () => void;

  // Admin View state
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isAdminAuthenticated: boolean;
  authenticateAdmin: (pin: string) => boolean;
  logoutAdmin: () => void;

  // AI Assistant drawer
  isAiChatOpen: boolean;
  setIsAiChatOpen: (open: boolean) => void;

  // Actions
  saveProduct: (product: Partial<Product>) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  saveSettings: (newSettings: StoreSettings) => Promise<boolean>;
  saveCategories: (newCats: Category[]) => Promise<boolean>;
  saveBanners: (newBanners: Banner[]) => Promise<boolean>;
  submitOrderToWhatsApp: (customerInfo: {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    deliveryCity: string;
    paymentMethod: string;
    notes?: string;
  }) => Promise<{ whatsappUrl: string; order: Order }>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
  
  // Notification toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [banners, setBanners] = useState<Banner[]>(INITIAL_BANNERS);
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_SETTINGS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);

  // Cart & Wishlist persisted locally
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('nexo_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nexo_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [zoomImage, setZoomImage] = useState<{ url: string; title: string } | null>(null);

  // Filter states
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('featured');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  // Admin state
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('nexo_admin_auth') === 'true';
  });

  // AI Chat Assistant
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);

  // Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Sync cart & wishlist with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nexo_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('nexo_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  // Load backend store data on mount
  useEffect(() => {
    api.fetchStoreData().then(data => {
      if (data) {
        if (data.products) setProducts(data.products);
        if (data.categories) setCategories(data.categories);
        if (data.banners) setBanners(data.banners);
        if (data.settings) setSettings(data.settings);
        if (data.orders) setOrders(data.orders);
        if (data.coupons) setCoupons(data.coupons);
      }
    });
  }, []);

  // Cart actions
  const addToCart = (
    product: Product,
    options?: { color?: { name: string; hex: string }; size?: string; customNotes?: string; quantity?: number }
  ) => {
    const qty = options?.quantity || 1;
    const colorStr = options?.color?.name || 'default';
    const sizeStr = options?.size || 'default';
    const cartItemId = `${product.id}_${colorStr}_${sizeStr}`;

    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => item.id === cartItemId);
      if (existingIndex >= 0) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += qty;
        if (options?.customNotes) {
          updated[existingIndex].customNotes = options.customNotes;
        }
        return updated;
      } else {
        const newItem: CartItem = {
          id: cartItemId,
          product,
          selectedColor: options?.color,
          selectedSize: options?.size,
          quantity: qty,
          customNotes: options?.customNotes,
          unitPrice: product.price
        };
        return [...prevCart, newItem];
      }
    });

    showToast(`🛒 ¡${product.title.slice(0, 30)}... añadido al carrito!`);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Coupon calculations
  const applyCouponCode = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find(c => c.code.toUpperCase() === cleanCode && c.active);

    if (!found) {
      return { success: false, message: 'Código de cupón no válido o expirado.' };
    }

    if (found.minPurchase && cartSubtotal < found.minPurchase) {
      return {
        success: false,
        message: `Este cupón requiere una compra mínima de ${settings.currencySymbol}${found.minPurchase}`
      };
    }

    setAppliedCoupon(found);
    return { success: true, message: `¡Cupón ${found.code} aplicado con éxito!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Cart financial totals
  const cartSubtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  let cartDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      cartDiscount = (cartSubtotal * appliedCoupon.discountValue) / 100;
    } else {
      cartDiscount = appliedCoupon.discountValue;
    }
  }

  const cartShippingFee =
    cartSubtotal >= settings.freeShippingThreshold || cartSubtotal === 0
      ? 0
      : settings.shippingFee;

  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + cartShippingFee);

  // Wishlist actions
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Eliminado de tus favoritos ❤️');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Guardado en tus favoritos ❤️');
        return [...prev, productId];
      }
    });
  };

  // Product modal
  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
  };

  // Zoom Lightbox
  const openZoomLightbox = (url: string, title: string) => {
    setZoomImage({ url, title });
  };

  const closeZoomLightbox = () => {
    setZoomImage(null);
  };

  // Admin authentication
  const authenticateAdmin = (pin: string) => {
    if (pin === settings.adminPin) {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem('nexo_admin_auth', 'true');
      showToast('🔑 ¡Sesión de Administrador activada!');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('nexo_admin_auth');
    showToast('Sesión de administración cerrada');
  };

  // Persistence actions
  const saveProduct = async (productData: Partial<Product>) => {
    const result = await api.saveProduct(productData);
    if (result.success && result.products) {
      setProducts(result.products);
      showToast('✅ Producto guardado correctamente');
      return true;
    }
    return false;
  };

  const deleteProduct = async (id: string) => {
    const result = await api.deleteProduct(id);
    if (result.success && result.products) {
      setProducts(result.products);
      showToast('🗑️ Producto eliminado');
      return true;
    }
    return false;
  };

  const saveSettings = async (newSettings: StoreSettings) => {
    const result = await api.updateSettings(newSettings);
    if (result.success && result.settings) {
      setSettings(result.settings);
      showToast('⚙️ Configuración de la tienda actualizada');
      return true;
    }
    return false;
  };

  const saveCategories = async (newCats: Category[]) => {
    const result = await api.updateCategories(newCats);
    if (result.success && result.categories) {
      setCategories(result.categories);
      showToast('📁 Categorías actualizadas');
      return true;
    }
    return false;
  };

  const saveBanners = async (newBanners: Banner[]) => {
    const result = await api.updateBanners(newBanners);
    if (result.success && result.banners) {
      setBanners(result.banners);
      showToast('🎨 Banners actualizados');
      return true;
    }
    return false;
  };

  // WhatsApp Order Generation
  const submitOrderToWhatsApp = async (customerInfo: {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    deliveryCity: string;
    paymentMethod: string;
    notes?: string;
  }) => {
    const orderId = `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Build itemized list for WhatsApp
    const itemsListStr = cart
      .map((item, idx) => {
        let details = [];
        if (item.selectedColor) details.push(`Color: ${item.selectedColor.name}`);
        if (item.selectedSize) details.push(`Talla: ${item.selectedSize}`);
        if (item.customNotes) details.push(`Nota: "${item.customNotes}"`);

        const extraText = details.length > 0 ? ` (${details.join(' | ')})` : '';
        return `${idx + 1}. *${item.product.title}*${extraText}\n   └ Cantidad: ${item.quantity} x ${settings.currencySymbol}${item.unitPrice} = *${settings.currencySymbol}${item.quantity * item.unitPrice}*`;
      })
      .join('\n');

    // Process message template
    let message = settings.whatsappMessageTemplate || INITIAL_SETTINGS.whatsappMessageTemplate;
    message = message
      .replace(/{store_name}/g, settings.storeName)
      .replace(/{order_id}/g, orderId)
      .replace(/{customer_name}/g, customerInfo.customerName)
      .replace(/{customer_phone}/g, customerInfo.customerPhone)
      .replace(/{customer_address}/g, customerInfo.customerAddress)
      .replace(/{delivery_city}/g, customerInfo.deliveryCity)
      .replace(/{items_list}/g, itemsListStr)
      .replace(/{currency}/g, settings.currencySymbol)
      .replace(/{subtotal}/g, cartSubtotal.toFixed(2))
      .replace(/{discount}/g, cartDiscount.toFixed(2))
      .replace(/{shipping}/g, cartShippingFee.toFixed(2))
      .replace(/{total}/g, cartTotal.toFixed(2))
      .replace(/{payment_method}/g, customerInfo.paymentMethod)
      .replace(/{notes}/g, customerInfo.notes || 'Sin observaciones');

    // Format phone number
    const cleanPhone = settings.whatsappNumber.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

    // Create order record for Admin
    const orderRecord: Order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      customerName: customerInfo.customerName,
      customerPhone: customerInfo.customerPhone,
      customerAddress: customerInfo.customerAddress,
      deliveryCity: customerInfo.deliveryCity,
      paymentMethod: customerInfo.paymentMethod,
      items: cart.map(i => ({
        productId: i.product.id,
        title: i.product.title,
        quantity: i.quantity,
        color: i.selectedColor?.name,
        size: i.selectedSize,
        notes: i.customNotes,
        price: i.unitPrice,
        total: i.quantity * i.unitPrice
      })),
      subtotal: cartSubtotal,
      discountAmount: cartDiscount,
      couponCode: appliedCoupon?.code,
      shippingFee: cartShippingFee,
      total: cartTotal,
      status: 'pendiente',
      notes: customerInfo.notes,
      whatsappSentAt: new Date().toISOString()
    };

    // Log to server API
    const res = await api.logOrder(orderRecord);
    if (res && res.orders) {
      setOrders(res.orders);
    } else {
      setOrders(prev => [orderRecord, ...prev]);
    }

    return { whatsappUrl, order: orderRecord };
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    const res = await api.updateOrderStatus(id, status);
    if (res && res.order) {
      setOrders(prev =>
        prev.map(o => (o.id === id ? { ...o, status } : o))
      );
      showToast(`Estado de pedido ${id} cambiado a "${status}"`);
    }
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        banners,
        settings,
        orders,
        coupons,
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        appliedCoupon,
        applyCouponCode,
        removeCoupon,
        cartSubtotal,
        cartDiscount,
        cartShippingFee,
        cartTotal,
        wishlist,
        toggleWishlist,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        selectedTag,
        setSelectedTag,
        priceRange,
        setPriceRange,
        sortBy,
        setSortBy,
        inStockOnly,
        setInStockOnly,
        selectedProduct,
        openProductModal,
        closeProductModal,
        zoomImage,
        openZoomLightbox,
        closeZoomLightbox,
        isAdminOpen,
        setIsAdminOpen,
        isAdminAuthenticated,
        authenticateAdmin,
        logoutAdmin,
        isAiChatOpen,
        setIsAiChatOpen,
        saveProduct,
        deleteProduct,
        saveSettings,
        saveCategories,
        saveBanners,
        submitOrderToWhatsApp,
        updateOrderStatus,
        toastMessage,
        showToast
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore debe ser usado dentro de un StoreProvider');
  }
  return context;
};
