import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_BANNERS,
  INITIAL_SETTINGS,
  INITIAL_COUPONS
} from './src/data/initialData.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Data file path for persistence
const DATA_DIR = path.join(__dirname, 'data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial state container
let storeData = {
  products: INITIAL_PRODUCTS,
  categories: INITIAL_CATEGORIES,
  banners: INITIAL_BANNERS,
  settings: INITIAL_SETTINGS,
  coupons: INITIAL_COUPONS,
  orders: [
    {
      id: "ORD-2026-1001",
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      customerName: "Carlos Mendoza",
      customerPhone: "+51 912345678",
      customerAddress: "Av. Larco 1234, Dpto 402",
      deliveryCity: "Miraflores, Lima",
      paymentMethod: "Yape / Plin",
      items: [
        {
          productId: "prod_1",
          title: "Reloj Cronógrafo Navy Zafiro Ultra Precision",
          quantity: 1,
          color: "Azul Marino / Plata",
          size: "42mm Standard",
          price: 380,
          total: 380
        }
      ],
      subtotal: 380,
      discountAmount: 0,
      shippingFee: 0,
      total: 380,
      status: "confirmado" as const,
      notes: "Por favor entregar en recepción.",
      whatsappSentAt: new Date(Date.now() - 86400000 * 2).toISOString()
    }
  ]
};

// Load existing store data if present
if (fs.existsSync(STORE_FILE)) {
  try {
    const raw = fs.readFileSync(STORE_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    storeData = { ...storeData, ...parsed };
    console.log('Successfully loaded persisted store data.');
  } catch (err) {
    console.error('Error reading store.json, using default initial data.', err);
  }
} else {
  saveStoreData();
}

function saveStoreData() {
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(storeData, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving store data:', err);
  }
}

// --- API Endpoints ---

// Get full store data
app.get('/api/store', (req, res) => {
  res.json(storeData);
});

// Create or update a product
app.post('/api/products', (req, res) => {
  const product = req.body;
  if (!product || !product.title) {
    return res.status(400).json({ error: 'Producto no válido' });
  }

  const index = storeData.products.findIndex(p => p.id === product.id);
  if (index >= 0) {
    storeData.products[index] = { ...storeData.products[index], ...product };
  } else {
    const newProduct = {
      ...product,
      id: product.id || `prod_${Date.now()}`,
      createdAt: product.createdAt || new Date().toISOString()
    };
    storeData.products.unshift(newProduct);
  }

  saveStoreData();
  res.json({ success: true, products: storeData.products });
});

// Delete product
app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  storeData.products = storeData.products.filter(p => p.id !== id);
  saveStoreData();
  res.json({ success: true, products: storeData.products });
});

// Update categories
app.put('/api/categories', (req, res) => {
  const { categories } = req.body;
  if (Array.isArray(categories)) {
    storeData.categories = categories;
    saveStoreData();
  }
  res.json({ success: true, categories: storeData.categories });
});

// Update banners
app.put('/api/banners', (req, res) => {
  const { banners } = req.body;
  if (Array.isArray(banners)) {
    storeData.banners = banners;
    saveStoreData();
  }
  res.json({ success: true, banners: storeData.banners });
});

// Update settings
app.put('/api/settings', (req, res) => {
  const settings = req.body;
  if (settings) {
    storeData.settings = { ...storeData.settings, ...settings };
    saveStoreData();
  }
  res.json({ success: true, settings: storeData.settings });
});

