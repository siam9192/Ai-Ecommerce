import { Product } from "@/types/product.type";
import { reviewsData } from "./reviews";

export const products: Product[] = [
  {
    id: 1,
    name: "Sony WH-1000XM5 Wireless Headphones",
    slug: "sony-wh-1000xm5-wireless-headphones",
    price: 399.99,
    description:
      "Industry-leading noise canceling headphones with two processors and 8 microphones for unprecedented sound quality.",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80",
    ],
    stock: 45,
    rating: 4.8,
    category: "Electronics",
    reviews: reviewsData[1],
  },
  {
    id: 2,
    name: "Apple Watch Series 9",
    slug: "apple-watch-series-9",
    price: 399.0,
    description:
      "Advanced health sensors, powerful fitness tracking, and a brighter Always-On Retina display with Double Tap gesture.",
    images: [
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80",
    ],
    stock: 30,
    rating: 4.7,
    category: "Electronics",
    reviews: reviewsData[2],
  },
  {
    id: 3,
    name: "Logitech MX Master 3S Wireless Mouse",
    slug: "logitech-mx-master-3s-wireless-mouse",
    price: 99.99,
    description:
      "An iconic ergonomic mouse remastered with 8K DPI tracking on glass and Quiet Clicks.",
    images: [
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80",
    ],
    stock: 85,
    rating: 4.9,
    category: "Electronics",
    reviews: reviewsData[3],
  },
  {
    id: 4,
    name: "Keychron K2 Wireless Mechanical Keyboard",
    slug: "keychron-k2-wireless-mechanical-keyboard",
    price: 84.99,
    description:
      "A compact 75% layout Bluetooth mechanical keyboard with RGB backlighting and Gateron switches.",
    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
    ],
    stock: 60,
    rating: 4.6,
    category: "Electronics",
    reviews: reviewsData[4],
  },
  {
    id: 5,
    name: "Minimalist Leather Backpack",
    slug: "minimalist-leather-backpack",
    price: 129.5,
    description:
      "Handcrafted full-grain leather laptop backpack designed for everyday commute and minimalist travel.",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    ],
    stock: 25,
    rating: 4.5,
    category: "Accessories",
    reviews: reviewsData[5],
  },
  {
    id: 6,
    name: "Nike Air Max 270",
    slug: "nike-air-max-270",
    price: 160.0,
    description:
      "Features Nike's biggest heel Air unit yet for a super-soft ride that feels as impossible as it looks.",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    ],
    stock: 110,
    rating: 4.7,
    category: "Footwear",
    reviews: reviewsData[6],
  },
  {
    id: 7,
    name: "Canon EOS R6 Mark II Mirrorless Camera",
    slug: "canon-eos-r6-mark-ii-mirrorless-camera",
    price: 2499.0,
    description:
      "Full-frame camera featuring 24.2 MP, 4K 60p raw video recording, and high-speed subject tracking.",
    images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
    ],
    stock: 12,
    rating: 4.9,
    category: "Electronics",
    reviews: reviewsData[7],
  },
  {
    id: 8,
    name: "Stainless Steel Thermal Water Bottle",
    slug: "stainless-steel-thermal-water-bottle",
    price: 29.99,
    description:
      "Double-wall vacuum insulated water bottle that keeps drinks cold for 24 hours or hot for 12 hours.",
    images: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80",
    ],
    stock: 200,
    rating: 4.4,
    category: "Accessories",
    reviews: reviewsData[8],
  },
  {
    id: 9,
    name: "Modern Ceramic Coffee Mug Set",
    slug: "modern-ceramic-coffee-mug-set",
    price: 34.0,
    description:
      "Set of 4 matte ceramic mugs with a cozy, comfortable grip. Dishwasher and microwave safe.",
    images: [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    ],
    stock: 50,
    rating: 4.3,
    category: "Home",
    reviews: reviewsData[9],
  },
  {
    id: 10,
    name: "Anker Magnetic Wireless Power Bank",
    slug: "anker-magnetic-wireless-power-bank",
    price: 49.99,
    description:
      "5,000mAh portable charger with foldable stand for MagSafe compatible devices.",
    images: [
      "https://images.unsplash.com/photo-1609592424009-880540d58be3?auto=format&fit=crop&w=800&q=80",
    ],
    stock: 140,
    rating: 4.6,
    category: "Electronics",
    reviews: reviewsData[10],
  },
  {
    id: 11,
    name: "Classic Polaroid Instant Camera",
    slug: "classic-polaroid-instant-camera",
    price: 119.99,
    description:
      "Analogue instant camera with autofocus, built-in double exposure, and a self-timer.",
    images: [
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80",
    ],
    stock: 18,
    rating: 4.5,
    category: "Electronics",
    reviews: reviewsData[11],
  },
  {
    id: 12,
    name: "Ergonomic Mesh Desk Chair",
    slug: "ergonomic-mesh-desk-chair",
    price: 249.0,
    description:
      "Breathable high-back office chair with adjustable lumbar support, armrests, and headrest.",
    images: [
      "https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?auto=format&fit=crop&w=800&q=80",
    ],
    stock: 22,
    rating: 4.2,
    category: "Furniture",
    reviews: reviewsData[12],
  },
  {
    id: 13,
    name: "Ray-Ban Classic Wayfarer Sunglasses",
    slug: "ray-ban-classic-wayfarer-sunglasses",
    price: 163.0,
    description:
      "Timeless unisex sunglasses featuring durable acetate frames and 100% UV protection lenses.",
    images: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
    ],
    stock: 70,
    rating: 4.8,
    category: "Accessories",
    reviews: reviewsData[13],
  },
  {
    id: 14,
    name: "Aromatherapy Essential Oil Diffuser",
    slug: "aromatherapy-essential-oil-diffuser",
    price: 39.95,
    description:
      "Ultrasonic cool mist humidifier with 7 color LED lights and automatic safety shut-off.",
    images: [
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80",
    ],
    stock: 95,
    rating: 4.4,
    category: "Home",
    reviews: reviewsData[14],
  },
  {
    id: 15,
    name: "Dell UltraSharp 27-inch 4K Monitor",
    slug: "dell-ultrasharp-27-inch-4k-monitor",
    price: 549.99,
    description:
      "IPS panel monitor with 99% sRGB color gamut, USB-C connectivity, and thin bezel design.",
    images: [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
    ],
    stock: 15,
    rating: 4.7,
    category: "Electronics",
    reviews: reviewsData[15],
  },
  {
    id: 16,
    name: "Vintage Denim Jacket",
    slug: "vintage-denim-jacket",
    price: 89.0,
    description:
      "Classic fit denim jacket made from 100% heavyweight cotton with button closure and chest pockets.",
    images: [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80",
    ],
    stock: 40,
    rating: 4.3,
    category: "Clothing",
    reviews: reviewsData[16],
  },
  {
    id: 17,
    name: "Smart Scented Candle",
    slug: "smart-scented-candle",
    price: 28.0,
    description:
      "Hand-poured soy wax candle infused with essential oils of lavender and eucalyptus.",
    images: [
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80",
    ],
    stock: 130,
    rating: 4.6,
    category: "Home",
    reviews: reviewsData[17],
  },
  {
    id: 18,
    name: "JBL Flip 6 Portable Bluetooth Speaker",
    slug: "jbl-flip-6-portable-bluetooth-speaker",
    price: 129.95,
    description:
      "IP67 waterproof and dustproof portable speaker delivering bold, crisp audio sound with deep bass.",
    images: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80",
    ],
    stock: 65,
    rating: 4.8,
    category: "Electronics",
    reviews: reviewsData[18],
  },
  {
    id: 19,
    name: "Non-Stick Cast Iron Skillet 10-inch",
    slug: "non-stick-cast-iron-skillet-10-inch",
    price: 45.0,
    description:
      "Pre-seasoned cast iron pan for even heat retention, ideal for searing, baking, and frying.",
    images: [
      "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80",
    ],
    stock: 80,
    rating: 4.9,
    category: "Home",
    reviews: reviewsData[19],
  },
  {
    id: 20,
    name: "Minimalist Analog Wrist Watch",
    slug: "minimalist-analog-wrist-watch",
    price: 149.0,
    description:
      "Sleek stainless steel watch case with a genuine leather strap and Japanese quartz movement.",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    ],
    stock: 35,
    rating: 4.6,
    category: "Accessories",
    reviews: reviewsData[20],
  },
];
