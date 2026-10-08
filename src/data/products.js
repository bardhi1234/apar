const products = [
  {
    id: 1,
    name: "Duks APAR Classic",
    category: "Veshje",

    price: 34.99,
    oldPrice: 44.99,

    badge: "NEW",

    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85",

    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1400&q=90",

      "https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=1400&q=90",

      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1400&q=90",

      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1400&q=90",
    ],

    description:
      "Duks modern me prerje premium, material të rehatshëm dhe stil minimalist për përdorim të përditshëm.",

    sizes: [
      "S",
      "M",
      "L",
      "XL",
    ],

    colors: [
      "E zezë",
      "E bardhë",
    ],

    stock: 12,
  },

  {
    id: 2,
    name: "Maicë Essential",
    category: "Veshje",

    price: 24.99,
    oldPrice: 29.99,

    badge: "BESTSELLER",

    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85",

    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1400&q=90",

      "https://images.unsplash.com/photo-1583743814966-8936f37f998?auto=format&fit=crop&w=1400&q=90",

      "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=1400&q=90",

      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1400&q=90",
    ],

    description:
      "Maicë minimaliste me material të rehatshëm, prerje moderne dhe stil të pastër për kombinime të përditshme.",

    sizes: [
      "S",
      "M",
      "L",
      "XL",
    ],

    colors: [
      "E bardhë",
      "E zezë",
    ],

    stock: 20,
  },

  {
    id: 3,
    name: "Kapelë Minimal",
    category: "Aksesorë",

    price: 19.99,

    badge: "NEW",

    image:
      "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=900&q=85",

    images: [
      "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=1400&q=90",

      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1400&q=90",

      "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&w=1400&q=90",
    ],

    description:
      "Kapelë moderne me dizajn minimalist, ideale për kombinime casual dhe streetwear.",

    sizes: [],

    colors: [
      "E zezë",
    ],

    stock: 18,
  },

  {
    id: 4,
    name: "Çantë Crossbody",
    category: "Aksesorë",

    price: 29.99,
    oldPrice: 36.99,

    badge: "SALE",

    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85",

    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1400&q=90",

      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1400&q=90",

      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=1400&q=90",

      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1400&q=90",
    ],

    description:
      "Çantë kompakte dhe praktike me dizajn modern, e përshtatshme për përdorim të përditshëm.",

    sizes: [],

    colors: [
      "E zezë",
    ],

    stock: 8,
  },

  {
    id: 5,
    name: "Parfum Noir",
    category: "Kozmetikë",

    price: 39.99,

    badge: "NEW",

    image:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=85",

    images: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1400&q=90",

      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1400&q=90",

      "https://images.unsplash.com/photo-1587017539504-67cfbddac569?auto=format&fit=crop&w=1400&q=90",

      "https://images.unsplash.com/photo-1610461888750-10bfc601b874?auto=format&fit=crop&w=1400&q=90",
    ],

    description:
      "Aromë elegante me karakter modern dhe prezencë të rafinuar për përdorim të përditshëm ose raste të veçanta.",

    sizes: [],

    colors: [],

    stock: 10,
  },

  {
    id: 6,
    name: "Set Personalizimi",
    category: "Personalizim",

    price: 29.99,

    badge: "CUSTOM",

    image:
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=900&q=85",

    images: [
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1400&q=90",

      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1400&q=90",

      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1400&q=90",

      "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=1400&q=90",
    ],

    description:
      "Personalizo produktin me emër, tekst, fotografi ose dizajn sipas dëshirës dhe krijo diçka vetëm për ty.",

    sizes: [
      "S",
      "M",
      "L",
      "XL",
    ],

    colors: [
      "E zezë",
      "E bardhë",
    ],

    stock: 99,
  },
];

export default products;