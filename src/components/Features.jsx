import { Headphones, PackageCheck, ShieldCheck, Truck } from "lucide-react";

const features = [
  {
    icon: PackageCheck,
    title: "Pagesë në dorëzim",
    description: "Paguaj vetëm kur e merr porosinë.",
  },
  {
    icon: Truck,
    title: "Dërgesë në Kosovë",
    description: "Dërgesë e shpejtë dhe e sigurt.",
  },
  {
    icon: ShieldCheck,
    title: "Porosi e sigurt",
    description: "Të dhënat e tua trajtohen me kujdes.",
  },
  {
    icon: Headphones,
    title: "Mbështetje",
    description: "Jemi këtu për çdo pyetje.",
  },
];

export default function Features() {
  return (
    <section className="border-y border-neutral-800 bg-[#0a0a0a] text-white">
      <div className="mx-auto grid max-w-[1500px] md:grid-cols-2 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="flex gap-4 border-neutral-800 p-8 lg:border-r last:border-r-0"
          >
            <Icon size={27} />

            <div>
              <p className="font-semibold">{title}</p>
              <p className="mt-1 text-sm leading-6 text-neutral-500">
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}