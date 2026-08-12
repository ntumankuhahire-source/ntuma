// ─── Existing Types ───────────────────────────────────────────────────────────

export type Category = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
};

export type Product = {
  id: string;
  name: string;
  /** Stored directly as one of the 4 fixed category id strings from lib/categories.ts */
  category: string;
  price: number;
  unit: string;
  description: string;
  createdAt: string;
  subcategory?: string;
  priceType?: 'fixed' | 'variable' | 'custom';
  image?: string;
  imageUrl?: string;
};

// ─── Order Types ──────────────────────────────────────────────────────────────

export type OrderStatus = 'Pending' | 'Confirmed' | 'Delivered' | 'Cancelled';

/**
 * A single line-item within an order.
 * Matches the "OrderItems" tab schema in Google Sheets.
 */
export type OrderItem = {
  id: string;
  orderId: string;
  /**
   * One of the 4 fixed category ids (e.g. "fresh-produce"), OR "Quick List"
   * for items submitted via the Quick Shop List flow.
   */
  category: string;
  productName: string;
  qty: number;
  unit: string;
  /**
   * Unit price in RWF.
   * 0 for variable-price catalog items and Quick List items awaiting confirmation.
   */
  price: number;
  /**
   * price × qty.
   * 0 for any item where price has not yet been confirmed.
   */
  subtotal: number;
  /**
   * false → normal catalog item (category is one of the 4 fixed ids)
   * true  → Quick List item (free-text description, price/subtotal = 0 until confirmed on WhatsApp)
   */
  isCustom: boolean;
};

/**
 * A customer order.
 * Matches the "Orders" tab schema in Google Sheets.
 */
export type Order = {
  id: string;             // format: "ORD-XXXXXX"
  createdAt: string;      // ISO 8601
  customerName: string;
  customerPhone: string;
  location: string;
  budget: number;         // 0 if no budget set
  total: number;          // confirmed fixed total
  status: OrderStatus;
  items: OrderItem[];
};

/** Payload accepted by createOrder(). */
export type CreateOrderInput = {
  customerName: string;
  customerPhone: string;
  location: string;
  budget: number;
  items: {
    category: string;
    productName: string;
    qty: number;
    unit: string;
    price: number;
    isCustom: boolean;
  }[];
  total: number;
};

// ─── Shared helpers ───────────────────────────────────────────────────────────

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

const API_URL = process.env.NEXT_PUBLIC_SHEETS_API_URL || '/api/sheets';

// ─── Existing API functions ───────────────────────────────────────────────────

export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_URL}?action=listCategories`, { cache: 'no-store' });
    const json: ApiResponse<Category[]> = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
    console.error('Error fetching categories:', json.error);
    return [];
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_URL}?action=listProducts`, { cache: 'no-store' });
    const json: ApiResponse<Product[]> = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
    console.error('Error fetching products:', json.error);
    return [];
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}

export async function addCategory(category: Pick<Category, 'name' | 'description'>): Promise<ApiResponse<Category>> {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'addCategory', ...category }),
    });
    return await res.json();
  } catch (error) {
    console.error('Failed to add category:', error);
    return { success: false, error: 'Network error' };
  }
}

export async function addProduct(product: Pick<Product, 'name' | 'category' | 'price' | 'unit' | 'description'> & { imageUrl?: string }): Promise<ApiResponse<Product>> {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'addProduct', ...product }),
    });
    return await res.json();
  } catch (error) {
    console.error('Failed to add product:', error);
    return { success: false, error: 'Network error' };
  }
}

export async function deleteCategory(id: string): Promise<ApiResponse<void>> {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'deleteCategory', id }),
    });
    return await res.json();
  } catch (error) {
    console.error('Failed to delete category:', error);
    return { success: false, error: 'Network error' };
  }
}

export async function deleteProduct(id: string): Promise<ApiResponse<void>> {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'deleteProduct', id }),
    });
    return await res.json();
  } catch (error) {
    console.error('Failed to delete product:', error);
    return { success: false, error: 'Network error' };
  }
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<ApiResponse<void>> {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'updateProduct', id, ...updates }),
    });
    return await res.json();
  } catch (error) {
    console.error('Failed to update product:', error);
    return { success: false, error: 'Network error' };
  }
}

// ─── Orders API ───────────────────────────────────────────────────────────────

function generateOrderId(): string {
  return `ORD-${String(Math.floor(100000 + Math.random() * 900000))}`;
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'createOrder', ...input }),
    });
    const json: ApiResponse<Order> = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
  } catch (error) {
    console.error('Failed to create order via API:', error);
  }

  // Fallback to newly generated local order object if API is unavailable
  const orderId = generateOrderId();
  const now = new Date().toISOString();
  const orderItems: OrderItem[] = input.items.map((item, idx) => ({
    id: `i-${orderId}-${idx}`,
    orderId,
    category: item.category,
    productName: item.productName,
    qty: item.qty,
    unit: item.unit,
    price: item.price,
    subtotal: item.isCustom ? 0 : item.price * item.qty,
    isCustom: item.isCustom,
  }));

  return {
    id: orderId,
    createdAt: now,
    customerName: input.customerName,
    customerPhone: input.customerPhone,
    location: input.location,
    budget: input.budget,
    total: input.total,
    status: 'Pending',
    items: orderItems,
  };
}

export async function listOrders(): Promise<Order[]> {
  try {
    const res = await fetch(`${API_URL}?action=listOrders`, { cache: 'no-store' });
    const json: ApiResponse<Order[]> = await res.json();
    if (json.success && Array.isArray(json.data)) {
      return json.data.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
  } catch (error) {
    console.error('Failed to list orders via API:', error);
  }

  return [];
}

export async function getOrderDetails(id: string): Promise<Order | null> {
  const orders = await listOrders();
  return orders.find((o) => o.id === id) ?? null;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<ApiResponse<void>> {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'updateOrderStatus', id, status }),
    });
    const json: ApiResponse<void> = await res.json();
    if (json.success) return json;
    return { success: false, error: json.error || 'Failed to update order status' };
  } catch (error) {
    console.error('Failed to update order status via API:', error);
    return { success: false, error: 'Network error updating order status' };
  }
}
