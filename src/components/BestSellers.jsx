import { Link } from "react-router-dom";

import ProductCard from "./ProductCard";
import { useProducts } from "../hooks/useProducts";

export default function BestSellers() {
  const { products: allProducts } = useProducts();

  const products = allProducts
    .filter(
      (product) =>
        String(product.badge || "")
          .toUpperCase() === "BESTSELLER"
    );
  const bestSellerIds = [2, 1, 4, 5];

  const bestSellers = bestSellerIds
    .map((id) =>
      products.find((product) => product.id === id)
    )
    .filter(Boolean);

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-[1500px] px-6 lg:px-10">

        <div className="flex items-end justify-between gap-6">

          <div>
            <p className="text-xs font-semibold tracking-[0.4em] text-neutral-400">
              APAR PICKS
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
              BEST SELLERS
            </h2>
          </div>

          <Link
            to="/shop"
            className="hidden text-sm font-semibold text-neutral-500 transition hover:text-black sm:block"
          >
            SHIKO TË GJITHA →
          </Link>

        </div>

        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-4 lg:gap-x-6">

          {bestSellers.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                ...product,
                price: `${product.price.toFixed(2)} €`,
                oldPrice: product.oldPrice
                  ? `${product.oldPrice.toFixed(2)} €`
                  : null,
              }}
            />
          ))}

        </div>

        <Link
          to="/shop"
          className="mt-10 inline-flex text-sm font-semibold text-neutral-500 transition hover:text-black sm:hidden"
        >
          SHIKO TË GJITHA →
        </Link>

      </div>
    </section>
  );
}