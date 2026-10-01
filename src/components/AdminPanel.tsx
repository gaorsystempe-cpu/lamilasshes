import React, { useState } from 'react';
import {
  X,
  Lock,
  LayoutDashboard,
  Package,
  ListFilter,
  Settings,
  Plus,
  Edit,
  Trash2,
  Sparkles,
  Save,
  Check,
  Search,
  MessageSquare,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Eye,
  RefreshCw,
  Phone,
  ImageIcon,
  ChevronRight,
  ShieldCheck,
  SlidersHorizontal
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, Category, Banner, StoreSettings } from '../types/catalog';
import { api } from '../services/api';

export const AdminPanel: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    isAdminAuthenticated,
    authenticateAdmin,
    logoutAdmin,
    products,
    categories,
    banners,
    settings,
    orders,
    saveProduct,
    deleteProduct,
    saveSettings,
    saveCategories,
    saveBanners,
    updateOrderStatus,
    showToast
  } = useStore();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'categories' | 'settings'>('dashboard');
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Product Editing Modal
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // New Category
  const [newCatName, setNewCatName] = useState('');
  const [newCatImage, setNewCatImage] = useState('');

  // Settings form local state
  const [settingsForm, setSettingsForm] = useState<StoreSettings>(settings);

  if (!isAdminOpen) return null;

  // PIN Login Screen (Mobile Native App Modal)
  if (!isAdminAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
        <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-pink-200 text-center relative">
          <button
            onClick={() => setIsAdminOpen(false)}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 bg-pink-100 text-[#064e3b] rounded-2xl flex items-center justify-center mx-auto mb-4 font-heading font-extrabold text-xl shadow-xs">
            L'A
          </div>

          <h2 className="text-lg font-bold font-heading text-[#064e3b] mb-1">
            LAMI LASHES® Admin App
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            Ingresa tu PIN de seguridad (PIN por defecto: <span className="font-mono font-bold text-slate-800">1234</span>)
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const success = authenticateAdmin(pinInput);
              if (!success) {
                setPinError(true);
              }
            }}
            className="space-y-4"
          >
            <div>
              <input
                type="password"
                placeholder="****"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                maxLength={6}
                autoFocus
                className="w-full text-center text-3xl font-mono tracking-widest bg-pink-50/60 border border-pink-200 rounded-2xl h-14 outline-none focus:border-[#064e3b] focus:bg-white transition-all"
              />
              {pinError && (
                <p className="text-xs text-rose-600 mt-2 font-semibold">
                  ⚠️ PIN incorrecto. Prueba con 1234
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#064e3b] hover:bg-[#042f2e] text-white font-bold text-xs uppercase tracking-wider h-12 rounded-xl transition-all shadow-md active:scale-95"
            >
              Entrar al Panel App
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Calculate Metrics
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const lowStockCount = products.filter(p => p.stockCount <= 3).length;

  const handleGenerateAiCopy = async () => {
    if (!editingProduct?.title) {
      showToast('⚠️ Ingresa al menos el título del producto.');
      return;
    }

    setIsAiGenerating(true);
    try {
      const result = await api.generateAiDescription(
        editingProduct.title,
        editingProduct.category || 'General',
        editingProduct.tags?.join(', ')
      );

      if (result) {
        setEditingProduct(prev => ({
          ...prev,
          description: result.description || prev?.description,
          features: result.features || prev?.features,
          tags: Array.from(new Set([...(prev?.tags || []), ...(result.tags || [])]))
        }));
        showToast('✨ ¡Descripción generada con IA!');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex flex-col justify-between overflow-hidden animate-fadeIn">
      {/* Mobile Native App Top Navigation Bar */}
      <div className="p-4 bg-[#064e3b] text-white flex items-center justify-between shadow-md shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-pink-300 text-[#064e3b] font-heading font-extrabold text-xs flex items-center justify-center">
            LAMI
          </div>
          <div>
            <h2 className="text-sm font-bold font-heading">Control Panel App</h2>
            <p className="text-[10px] text-pink-200">LAMI LASHES® Admin</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={logoutAdmin}
            className="text-xs text-pink-200 hover:text-white underline"
          >
            Salir
          </button>
          <button
            onClick={() => setIsAdminOpen(false)}
            className="p-1.5 text-pink-200 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile App Segmented Navigation Tabs */}
      <div className="bg-white border-b border-pink-200 px-3 py-2 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeTab === 'dashboard'
              ? 'bg-[#064e3b] text-white shadow-sm'
              : 'text-slate-600 hover:bg-pink-50'
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span>Resumen</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeTab === 'products'
              ? 'bg-[#064e3b] text-white shadow-sm'
              : 'text-slate-600 hover:bg-pink-50'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Productos</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeTab === 'categories'
              ? 'bg-[#064e3b] text-white shadow-sm'
              : 'text-slate-600 hover:bg-pink-50'
          }`}
        >
          <ListFilter className="w-3.5 h-3.5" />
          <span>Categorías</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('settings');
            setSettingsForm(settings);
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeTab === 'settings'
              ? 'bg-[#064e3b] text-white shadow-sm'
              : 'text-slate-600 hover:bg-pink-50'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>WhatsApp & Tienda</span>
        </button>
      </div>

      {/* Main Mobile App Scroll Body */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#fdf2f8]/50 pb-safe">
        {/* TAB 1: RESUMEN MOBILE */}
        {activeTab === 'dashboard' && (
          <div className="space-y-4 max-w-lg mx-auto">
            {/* Stat Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-3.5 rounded-2xl border border-pink-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[11px] font-bold text-slate-600">Productos</span>
                  <Package className="w-4 h-4 text-[#064e3b]" />
                </div>
                <div className="text-xl font-extrabold font-mono text-[#064e3b]">{totalProducts}</div>
                <span className="text-[10px] text-slate-400">En catálogo</span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-pink-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[11px] font-bold text-slate-600">Pedidos</span>
                  <MessageSquare className="w-4 h-4 text-[#064e3b]" />
                </div>
                <div className="text-xl font-extrabold font-mono text-[#064e3b]">{totalOrders}</div>
                <span className="text-[10px] text-slate-400">Generados a WhatsApp</span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-pink-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[11px] font-bold text-slate-600">Ventas Est.</span>
                  <DollarSign className="w-4 h-4 text-[#064e3b]" />
                </div>
                <div className="text-xl font-extrabold font-mono text-[#064e3b]">
                  {settings.currencySymbol}{totalRevenue.toFixed(2)}
                </div>
                <span className="text-[10px] text-slate-400">Monto acumulado</span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-pink-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[11px] font-bold text-slate-600">Stock Alerta</span>
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-xl font-extrabold font-mono text-amber-600">{lowStockCount}</div>
                <span className="text-[10px] text-slate-400">≤ 3 unidades</span>
              </div>
            </div>

            {/* Mobile Orders List */}
            <div className="bg-white rounded-2xl border border-pink-200 p-4 shadow-xs">
              <h3 className="text-xs font-bold text-[#064e3b] uppercase tracking-wider mb-3">
                Historial de Pedidos WhatsApp ({orders.length})
              </h3>

              {orders.length > 0 ? (
                <div className="space-y-2.5">
                  {orders.map(order => (
                    <div key={order.id} className="p-3 bg-pink-50/50 border border-pink-100 rounded-xl text-xs space-y-1.5">
                      <div className="flex justify-between items-center font-bold">
                        <span className="font-mono text-slate-900">{order.id}</span>
                        <span className="font-mono text-[#064e3b]">
                          {settings.currencySymbol}{order.total?.toFixed(2)}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-600 flex justify-between">
                        <span>👤 {order.customerName}</span>
                        <span className="font-mono">{order.customerPhone}</span>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-pink-100">
                        <span className="text-[10px] text-slate-400">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                          className="bg-white border border-pink-200 rounded px-2 py-0.5 text-[10px] font-bold outline-none"
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="confirmado">Confirmado</option>
                          <option value="enviado">Enviado</option>
                          <option value="completado">Completado</option>
                          <option value="cancelado">Cancelado</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 text-center py-4">No hay pedidos aún.</p>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTOS MOBILE CRUD */}
        {activeTab === 'products' && (
          <div className="space-y-3 max-w-lg mx-auto">
            <div className="flex justify-between items-center bg-white p-3.5 rounded-2xl border border-pink-200">
              <span className="text-xs font-bold text-[#064e3b]">Total Ítems: {products.length}</span>
              <button
                onClick={() =>
                  setEditingProduct({
                    title: '',
                    sku: `SKU-${Date.now().toString().slice(-6)}`,
                    category: categories[0]?.name || 'General',
                    tags: ['Nuevo'],
                    price: 100,
                    compareAtPrice: 120,
                    description: '',
                    features: [],
                    images: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80'],
                    rating: 5.0,
                    reviewsCount: 1,
                    isNew: true,
                    inStock: true,
                    stockCount: 10
                  })
                }
                className="bg-[#064e3b] text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Nuevo</span>
              </button>
            </div>

            {/* Mobile Product Cards List */}
            <div className="space-y-2">
              {products.map(p => (
                <div key={p.id} className="p-3 bg-white border border-pink-200 rounded-2xl flex items-center gap-3 shadow-2xs">
                  <img
                    src={p.images?.[0] || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=100&auto=format&fit=crop&q=80'}
                    alt={p.title}
                    className="w-14 h-14 rounded-xl object-cover bg-slate-100 shrink-0 border border-pink-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{p.title}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{p.sku} | {p.category}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-extrabold font-mono text-[#064e3b]">
                        {settings.currencySymbol}{p.price.toFixed(2)}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                        {p.stockCount} un.
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingProduct(p)}
                      className="p-2 text-slate-600 hover:text-[#064e3b] bg-pink-50 rounded-xl"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar ${p.title}?`)) deleteProduct(p.id);
                      }}
                      className="p-2 text-slate-400 hover:text-rose-600 bg-pink-50 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: CATEGORIAS MOBILE */}
        {activeTab === 'categories' && (
          <div className="space-y-4 max-w-lg mx-auto">
            <div className="bg-white p-4 rounded-2xl border border-pink-200 space-y-3">
              <h3 className="text-xs font-bold text-[#064e3b] uppercase">Categorías ({categories.length})</h3>
              <div className="space-y-2">
                {categories.map(cat => (
                  <div key={cat.id} className="flex items-center justify-between p-2.5 bg-pink-50/50 rounded-xl text-xs border border-pink-100">
                    <div className="flex items-center gap-2.5">
                      <img src={cat.image} alt={cat.name} className="w-8 h-8 rounded-lg object-cover" />
                      <span className="font-bold text-slate-800">{cat.name}</span>
                    </div>
                    <button
                      onClick={() => saveCategories(categories.filter(c => c.id !== cat.id))}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-pink-100 space-y-2">
                <input
                  type="text"
                  placeholder="Nombre categoría"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full bg-slate-50 border border-pink-200 rounded-xl p-2.5 text-xs outline-none focus:border-[#064e3b]"
                />
                <button
                  onClick={() => {
                    if (!newCatName) return;
                    saveCategories([
                      ...categories,
                      {
                        id: `cat_${Date.now()}`,
                        name: newCatName,
                        slug: newCatName.toLowerCase().replace(/\s+/g, '-'),
                        description: `Colección de ${newCatName}`,
                        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80'
                      }
                    ]);
                    setNewCatName('');
                  }}
                  className="w-full bg-[#064e3b] text-white font-bold text-xs py-2.5 rounded-xl"
                >
                  + Agregar Categoría
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SETTINGS MOBILE */}
        {activeTab === 'settings' && (
          <div className="bg-white p-4 rounded-2xl border border-pink-200 space-y-4 max-w-lg mx-auto text-xs">
            <h3 className="text-xs font-bold text-[#064e3b] uppercase border-b border-pink-100 pb-2">
              Ajustes de Tienda & WhatsApp
            </h3>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Número de WhatsApp:</label>
              <input
                type="text"
                value={settingsForm.whatsappNumber}
                onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                className="w-full bg-slate-50 border border-pink-200 rounded-xl p-2.5 font-mono outline-none focus:border-[#064e3b]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Símbolo de Moneda:</label>
              <input
                type="text"
                value={settingsForm.currencySymbol}
                onChange={(e) => setSettingsForm({ ...settingsForm, currencySymbol: e.target.value })}
                className="w-full bg-slate-50 border border-pink-200 rounded-xl p-2.5 font-mono outline-none focus:border-[#064e3b]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">PIN Admin:</label>
              <input
                type="text"
                value={settingsForm.adminPin}
                onChange={(e) => setSettingsForm({ ...settingsForm, adminPin: e.target.value })}
                className="w-full bg-slate-50 border border-pink-200 rounded-xl p-2.5 font-mono outline-none focus:border-[#064e3b]"
              />
            </div>

            <button
              onClick={() => saveSettings(settingsForm)}
              className="w-full bg-[#064e3b] text-white font-bold text-xs py-3 rounded-xl shadow-md"
            >
              Guardar Ajustes
            </button>
          </div>
        )}
      </div>

      {/* Edit Product Sub-Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-60 bg-slate-950/90 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl relative my-6 border border-pink-200">
            <button
              onClick={() => setEditingProduct(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-sm font-bold font-heading text-[#064e3b] mb-3">
              {editingProduct.id ? 'Editar Producto' : 'Nuevo Producto'}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">Título</label>
                <input
                  type="text"
                  value={editingProduct.title || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                  className="w-full bg-slate-50 border border-pink-200 rounded-xl p-2.5 outline-none focus:border-[#064e3b]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Precio</label>
                  <input
                    type="number"
                    value={editingProduct.price || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-pink-200 rounded-xl p-2.5 font-mono outline-none focus:border-[#064e3b]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Stock</label>
                  <input
                    type="number"
                    value={editingProduct.stockCount || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stockCount: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-pink-200 rounded-xl p-2.5 font-mono outline-none focus:border-[#064e3b]"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleGenerateAiCopy}
                disabled={isAiGenerating}
                className="w-full bg-pink-100 text-[#064e3b] font-bold text-xs py-2 rounded-xl flex items-center justify-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isAiGenerating ? 'Generando...' : '✨ Autocompletar con IA'}</span>
              </button>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">Descripción</label>
                <textarea
                  rows={2}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full bg-slate-50 border border-pink-200 rounded-xl p-2.5 outline-none focus:border-[#064e3b]"
                />
              </div>

              <button
                onClick={async () => {
                  if (!editingProduct.title) return;
                  await saveProduct(editingProduct);
                  setEditingProduct(null);
                }}
                className="w-full bg-[#064e3b] text-white font-bold text-xs py-3 rounded-xl shadow-md"
              >
                Guardar Producto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
