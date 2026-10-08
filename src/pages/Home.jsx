import Header from "../components/Header";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import NewArrivals from "../components/NewArrivals";
import BestSellers from "../components/BestSellers";
import Features from "../components/Features";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Header />

      <main>
        <Hero />
        <Categories />
        <NewArrivals />
        <BestSellers />
        <Features />
      </main>

      <Footer />
    </>
  );
}