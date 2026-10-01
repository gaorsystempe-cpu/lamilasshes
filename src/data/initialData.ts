import { Product, Category, Banner, StoreSettings, Coupon } from '../types/catalog';

export const INITIAL_SETTINGS: StoreSettings = {
  storeName: "LAMI LASHES®",
  tagline: "Professional Care® - Lash & Brow Lamination Systems",
  logoUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
  whatsappNumber: "51987654321",
  whatsappCountryCode: "+51",
  whatsappMessageTemplate: `¡Hola *LAMI LASHES® Professional Care*! 💖

Deseo realizar el siguiente pedido del catálogo oficial:

📋 *ORDEN #:* {order_id}
👤 *Especialista / Cliente:* {customer_name}
📞 *Teléfono:* {customer_phone}
📍 *Dirección de Entrega:* {customer_address}, {delivery_city}

📦 *PRODUCTOS PROFESIONALES:*
{items_list}

💵 *RESUMEN DE PAGO:*
• Subtotal: {currency} {subtotal}
• Descuento: {currency} {discount}
• Envío: {currency} {shipping}
*TOTAL A PAGAR: {currency} {total}*

💳 *Método de Pago Elegido:* {payment_method}
💬 *Notas:* {notes}

Quedo a la espera de la confirmación de stock y datos de pago. ¡Muchas gracias!`,
  currencySymbol: "S/",
  currencyCode: "PEN",
  freeShippingThreshold: 180,
  shippingFee: 12,
  adminPin: "1234",
  contactEmail: "pedidos@lamilashes.com",
  address: "Av. Primavera 120, Of. 402, Surco, Lima",
  openingHours: "Lunes a Sábado: 9:00 AM - 7:00 PM",
  topAnnouncementBar: {
    active: true,
    text: "🌸 LAMI LASHES® Professional Care - Envío GRATIS en pedidos superiores a S/180 | Asesoría técnica por WhatsApp 📲",
    link: "#"
  },
  paymentMethods: [
    {
      id: "yape_plin",
      name: "Yape / Plin",
      details: "Número: 987 654 321 (Titular: LAMI LASHES PERU S.A.C.)",
      instructions: "Realiza la transferencia por Yape o Plin y adjunta la captura del comprobante al mensaje de WhatsApp.",
      icon: "Smartphone",
      active: true
    },
    {
      id: "bcp_transfer",
      name: "Transferencia BCP / BBVA",
      details: "BCP Soles: 193-98234123-0-12 | CCI: 002-193-0098234123012-14",
      instructions: "Transferencia a la cuenta bancaria corporativa. Indicar el número de orden en el concepto.",
      icon: "Building2",
      active: true
    },
    {
      id: "cash_delivery",
      name: "Pago Contra Entrega",
      details: "Disponible para Lima Metropolitana y Arequipa.",
      instructions: "Pago en efectivo o con POS de tarjeta al recibir el paquete.",
      icon: "Banknote",
      active: true
    }
  ]
};

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: "cat_1",
    name: "Laminado de Pestañas",
    slug: "laminado-pestanas",
    description: "Sistemas de elevación, rizado y lamination con fórmula enriquecida en keratina.",
    image: "https://images.unsplash.com/photo-1583001809873-a1284a5da527?w=1200&auto=format&fit=crop&q=80",
    iconName: "Sparkles",
    productCount: 4
  },
  {
    id: "cat_2",
    name: "Cuidado de Cejas",
    slug: "cuidado-cejas",
    description: "Fijadores, pigmentos de tinte y sueros remodeladores de cejas.",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&auto=format&fit=crop&q=80",
    iconName: "Heart",
    productCount: 3
  },
  {
    id: "cat_3",
    name: "Sueros & Keratina",
    slug: "sueros-keratina",
    description: "Tratamientos nutritivos intensivos Lash Botox, 3D Filler y recuperadores.",
    image: "https://images.unsplash.com/photo-1608248597262-421711739c9b?w=1200&auto=format&fit=crop&q=80",
    iconName: "Zap",
    productCount: 3
  },
  {
    id: "cat_4",
    name: "Herramientas Profesionales",
    slug: "herramientas-profesionales",
    description: "Pinzas de titanio, moldes anatómicos de silicona, aplicadores y parches.",
    image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=1200&auto=format&fit=crop&q=80",
    iconName: "Scissors",
    productCount: 4
  }
];

