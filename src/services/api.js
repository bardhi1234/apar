
/*
========================================
PROTEINFITNESS - API SERVICE
========================================
Backend: Node.js / Express
Database: Neon PostgreSQL
Images: Cloudinary
========================================
*/

// ======================================
// API CONFIGURATION
// ======================================

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api"
).replace(/\/+$/, "");

// Ruajme çelesin ekzistues qe AdminLogin
// dhe sesionet aktuale te mos prishen.
const ADMIN_TOKEN_KEY = "apar_admin_token";

// ======================================
// ADMIN TOKEN
// ======================================

export function getAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token) {
  localStorage.setItem(
    ADMIN_TOKEN_KEY,
    token
  );
}

export function clearAdminToken() {
  localStorage.removeItem(
    ADMIN_TOKEN_KEY
  );
}

// ======================================
// API REQUEST HELPER
// ======================================

async function request(path, options = {}) {
  const token = getAdminToken();

  const headers = new Headers(
    options.headers || {}
  );

  const isFormData =
    typeof FormData !== "undefined" &&
    options.body instanceof FormData;

  if (
    options.body != null &&
    !isFormData &&
    !headers.has("Content-Type")
  ) {
    headers.set(
      "Content-Type",
      "application/json"
    );
  }

  if (token) {
    headers.set(
      "Authorization",
      `Bearer ${token}`
    );
  }

  let response;

  try {
    response = await fetch(
      `${API_URL}${path}`,
      {
        ...options,
        headers,
      }
    );
  } catch {
    throw new Error(
      "Nuk ka lidhje me serverin. Kontrollo backend-in dhe VITE_API_URL."
    );
  }

  // Mbështet JSON dhe përgjigje bosh
  // si 204 No Content.
  const raw = await response.text();

  let data = {};

  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch {
      if (response.ok) {
        throw new Error(
          "Serveri ktheu përgjigje jo të vlefshme."
        );
      }
    }
  }

  if (!response.ok) {
    const serverMessage =
      typeof data?.message === "string"
        ? data.message
        : typeof data?.error === "string"
          ? data.error
          : "";

    if (serverMessage) {
      throw new Error(serverMessage);
    }

    if (response.status === 401) {
      throw new Error(
        "Sesioni nuk është i vlefshëm ose ka skaduar."
      );
    }

    if (response.status === 403) {
      throw new Error(
        "Nuk ke leje për këtë veprim."
      );
    }

    if (response.status === 404) {
      throw new Error(
        "Adresa e kërkuar nuk u gjet në server."
      );
    }

    throw new Error(
      `Gabim nga serveri (${response.status}).`
    );
  }

  return data ?? {};
}

// ======================================
// PRODUCTS - PUBLIC
// ======================================

// Merr të gjitha produktet
export function getProducts() {
  return request("/products");
}

// Merr një produkt sipas ID-së
export function getProductById(id) {
  return request(
    `/products/${encodeURIComponent(id)}`
  );
}

// ======================================
// PRODUCTS - ADMIN
// ======================================

// Krijo produkt të ri
export function createProduct(data) {
  return request("/products", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Përditëso produktin
export function updateProduct(id, data) {
  return request(
    `/products/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );
}

// Fshi produktin
export function deleteProduct(id) {
  return request(
    `/products/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
    }
  );
}

// ======================================
// IMAGE UPLOAD - CLOUDINARY
// ======================================

// Ngarko fotografitë përmes backend-it
export function uploadProductImages(files) {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("images", file);
  });

  return request("/uploads/images", {
    method: "POST",
    body: formData,
  });
}

// ======================================
// CATEGORIES - PUBLIC
// ======================================

// Merr kategoritë publike
export function getCategories() {
  return request("/categories");
}

// ======================================
// CATEGORIES - ADMIN
// ======================================

// Merr të gjitha kategoritë në Admin
export function getAdminCategories() {
  return request("/categories/admin");
}

// Krijo kategori
export function createCategory(data) {
  return request("/categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Përditëso kategori
export function updateCategory(id, data) {
  return request(
    `/categories/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );
}

// Fshi kategori
export function deleteCategory(id) {
  return request(
    `/categories/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
    }
  );
}

// ======================================
// ADMIN AUTHENTICATION
// ======================================

// Hyrja e administratorit
export function adminLogin(email, password) {
  return request("/admin/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });
}

// Kontrollo administratorin e kyçur
export function adminMe() {
  return request("/admin/me");
}

// ======================================
// ORDERS - BACKEND INTEGRATION
// ======================================
//
// Këto janë funksione të përgatitura.
// Rrugët /orders duhet të krijohen
// dhe të mbrohen në Express/Backend.
//
// Checkout ende nuk i përdor
// automatikisht këto funksione.
// ======================================

// Merr porositë për Admin
export function getOrders() {
  return request("/orders");
}

// Merr një porosi sipas ID-së
export function getOrderById(id) {
  return request(
    `/orders/${encodeURIComponent(id)}`
  );
}

// Krijo një porosi të re
export function createOrder(data) {
  return request("/orders", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Ndrysho statusin e porosisë
export function updateOrderStatus(id, status) {
  return request(
    `/orders/${encodeURIComponent(id)}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({
        status,
      }),
    }
  );
}
