import { Link } from "react-router-dom";

import ProductCard from "./ProductCard";
import { useProducts } from "../hooks/useProducts";

export default function NewArrivals() {
  const { products: allProducts } = useProducts();

  const products = [...allProducts]
    .sort(
      (a, b) =>
        Number(b.id) - Number(a.id)
    );
  const newProducts = products.slice(0, 4);

  return (
    <section className="bg-black py-20 text-white">
      <div className="mx-auto max-w-[1500px] px-6 lg:px-10">

        <div className="flex items-end justify-between gap-6">

          <div>
            <p className="text-xs font-semibold tracking-[0.4em] text-neutral-500">
              APAR COLLECTION
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
              NEW ARRIVALS
            </h2>
          </div>

          <Link
            to="/shop"
            className="hidden text-sm font-semibold text-neutral-400 transition hover:text-white sm:block"
          >
            SHIKO TÃƒâ€¹ GJITHA Ã¢â€ â€™
          </Link>

        </div>

        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 lg:gap-x-6">

          {newProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white p-3 text-black"
            >
              <ProductCard
                product={{
                  ...product,
                  price: `${product.price.toFixed(2)} Ã¢â€šÂ¬`,
                  oldPrice: product.oldPrice
                    ? `${product.oldPrice.toFixed(2)} Ã¢â€šÂ¬`
                    : null,
                }}
              />
            </div>
          ))}

        </div>

        <Link
          to="/shop"
          className="mt-10 inline-flex text-sm font-semibold text-neutral-400 transition hover:text-white sm:hidden"
        >
          SHIKO TÃƒâ€¹ GJITHA Ã¢â€ â€™
        </Link>

      </div>
    </section>
  );
}