export const INITIAL_BANNERS: Banner[] = [
  {
    id: "ban_1",
    title: "LAMI LASHES® Professional Care",
    subtitle: "Catálogo Oficial de Productos Profesionales para Laminado de Pestañas & Cejas de Alta Gama.",
    badgeText: "CALIDAD PROFESIONAL R®",
    imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1600&auto=format&fit=crop&q=80",
    ctaText: "Ver Catálogo Completo",
    ctaLink: "#catalog",
    active: true
  },
  {
    id: "ban_2",
    title: "Pedidos Inmediatos por WhatsApp 📲",
    subtitle: "Selecciona tus productos, cantidades y envía tu pedido directamente a nuestra central con atención inmediata.",
    badgeText: "ENVIOS A TODO EL PAÍS",
    imageUrl: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=1600&auto=format&fit=crop&q=80",
    ctaText: "Explorar Kits Profesionales",
    ctaLink: "#kits",
    active: true
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: "LAMI10",
    discountType: "percentage",
    discountValue: 10,
    minPurchase: 100,
    active: true
  },
  {
    code: "ENVIOGRATIS",
    discountType: "fixed",
    discountValue: 12,
    minPurchase: 180,
    active: true
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod_1",
    sku: "LAMI-KIT-01",
    title: "Kit Profesional Lami Lashes System 3 Pasos + Keratin",
    category: "Laminado de Pestañas",
    tags: ["Laminado de Pestañas", "Kit Profesional", "Keratina", "Destacado"],
    price: 280,
    compareAtPrice: 320,
    description: "Sistema completo de elevación y laminado de pestañas para profesionales lashistas. Incluye Paso 1 Lift Lotion (10ml), Paso 2 Fixation Lotion (10ml) y Paso 3 Keratin Nourishing Essence (10ml). Rinde hasta 35 aplicaciones.",
    features: [
      "Fórmula hipoalergénica enriquecida con aminoácidos y keratina hidrolizada",
      "Tiempo de acción ultrarrápido: 8 a 12 minutos por paso",
      "Resultados visibles de curva natural sostenida por hasta 8 semanas",
      "Incluye manual técnico de protocolo y guía de tiempos"
    ],
    images: [
      "https://images.unsplash.com/photo-1608248597262-421711739c9b?w=1600&auto=format&fit=crop&q=90",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1600&auto=format&fit=crop&q=90",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=1600&auto=format&fit=crop&q=90"
    ],
    colors: [
      { name: "Edición Oro Rosa", hex: "#f472b6" },
      { name: "Edición Verde Bosque Signature", hex: "#064e3b" }
    ],
    sizes: ["Kit Standard 30ml Total"],
    rating: 5.0,
    reviewsCount: 112,
    isNew: true,
    isFeatured: true,
    inStock: true,
    stockCount: 18,
    createdAt: "2026-09-20T10:00:00Z"
  },
  {
    id: "prod_2",
    sku: "LAMI-BALM-02",
    title: "Lami Glue Balm 50g (Pegamento Bálsamo Vitaminado)",
    category: "Laminado de Pestañas",
    tags: ["Pegamento", "Glue Balm", "Vitaminas", "Tendencia"],
    price: 95,
    compareAtPrice: 115,
    description: "Revolucionario pegamento en consistencia bálsamo cremoso. Fija las pestañas al molde de silicona instantáneamente sin secarse de golpe, permitiendo peinar y alinear con precisión perfecta. Enriquecido con aceite de argán y vitamina E.",
    features: [
      "Textura bálsamo sin sensación pegajosa ni acumulación de grumos",
      "No requiere tiempo de espera para secado; se adhiere suavemente",
      "Fácil de retirar al finalizar el tratamiento con agua tibia",
      "Frasco de 50g de alta duración (más de 80 tratamientos)"
    ],
    images: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1600&auto=format&fit=crop&q=90",
      "https://images.unsplash.com/photo-1608248597262-421711739c9b?w=1600&auto=format&fit=crop&q=90"
    ],
    colors: [
      { name: "Aroma Frutas Silvestres", hex: "#f43f5e" },
      { name: "Aroma Coco & Vainilla", hex: "#fde047" }
    ],
    sizes: ["50g Frasco Vidrio"],
    rating: 4.9,
    reviewsCount: 84,
    isNew: true,
    isFeatured: true,
    inStock: true,
    stockCount: 24,
    createdAt: "2026-09-22T14:00:00Z"
  },
  {
    id: "prod_3",
    sku: "LAMI-SERUM-03",
    title: "Suero Nutritivo Lami Keratin Lash Botox 15ml",
    category: "Sueros & Keratina",
    tags: ["Sueros", "Lash Botox", "Tratamiento", "Destacado"],
    price: 135,
    compareAtPrice: 160,
    description: "Tratamiento concentrado reestructurante profundo con keratina vegetal, ácido hialurónico, colágeno y provitamina B5. Aumenta el grosor natural de la pestaña hasta un 32% y estimula el crecimiento saludable.",
    features: [
      "Restaura la estructura capilar tras procesos químicos de ondulado o tinte",
      "Aporta brillo sedoso y elasticidad natural de la raíz a las puntas",
      "Apto para uso profesional en cabina y cuidado posterior en casa",
      "Gotero dosificador de precisión anti-desperdicio"
    ],
    images: [
      "https://images.unsplash.com/photo-1608248597262-421711739c9b?w=1600&auto=format&fit=crop&q=90",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1600&auto=format&fit=crop&q=90"
    ],
    colors: [
      { name: "Frasco Ámbar Dorado", hex: "#d97706" }
    ],
    sizes: ["15ml Dropper"],
    rating: 5.0,
    reviewsCount: 68,
    isNew: false,
    isFeatured: true,
    inStock: true,
    stockCount: 15,
    createdAt: "2026-09-15T11:30:00Z"
  },
  {
    id: "prod_4",
    sku: "LAMI-MOLD-04",
    title: "Moldes de Silicona Anatómicos Lami Shield (5 Pares)",
    category: "Herramientas Profesionales",
    tags: ["Moldes", "Silicona", "Accesorios"],
    price: 65,
    compareAtPrice: 80,
    description: "Set de 5 pares de moldes de silicona ultrasuave de grado médico reusables. Diseñados anatómicamente para adaptarse a cualquier forma de ojo y longitud de pestaña (Tallas S, M, M1, M2, L).",
    features: [
      "Silicona aterciopelada de alta adherencia sin deformación",
      "Diseño asimétrico para efecto elevación 'Lifting Cat-Eye' o curva C suave",
      "Fáciles de esterilizar en autoclave o alcohol de 70°",
      "Colores pasteles distintivos según talla"
    ],
    images: [
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=1600&auto=format&fit=crop&q=90",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=1600&auto=format&fit=crop&q=90"
    ],
    colors: [
      { name: "Rosa Pastel Lami", hex: "#fbcfe8" },
      { name: "Verde Menta Pro", hex: "#a7f3d0" }
    ],
    sizes: ["Caja 5 Pares Asortidos"],
    rating: 4.8,
    reviewsCount: 45,
    isNew: true,
    isFeatured: false,
    inStock: true,
    stockCount: 30,
    createdAt: "2026-09-18T09:00:00Z"
  },
  {
    id: "prod_5",
    sku: "LAMI-BROW-05",
    title: "Lami Brow Fixation Express Gel (Laminado de Cejas)",
    category: "Cuidado de Cejas",
    tags: ["Cejas", "Brow Lamination", "Fijador"],
    price: 110,
    compareAtPrice: 130,
    description: "Gel fijador moldeador de cejas de efecto pluma 'Feather Brows'. Mantiene el peinado de cejas rebeldes o delgadas durante todo el día sin dejar residuos ni sensación dura.",
    features: [
      "Laminado instantáneo de larga duración a prueba de sudor",
      "Con infusión de aceite de ricino que estimula el folículo piloso",
      "Cepillo micro-aplicador ergonómico de precisión",
      "Fórmula transparente apta para todo tipo de color de ceja"
    ],
    images: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1600&auto=format&fit=crop&q=90",
      "https://images.unsplash.com/photo-1583001809873-a1284a5da527?w=1600&auto=format&fit=crop&q=90"
    ],
    colors: [
      { name: "Transparente Cristal", hex: "#ffffff" }
    ],
    sizes: ["12ml Tube"],
    rating: 4.9,
    reviewsCount: 52,
    isNew: false,
    isFeatured: true,
    inStock: true,
    stockCount: 20,
    createdAt: "2026-09-10T16:00:00Z"
  },
  {
    id: "prod_6",
    sku: "LAMI-TWEE-06",
    title: "Set de Pinzas de Titanio Lami Gold Precision (2 piezas)",
    category: "Herramientas Profesionales",
    tags: ["Pinzas", "Titanio", "Herramientas", "Edicion Limitada"],
    price: 85,
    compareAtPrice: 105,
    description: "Pinzas de alineación profesional forjadas en acero inoxidable quirúrgico recubiertas en titanio oro rosa. Cierre de punta ultra fino calibrado a mano para aislamiento y alineación milimétrica de pestañas.",
    features: [
      "Punta tipo aislador recto + curva anatómica para alineado",
      "Peso ultraligero que previene fatiga muscular en la mano",
      "Superficie antideslizante grabada a láser con logo LAMI LASHES®",
      "Incluye estuche de terciopelo protector"
    ],
    images: [
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=1600&auto=format&fit=crop&q=90",
      "https://images.unsplash.com/photo-1608248597262-421711739c9b?w=1600&auto=format&fit=crop&q=90"
    ],
    colors: [
      { name: "Oro Rosa Titán", hex: "#f472b6" },
      { name: "Dorado Espejo", hex: "#eab308" }
    ],
    sizes: ["Set 2 Pinzas + Estuche"],
    rating: 5.0,
    reviewsCount: 39,
    isNew: true,
    isFeatured: false,
    inStock: true,
    stockCount: 12,
    createdAt: "2026-09-25T12:00:00Z"
  }
];
