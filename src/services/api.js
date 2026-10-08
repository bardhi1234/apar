const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

export function getAdminToken() {
  return localStorage.getItem(
    "apar_admin_token"
  );
}

export function setAdminToken(token) {
  localStorage.setItem(
    "apar_admin_token",
    token
  );
}

export function clearAdminToken() {
  localStorage.removeItem(
    "apar_admin_token"
  );
}

async function request(
  path,
  options = {}
) {
  const token =
    getAdminToken();

  const headers = {
    ...(options.headers || {}),
  };

  if (
    options.body &&
    !(options.body instanceof FormData)
  ) {
    headers["Content-Type"] =
      "application/json";
  }

  if (token) {
    headers.Authorization =
      `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_URL}${path}`,
    {
      ...options,
      headers,
    }
  );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Ndodhi një gabim."
    );
  }

  return data;
}

export function getProducts() {
  return request("/products");
}

export function getProductById(id) {
  return request(
    `/products/${id}`
  );
}

export function createProduct(data) {
  return request(
    "/products",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export function updateProduct(
  id,
  data
) {
  return request(
    `/products/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );
}

export function deleteProduct(id) {
  return request(
    `/products/${id}`,
    {
      method: "DELETE",
    }
  );
}

export function adminLogin(
  email,
  password
) {
  return request(
    "/admin/login",
    {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );
}

export function adminMe() {
  return request(
    "/admin/me"
  );
}

export async function uploadProductImages(
  files
) {
  const formData =
    new FormData();

  files.forEach((file) => {
    formData.append(
      "images",
      file
    );
  });

  return request(
    "/uploads/images",
    {
      method: "POST",
      body: formData,
    }
  );
}
export function getCategories() {
  return request("/categories");
}

export function getAdminCategories() {
  return request("/categories/admin");
}

export function createCategory(data) {
  return request("/categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateCategory(id, data) {
  return request(`/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteCategory(id) {
  return request(`/categories/${id}`, {
    method: "DELETE",
  });
}
