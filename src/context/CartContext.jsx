import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CartContext = createContext(null);

const CART_STORAGE_KEY =
  "apar-cart";

const DEFAULT_MAX_QUANTITY = 99;

/*
  Kthen numër të sigurt për price.
  Punon edhe nëse ndonjëherë vjen:
  34.99
  ose
  "34.99 €"
*/
const getNumericPrice = (
  value
) => {
  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {
    return value;
  }

  const parsed = Number(
    String(value || "")
      .replace(",", ".")
      .replace(
        /[^0-9.-]/g,
        ""
      )
  );

  return Number.isFinite(parsed)
    ? parsed
    : 0;
};

/*
  Stock maksimal për një produkt.

  Për momentin përdor product.stock.
  Kur të bëjmë backend-in, mund ta
  ndryshojmë në stock sipas variantit.
*/
const getMaxStock = (
  product
) => {
  const stock =
    Number(product?.stock);

  if (
    Number.isFinite(stock)
  ) {
    return Math.max(
      0,
      Math.floor(stock)
    );
  }

  return DEFAULT_MAX_QUANTITY;
};

/*
  Quantity gjithmonë integer >= 1
*/
const normalizeQuantity = (
  quantity
) => {
  const number =
    Number(quantity);

  if (
    !Number.isFinite(number)
  ) {
    return 1;
  }

  return Math.max(
    1,
    Math.floor(number)
  );
};

/*
  Krahason dy variante.

  I njëjti produkt me size/color
  të ndryshëm konsiderohet item tjetër.
*/
const isSameVariant = (
  item,
  id,
  size,
  color
) =>
  String(item.id) ===
    String(id) &&
  (item.size || null) ===
    (size || null) &&
  (item.color || null) ===
    (color || null);

export function CartProvider({
  children,
}) {
  /*
    ========================================
    INITIAL CART
    ========================================
  */

  const [cart, setCart] =
    useState(() => {
      try {
        const savedCart =
          localStorage.getItem(
            CART_STORAGE_KEY
          );

        if (!savedCart) {
          return [];
        }

        const parsed =
          JSON.parse(
            savedCart
          );

        if (
          !Array.isArray(parsed)
        ) {
          return [];
        }

        /*
          Pastrojmë të dhënat e ruajtura.
        */
        return parsed
          .filter(
            (item) =>
              item &&
              item.id !==
                undefined
          )
          .map((item) => {
            const maxStock =
              getMaxStock(
                item
              );

            const quantity =
              Math.min(
                normalizeQuantity(
                  item.quantity
                ),
                Math.max(
                  1,
                  maxStock
                )
              );

            return {
              ...item,

              price:
                getNumericPrice(
                  item.price
                ),

              size:
                item.size ||
                null,

              color:
                item.color ||
                null,

              quantity,
            };
          });
      } catch {
        return [];
      }
    });

  const [
    isCartOpen,
    setIsCartOpen,
  ] = useState(false);

  /*
    ========================================
    SAVE CART
    ========================================
  */

  useEffect(() => {
    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cart)
      );
    } catch {
      /*
        Nëse browser-i nuk lejon storage,
        website vazhdon të funksionojë.
      */
    }
  }, [cart]);

  /*
    ========================================
    DRAWER
    ========================================
  */

  const openCart = () => {
    setIsCartOpen(true);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const toggleCart = () => {
    setIsCartOpen(
      (current) => !current
    );
  };

  /*
    ========================================
    ADD TO CART
    ========================================
  */

  const addToCart = (
    product,
    options = {}
  ) => {
    if (!product) return;

    const {
      size = null,
      color = null,
      quantity = 1,
    } = options;

    const maxStock =
      getMaxStock(product);

    /*
      Produkt jashtë stokut.
    */
    if (maxStock <= 0) {
      return;
    }

    const requestedQuantity =
      Math.min(
        normalizeQuantity(
          quantity
        ),
        maxStock
      );

    setCart(
      (currentCart) => {
        const existingItem =
          currentCart.find(
            (item) =>
              isSameVariant(
                item,
                product.id,
                size,
                color
              )
          );

        /*
          Nëse varianti ekziston,
          vetëm rrit quantity.
        */
        if (existingItem) {
          return currentCart.map(
            (item) => {
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

              const newQuantity =
                Math.min(
                  item.quantity +
                    requestedQuantity,
                  maxStock
                );

              return {
                ...item,

                stock:
                  product.stock ??
                  item.stock,

                price:
                  getNumericPrice(
                    product.price
                  ),

                quantity:
                  newQuantity,
              };
            }
          );
        }

        /*
          Variant i ri.
        */
        return [
          ...currentCart,

          {
            ...product,

            price:
              getNumericPrice(
                product.price
              ),

            size:
              size || null,

            color:
              color || null,

            quantity:
              requestedQuantity,
          },
        ];
      }
    );

    openCart();
  };

  /*
    ========================================
    REMOVE
    ========================================
  */

  const removeFromCart = (
    id,
    size = null,
    color = null
  ) => {
    setCart(
      (currentCart) =>
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
  };

  /*
    ========================================
    UPDATE QUANTITY
    ========================================
  */

  const updateQuantity = (
    id,
    size = null,
    color = null,
    quantity
  ) => {
    const requested =
      Number(quantity);

    /*
      Nëse bie në 0,
      largohet produkti.
    */
    if (
      Number.isFinite(
        requested
      ) &&
      requested <= 0
    ) {
      removeFromCart(
        id,
        size,
        color
      );

      return;
    }

    setCart(
      (currentCart) =>
        currentCart.map(
          (item) => {
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

            const maxStock =
              getMaxStock(item);

            if (
              maxStock <= 0
            ) {
              return {
                ...item,
                quantity: 1,
              };
            }

            const safeQuantity =
              Math.min(
                normalizeQuantity(
                  quantity
                ),
                maxStock
              );

            return {
              ...item,
              quantity:
                safeQuantity,
            };
          }
        )
    );
  };

  /*
    ========================================
    CLEAR
    ========================================
  */

  const clearCart = () => {
    setCart([]);
    setIsCartOpen(false);
  };

  /*
    ========================================
    TOTALS
    ========================================
  */

  const cartCount =
    useMemo(
      () =>
        cart.reduce(
          (
            total,
            item
          ) =>
            total +
            normalizeQuantity(
              item.quantity
            ),
          0
        ),
      [cart]
    );

  const cartTotal =
    useMemo(
      () =>
        cart.reduce(
          (
            total,
            item
          ) =>
            total +
            getNumericPrice(
              item.price
            ) *
              normalizeQuantity(
                item.quantity
              ),
          0
        ),
      [cart]
    );

  /*
    Sa rreshta / variante
    kemi në cart.
  */
  const cartItemsCount =
    cart.length;

  /*
    ========================================
    PROVIDER
    ========================================
  */

  const value =
    useMemo(
      () => ({
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
      }),
      [
        cart,
        cartCount,
        cartItemsCount,
        cartTotal,
        isCartOpen,
      ]
    );

  return (
    <CartContext.Provider
      value={value}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context =
    useContext(
      CartContext
    );

  if (!context) {
    throw new Error(
      "useCart duhet të përdoret brenda CartProvider."
    );
  }

  return context;
}