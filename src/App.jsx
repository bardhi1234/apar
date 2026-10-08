import { BrowserRouter, Routes, Route } from "react-router-dom";

import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

import ScrollToTop from "./components/ScrollToTop";
import MiniCart from "./components/MiniCart";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Product from "./pages/Product";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

import AdminLogin from "./admin/AdminLogin";
import ProtectedAdmin from "./admin/ProtectedAdmin";
import AdminLayout from "./admin/AdminLayout";

import Dashboard from "./admin/pages/Dashboard";
import Products from "./admin/pages/Products";
import AddProduct from "./admin/pages/AddProduct";
import EditProduct from "./admin/pages/EditProduct";
import Orders from "./admin/pages/Orders";
import Categories from "./admin/pages/Categories";

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <WishlistProvider>
          <ScrollToTop />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />

            <Route
              path="/admin/login"
              element={<AdminLogin />}
            />

            <Route element={<ProtectedAdmin />}>
              <Route
                path="/admin"
                element={<AdminLayout />}
              >
                <Route
                  index
                  element={<Dashboard />}
                />

                <Route
                  path="products"
                  element={<Products />}
                />

                <Route
                  path="products/new"
                  element={<AddProduct />}
                />

                <Route
                  path="products/:id/edit"
                  element={<EditProduct />}
                />

                <Route
                  path="categories"
                  element={<Categories />}
                />

                <Route
                  path="orders"
                  element={<Orders />}
                />
              </Route>
            </Route>
          </Routes>

          <MiniCart />
        </WishlistProvider>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
