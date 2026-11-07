
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

// =========================================
// PROTEINFITNESS CART CONTEXT
// =========================================

const CartContext = createContext(null);

// Ruajtje e veçantë nga APAR
const CART_STORAGE_KEY = "proteinfitness-cart-v1";

const DEFAULT_MAX_QUANTITY = 99;

// =========================================
// PRICE NORMALIZATION
// =========================================

function getNumericPrice(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) && value >= 0
      ? value
      : null;
  }

  const raw = String(value)
    .trim()
    .replace(/[\s€]/g, "");

  if (!raw) return null;

  const normalized =
    raw.includes(",") && raw.includes(".")
      ? raw.lastIndexOf(",") > raw.lastIndexOf(".")
        ? raw.replace(/\./g, "").replace(",", ".")
        : raw.replace(/,/g, "")
      : raw.replace(",", ".");

  const number = Number(normalized);

  return Number.isFinite(number) && number >= 0
    ? number
    : null;
}

// =========================================
// STOCK NORMALIZATION
// =========================================

function getStock(product) {
  const value = product?.stock;

  // Stok i panjohur nuk konsiderohet zero
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const stock = Number(value);

  if (!Number.isFinite(stock)) {
    return null;
  }

  return Math.max(0, Math.floor(stock));
}

function getMaxStock(product) {
  const stock = getStock(product);

  return stock === null
    ? DEFAULT_MAX_QUANTITY
    : stock;
}

// =========================================
// QUANTITY NORMALIZATION
// =========================================

function normalizeQuantity(value) {
  const quantity = Number(value);

  if (!Number.isFinite(quantity)) {
    return 1;
  }

  return Math.max(1, Math.floor(quantity));
}

// =========================================
// VARIANT NORMALIZATION
// size = Pesha
// color = Shija
// =========================================

function normalizeVariant(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const normalized = String(value).trim();

  return normalized || null;
}

// =========================================
// CHECK SAME PRODUCT VARIANT
// =========================================

function isSameVariant(
  item,
  id,
  size = null,
  color = null
) {
  return (
    String(item.id) === String(id) &&
    normalizeVariant(item.size) ===
      normalizeVariant(size) &&
    normalizeVariant(item.color) ===
      normalizeVariant(color)
  );
}

// =========================================
// INITIAL CART FROM LOCAL STORAGE
// =========================================

function loadSavedCart() {
  try {
    if (typeof window === "undefined") {
      return [];
    }

    const saved = window.localStorage.getItem(
      CART_STORAGE_KEY
    );

    if (!saved) return [];

    const parsed = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter(
        (item) =>
          item &&
          item.id !== null &&
          item.id !== undefined
      )
      .map((item) => {
        const maxStock = getMaxStock(item);

        const quantity = Math.min(
          normalizeQuantity(item.quantity),
          Math.max(1, maxStock)
        );

        return {
          ...item,

          price:
            getNumericPrice(item.price) ?? 0,

          oldPrice:
            getNumericPrice(
              item.oldPrice ?? item.old_price
            ),

          size: normalizeVariant(item.size),

          color: normalizeVariant(item.color),

          quantity,
        };
      });
  } catch (error) {
    console.warn(
      "ProteinFitness: Gabim gjatë leximit të shportës.",
      error
    );

    return [];
  }
}

// =========================================
// CART PROVIDER
// =========================================