// Log a new order (e.g. from WhatsApp Checkout)
app.post('/api/orders', (req, res) => {
  const orderData = req.body;
  if (!orderData || !orderData.customerName) {
    return res.status(400).json({ error: 'Datos de orden incompletos' });
  }

  const newOrder = {
    ...orderData,
    id: orderData.id || `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
    status: orderData.status || 'pendiente',
    whatsappSentAt: new Date().toISOString()
  };

  storeData.orders.unshift(newOrder);
  saveStoreData();
  res.json({ success: true, order: newOrder, orders: storeData.orders });
});

// Update order status
app.put('/api/orders/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const order = storeData.orders.find(o => o.id === id);
  if (order) {
    order.status = status;
    saveStoreData();
    res.json({ success: true, order });
  } else {
    res.status(404).json({ error: 'Orden no encontrada' });
  }
});

// --- Gemini AI Endpoints ---

// Initialize Gemini client if API key is present
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

// AI product description generator
app.post('/api/ai/describe', async (req, res) => {
  try {
    const { title, category, keywords } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        description: `${title} - Producto de alta calidad dentro de la categoría ${category}. Elaborado con materiales resistentes, acabado elegante y diseñado para brindar una experiencia superior.`,
        features: [
          "Diseño exclusivo y ergonomía avanzada",
          "Materiales de alta durabilidad probados",
          "Garantía directa de satisfacción"
        ],
        tags: [category, "Tendencia", "Alta Calidad", "Destacado"]
      });
    }

    const prompt = `Actúa como un experto redactor publicitario y e-commerce copywriter profesional.
Crea una descripción atrayente, elegante y persuasiva en ESPAÑOL para el siguiente producto:
- Título del Producto: ${title}
- Categoría: ${category}
- Palabras clave / Detalles: ${keywords || 'Alta calidad, diseño moderno, durabilidad'}

Devuelve únicamente un JSON válido con el siguiente esquema estricto (sin bloques markdown ni envoltorios):
{
  "description": "Un párrafo persuasivo y profesional de 3 a 5 oraciones.",
  "features": ["3 a 4 viñetas clave que destaquen beneficios técnicos o estéticos"],
  "tags": ["4 a 6 etiquetas cortas para filtrado en tienda"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    const text = response.text || '';
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const result = JSON.parse(cleanJson);
    res.json(result);
  } catch (err) {
    console.error('Error generating AI description:', err);
    res.json({
      description: `Excelente opción de la categoría ${req.body.category || 'tienda'}. Diseño sofisticado, excelente rendimiento y listo para envío inmediato por WhatsApp.`,
      features: [
        "Acabados de primera calidad",
        "Resistencia garantizada",
        "Ideal para regalos o uso diario"
      ],
      tags: ["Calidad", "Nuevo", "Destacado"]
    });
  }
});

// AI Catalog Shopper Assistant
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    const ai = getGeminiClient();

    const catalogSummary = storeData.products.map(p => ({
      id: p.id,
      title: p.title,
      category: p.category,
      price: `${storeData.settings.currencySymbol} ${p.price}`,
      tags: p.tags.join(', '),
      description: p.description
    }));

    if (!ai) {
      // Intelligent fallback matching
      const query = (message || '').toLowerCase();
      const matched = storeData.products.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.tags.some(t => t.toLowerCase().includes(query))
      );

      let replyText = "¡Hola! Con gusto te ayudo a encontrar lo que buscas en nuestro catálogo NEXO Studio.";
      if (matched.length > 0) {
        replyText = `¡Encontré excelentes opciones para ti! Te recomiendo revisar: **${matched[0].title}** por ${storeData.settings.currencySymbol}${matched[0].price}. ¡Puedes hacer clic para ver todos los detalles o pedirlo directo por WhatsApp!`;
      } else {
        replyText = `Te sugiero explorar nuestras categorías principales: Relojes de Zafiro, Calzado Urbano, Mochilas de Cuero y Audio HD. ¿Buscabas algo en un rango de precio específico o para algún regalo?`;
      }

      return res.json({
        reply: replyText,
        recommendedProductIds: matched.map(p => p.id).slice(0, 3)
      });
    }

    const systemContext = `Eres el Asistente Virtual Oficial de ventas de la tienda ${storeData.settings.storeName}.
Tu objetivo es asesorar amablemente a los clientes en ESPAÑOL, responder dudas sobre los productos del catálogo y recomendar las mejores opciones según sus necesidades o presupuesto.

CATÁLOGO ACTUAL DE LA TIENDA (${storeData.settings.currencySymbol}):
${JSON.stringify(catalogSummary, null, 2)}

REGLAS DE RESPUESTA:
1. Sé muy servicial, educado y entusiasta. Usa emojis amigables.
2. Si el usuario busca un producto o tipo de regalo, sugiere de 1 a 3 productos exactos del catálogo.
3. Menciona el precio exacto en ${storeData.settings.currencySymbol}.
4. Responde de forma clara y concisa (máximo 2 a 3 párrafos).
5. Devuelve la respuesta en formato JSON con la siguiente estructura:
{
  "reply": "Tu mensaje amigable para el cliente",
  "recommendedProductIds": ["id_del_producto_1", "id_del_producto_2"]
}`;

    const prompt = `${systemContext}\n\nPregunta del cliente: "${message}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    const text = response.text || '';
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    try {
      const parsed = JSON.parse(cleanJson);
      res.json(parsed);
    } catch {
      res.json({
        reply: text,
        recommendedProductIds: []
      });
    }
  } catch (err) {
    console.error('Error in AI chat assistant:', err);
    res.json({
      reply: "¡Hola! Estoy aquí para guiarte en el catálogo. Puedes escribir el tipo de producto que buscas (relojes, zapatillas, mochilas de cuero o audio) o tu presupuesto aproximado.",
      recommendedProductIds: []
    });
  }
});

// Vite server integration in Dev mode vs Static Server in Prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor NEXO Catálogo ejecutándose en http://0.0.0.0:${PORT}`);
  });
}

startServer();