export function CartProvider({ children }) {
  const [cart, setCart] = useState(loadSavedCart);

  const [isCartOpen, setIsCartOpen] =
    useState(false);

  // =======================================
  // SAVE CART
  // =======================================

  useEffect(() => {
    try {
      window.localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cart)
      );
    } catch (error) {
      console.warn(
        "ProteinFitness: Shporta nuk u ruajt.",
        error
      );
    }
  }, [cart]);

  // =======================================
  // CART DRAWER
  // =======================================

  const openCart = useCallback(() => {
    setIsCartOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  const toggleCart = useCallback(() => {
    setIsCartOpen((current) => !current);
  }, []);

  // =======================================
  // ADD PRODUCT TO CART
  // =======================================

  const addToCart = useCallback(
    (product, options = {}) => {
      if (
        !product ||
        product.id === null ||
        product.id === undefined
      ) {
        return;
      }

      const price = getNumericPrice(product.price);

      // Mos shto produkte pa çmim të vlefshëm
      if (price === null || price <= 0) {
        return;
      }

      const maxStock = getMaxStock(product);

      // Produkti është jashtë stokut
      if (maxStock <= 0) {
        return;
      }

      // Kompatibilitet me formatin e vjetër
      // dhe variantet e reja ProteinFitness
      const size = normalizeVariant(
        options.size ?? options.weight
      );

      const color = normalizeVariant(
        options.color ?? options.flavor
      );

      const requestedQuantity = Math.min(
        normalizeQuantity(options.quantity ?? 1),
        maxStock
      );

      setCart((currentCart) => {
        // Sasia totale e produktit, përfshirë
        // të gjitha shijet dhe paketimet.
        const totalForProduct = currentCart.reduce(
          (sum, item) => {
            if (
              String(item.id) !== String(product.id)
            ) {
              return sum;
            }

            return (
              sum + normalizeQuantity(item.quantity)
            );
          },
          0
        );

        const availableQuantity = Math.max(
          0,
          maxStock - totalForProduct
        );

        if (availableQuantity === 0) {
          return currentCart;
        }

        const quantityToAdd = Math.min(
          requestedQuantity,
          availableQuantity
        );

        const existingItem = currentCart.find(
          (item) =>
            isSameVariant(
              item,
              product.id,
              size,
              color
            )
        );

        // Produkti me variantin e njëjtë
        // ekziston në shportë
        if (existingItem) {
          return currentCart.map((item) => {
            if (
              !isSameVariant(
                item,
                product.id,
                size,
                color
              )
            ) {
              return item;
            }

            return {
              ...item,
              ...product,

              price,

              oldPrice: getNumericPrice(
                product.oldPrice ??
                  product.old_price
              ),

              size,
              color,

              quantity:
                normalizeQuantity(item.quantity) +
                quantityToAdd,
            };
          });
        }

        // Variant i ri në shportë
        const newItem = {
          ...product,

          price,

          oldPrice: getNumericPrice(
            product.oldPrice ?? product.old_price
          ),

          size,
          color,

          quantity: quantityToAdd,
        };

        return [...currentCart, newItem];
      });

      // Hap MiniCart
      setIsCartOpen(true);
    },
    []
  );

  // =======================================
  // REMOVE PRODUCT
  // =======================================

  const removeFromCart = useCallback(
    (id, size = null, color = null) => {
      setCart((currentCart) =>
        currentCart.filter(
          (item) =>
            !isSameVariant(
              item,
              id,
              size,
              color
            )
        )
      );
    },
    []
  );

  // =======================================
  // UPDATE QUANTITY
  // =======================================

  const updateQuantity = useCallback(
    (
      id,
      size = null,
      color = null,
      quantity
    ) => {
      const requested = Number(quantity);

      if (!Number.isFinite(requested)) {
        return;
      }

      // Nëse quantity <= 0, largo produktin
      if (requested <= 0) {
        setCart((currentCart) =>
          currentCart.filter(
            (item) =>
              !isSameVariant(
                item,
                id,
                size,
                color
              )
          )
        );

        return;
      }

      setCart((currentCart) =>
        currentCart.map((item) => {
          if (
            !isSameVariant(
              item,
              id,
              size,
              color
            )
          ) {
            return item;
          }

          const maxStock = getMaxStock(item);

          // Nëse produkti ka kaluar jashtë
          // stokut, ruaj përkohësisht rreshtin
          // që klienti të mund ta largojë.
          if (maxStock <= 0) {
            return item;
          }

          const otherVariantsQuantity =
            currentCart.reduce(
              (sum, otherItem) => {
                if (
                  String(otherItem.id) !==
                    String(id) ||
                  isSameVariant(
                    otherItem,
                    id,
                    size,
                    color
                  )
                ) {
                  return sum;
                }

                return (
                  sum +
                  normalizeQuantity(
                    otherItem.quantity
                  )
                );
              },
              0
            );

          const availableForVariant =
            maxStock - otherVariantsQuantity;

          if (availableForVariant <= 0) {
            return item;
          }

          const safeQuantity = Math.min(
            normalizeQuantity(requested),
            availableForVariant
          );

          return {
            ...item,
            quantity: safeQuantity,
          };
        })
      );
    },
    []
  );

  // =======================================
  // CLEAR CART
  // =======================================

  const clearCart = useCallback(() => {
    setCart([]);
    setIsCartOpen(false);
  }, []);

  // =======================================
  // CART ITEM COUNT
  // =======================================

  const cartCount = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total + normalizeQuantity(item.quantity),
      0
    );
  }, [cart]);

  // =======================================
  // CART TOTAL
  // =======================================

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => {
      const price =
        getNumericPrice(item.price) ?? 0;

      const quantity = normalizeQuantity(
        item.quantity
      );

      return total + price * quantity;
    }, 0);
  }, [cart]);

  // =======================================
  // CART VARIANTS COUNT
  // =======================================

  const cartItemsCount = cart.length;

  // =======================================
  // CART CONTEXT VALUE
  // =======================================

  const value = useMemo(
    () => ({
      // Products
      cart,

      // Actions
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,

      // Totals
      cartCount,
      cartItemsCount,
      cartTotal,

      // Drawer
      isCartOpen,
      openCart,
      closeCart,
      toggleCart,
    }),
    [
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      cartItemsCount,
      cartTotal,
      isCartOpen,
      openCart,
      closeCart,
      toggleCart,
    ]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// =========================================
// CUSTOM HOOK
// =========================================

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart duhet të përdoret brenda CartProvider."
    );
  }

  return context;
}
