import { Review, ReviewReaction } from "@/types/review.type";

export const reviewsData: Record<number, Review[]> = {
  // Sony WH-1000XM5 Reviews
  1: [
    {
      id: "1",
      author: "John Smith",
      rating: 5,
      content:
        "Best headphones I've ever owned! The noise cancelling is absolutely incredible. I can wear them for hours without discomfort. The sound quality is pristine and the battery lasts forever.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
    {
      id: "2",
      author: "Sarah Johnson",
      rating: 5,
      content:
        "Switched from my old headphones and couldn't be happier. The ANC is top-notch and doesn't create that weird pressure feeling. Highly recommend for travelers.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
    {
      id: "3",
      author: "Mike Davis",
      rating: 4,
      content:
        "Excellent quality and features, but the price is quite high. Still, they last a long time and the sound quality justifies the cost.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
    {
      id: "4",
      author: "Emily Chen",
      rating: 5,
      content:
        "Using these for audio editing and they're perfect. The clarity and precision are outstanding. Customer service was also very helpful.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
    {
      id: "5",
      author: "Robert Wilson",
      rating: 4,
      content:
        "Very comfortable for long listening sessions. Touch controls take some getting used to, but they work well once you adapt.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
  ],

  // Apple Watch Series 9 Reviews
  2: [
    {
      id: "6",
      author: "Lisa Anderson",
      rating: 5,
      content:
        "Amazing smartwatch! The fitness tracking is incredibly accurate. Battery lasts about 2 days with normal use. Love the new Always-On display.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
    {
      id: "7",
      author: "David Martinez",
      rating: 5,
      content:
        "Perfect companion to my iPhone. The integration is seamless and notifications are super helpful.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
    {
      id: "8",
      author: "Jennifer Taylor",
      rating: 4,
      content:
        "Great watch but expensive. Would prefer if the battery lasted longer. Overall very satisfied with the purchase.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
    {
      id: "9",
      author: "Tom Brown",
      rating: 5,
      content:
        "The health monitoring features are excellent. The ECG app is accurate and the blood oxygen sensor works great.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
  ],

  // Logitech MX Master 3S Reviews
  3: [
    {
      id: "10",
      author: "Alex Rodriguez",
      rating: 5,
      content:
        "This mouse is a productivity beast! The customizable buttons have saved me so much time. Worth every penny.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
    {
      id: "11",
      author: "Patricia Lee",
      rating: 5,
      content:
        "Ergonomic design is perfect for long work sessions. No wrist pain anymore. The silent clicking is a great feature.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
    {
      id: "12",
      author: "James Wilson",
      rating: 5,
      content:
        "Best mouse for professionals. Multi-device connectivity works flawlessly. Highly recommend.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
    {
      id: "13",
      author: "Rachel Garcia",
      rating: 4,
      content:
        "Excellent mouse overall. Only downside is the price point, but quality justifies it.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
  ],

  // Keychron K2 Reviews
  4: [
    {
      id: "14",
      author: "Marcus Thompson",
      rating: 5,
      content:
        "Amazing mechanical keyboard! The RGB lighting is beautiful and the build quality is solid. Love the compact 75% layout.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
    {
      id: "15",
      author: "Amanda White",
      rating: 4,
      content:
        "Great keyboard for the price. Switches are smooth and the typing experience is fantastic. Battery life is impressive.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
    {
      id: "16",
      author: "Kevin Moore",
      rating: 5,
      content:
        "Perfect for gaming and typing. Bluetooth connectivity is stable and responsive.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
    {
      id: "17",
      author: "Nicole Harris",
      rating: 5,
      content:
        "Love this keyboard! The build quality is exceptional and the typing feel is premium.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
  ],

  // Minimalist Leather Backpack Reviews
  5: [
    {
      id: "18",
      author: "Christopher Martin",
      rating: 5,
      content:
        "Stunning quality leather backpack. Looks professional and holds everything I need for work. Very durable.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
    {
      id: "19",
      author: "Michelle Davis",
      rating: 5,
      content:
        "Absolutely love this backpack. The craftsmanship is evident and it gets better with age as the leather develops a patina.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
    {
      id: "20",
      author: "Brandon Jackson",
      rating: 4,
      content:
        "Great backpack but arrived with minor defects. Customer service fixed it quickly though.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
    {
      id: "21",
      author: "Sophia Miller",
      rating: 5,
      content:
        "Perfect for travel and daily use. Comfortable straps and well-organized compartments.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
  ],

  // Nike Air Max 270 Reviews
  6: [
    {
      id: "22",
      author: "Tyler Anderson",
      rating: 5,
      content:
        "Extremely comfortable sneakers! The Air unit is fantastic for walking and the design is sleek.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
    {
      id: "23",
      author: "Victoria Taylor",
      rating: 5,
      content:
        "Love these shoes! They look great and feel amazing on my feet. Great for daily wear.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
    {
      id: "24",
      author: "Jason Brown",
      rating: 4,
      content:
        "Good quality shoes. Runs a bit small, so size up if ordering online.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
    {
      id: "25",
      author: "Lauren White",
      rating: 5,
      content:
        "Outstanding comfort and durability. Pairs well with any outfit.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
  ],

  // Canon EOS R6 Mark II Reviews
  7: [
    {
      id: "26",
      author: "Nathan Clark",
      rating: 5,
      content:
        "Professional-grade camera! The autofocus is incredibly fast and accurate. 4K 60p video is amazing.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
    {
      id: "27",
      author: "Olivia Harris",
      rating: 5,
      content:
        "Perfect for professional photography. The image quality is exceptional and the build is solid.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
    {
      id: "28",
      author: "Daniel King",
      rating: 5,
      content:
        "Invested in this camera and haven't regretted it. Fantastic sensor and reliable performance.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
    {
      id: "29",
      author: "Grace Lee",
      rating: 4,
      content:
        "Excellent camera for the price. Steep learning curve but worth it.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
  ],

  // Stainless Steel Water Bottle Reviews
  8: [
    {
      id: "30",
      author: "Ryan Wright",
      rating: 5,
      content:
        "Best water bottle! Keeps drinks cold for 24 hours as advertised. Very durable.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
    {
      id: "31",
      author: "Emma Jones",
      rating: 5,
      content:
        "Love this bottle! Great insulation and the minimalist design is perfect.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
    {
      id: "32",
      author: "Lucas Garcia",
      rating: 4,
      content:
        "Good water bottle. Keeps drinks cold well. Slightly pricey but quality.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
    {
      id: "33",
      author: "Sophia Brown",
      rating: 5,
      content:
        "Excellent quality and keeps my drinks at the perfect temperature.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
  ],

  // Ceramic Coffee Mug Set Reviews
  9: [
    {
      id: "34",
      author: "Michael Green",
      rating: 5,
      content:
        "Beautiful mug set! The ceramic is high quality and the colors are vibrant.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
    {
      id: "35",
      author: "Hannah Moore",
      rating: 5,
      content:
        "Perfect gift! Mugs are durable and look great. Microwave and dishwasher safe.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
    {
      id: "36",
      author: "Ethan Davis",
      rating: 4,
      content: "Nice mug set. Arrived safely and looks even better in person.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
    {
      id: "37",
      author: "Amelia Wilson",
      rating: 5,
      content: "Excellent quality mugs. Great for everyday use or gifting.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
  ],

  // Anker Power Bank Reviews
  10: [
    {
      id: "38",
      author: "Christopher Lee",
      rating: 5,
      content:
        "Amazing power bank! Charges my phone multiple times. Compact design is perfect for travel.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
    {
      id: "39",
      author: "Isabel Martinez",
      rating: 5,
      content:
        "Great value for money. Charges fast and the build quality is excellent.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
    {
      id: "40",
      author: "Jacob Taylor",
      rating: 4,
      content:
        "Good power bank. Works well with MagSafe but wish battery was larger.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
    {
      id: "41",
      author: "Victoria Harris",
      rating: 5,
      content: "Perfect portable charger. Reliable and effective.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
  ],

  // Polaroid Camera Reviews
  11: [
    {
      id: "42",
      author: "Alexander Brown",
      rating: 5,
      content:
        "Fun and nostalgic! Great for events and parties. Photo quality is good.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
    {
      id: "43",
      author: "Jasmine White",
      rating: 5,
      content:
        "Excellent instant camera. Love the retro feel and instant prints are fantastic.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
    {
      id: "44",
      author: "Oliver Rodriguez",
      rating: 4,
      content:
        "Cool camera but film is expensive. Still worth it for the experience.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
    {
      id: "45",
      author: "Sophia Martinez",
      rating: 5,
      content: "Perfect for capturing memories instantly. Great build quality.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
  ],

  // Office Chair Reviews
  12: [
    {
      id: "46",
      author: "Matthew Clark",
      rating: 5,
      content:
        "Comfortable office chair! Great lumbar support and adjustable armrests. No back pain anymore.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
    {
      id: "47",
      author: "Diana Garcia",
      rating: 4,
      content: "Good ergonomic chair. Comfortable for long work sessions.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
    {
      id: "48",
      author: "Liam Thompson",
      rating: 5,
      content:
        "Excellent office chair. The mesh design keeps me cool and comfortable.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
    {
      id: "49",
      author: "Ava Johnson",
      rating: 5,
      content: "Best chair purchase! Great for my home office setup.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
  ],

  // Ray-Ban Sunglasses Reviews
  13: [
    {
      id: "50",
      author: "Henry Walker",
      rating: 5,
      content:
        "Classic sunglasses! Excellent UV protection and timeless design. Worth the investment.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
    {
      id: "51",
      author: "Natalie Young",
      rating: 5,
      content: "Perfect sunglasses. Great quality and they look amazing.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
    {
      id: "52",
      author: "Mason Lewis",
      rating: 4,
      content:
        "Good sunglasses but a bit pricey. Quality is undeniable though.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
    {
      id: "53",
      author: "Charlotte Hall",
      rating: 5,
      content: "Love my Ray-Bans! Comfortable, stylish, and durable.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
  ],

  // Dell UltraSharp Monitor Reviews
  15: [
    {
      id: "54",
      author: "Richard Foster",
      rating: 5,
      content:
        "Perfect 4K monitor for professionals. Color accuracy is outstanding.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
    {
      id: "55",
      author: "Linda Brooks",
      rating: 5,
      content: "Excellent monitor! The USB-C connectivity is very convenient.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
    {
      id: "56",
      author: "Michael Green",
      rating: 4,
      content: "Great monitor with fantastic color representation.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
  ],

  // Vintage Denim Jacket Reviews
  16: [
    {
      id: "57",
      author: "Sarah Edwards",
      rating: 5,
      content:
        "Fantastic quality denim jacket! Looks classic and feels durable.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
    {
      id: "58",
      author: "David Pierce",
      rating: 5,
      content: "Perfect vintage fit. Great value for the quality.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
    {
      id: "59",
      author: "Emma Watson",
      rating: 4,
      content: "Good jacket. Requires washing before first wear to soften.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
  ],

  // Smart Scented Candle Reviews
  17: [
    {
      id: "60",
      author: "Grace Collins",
      rating: 5,
      content: "Beautiful scent! The candle burns evenly and smells amazing.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
    {
      id: "61",
      author: "Thomas Murphy",
      rating: 5,
      content: "High quality candle with excellent fragrance. Worth it!",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
    {
      id: "62",
      author: "Rebecca Hill",
      rating: 4,
      content: "Nice candle. Scent is perfect for relaxation.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
  ],

  // JBL Speaker Reviews
  18: [
    {
      id: "63",
      author: "Steven Ross",
      rating: 5,
      content:
        "Excellent portable speaker! Sound quality is superb and waterproof design is practical.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
    {
      id: "64",
      author: "Julia Patterson",
      rating: 5,
      content:
        "Love this speaker! Great for outdoor activities and beach trips.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
    {
      id: "65",
      author: "Andrew King",
      rating: 5,
      content:
        "Best portable speaker for the price. Battery life is impressive.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
  ],

  // Cast Iron Skillet Reviews
  19: [
    {
      id: "66",
      author: "Maria Garcia",
      rating: 5,
      content:
        "Perfect cast iron skillet! Pre-seasoned and ready to use right out of the box.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
    {
      id: "67",
      author: "Joseph Martinez",
      rating: 5,
      content:
        "Excellent skillet for cooking. Heat distribution is even and consistent.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
    {
      id: "68",
      author: "Patricia White",
      rating: 5,
      content: "Great quality cast iron. Non-stick surface works beautifully.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
  ],

  // Analog Watch Reviews
  20: [
    {
      id: "69",
      author: "Daniel Anderson",
      rating: 5,
      content:
        "Beautiful minimalist watch! The leather strap is comfortable and the design is elegant.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
    {
      id: "70",
      author: "Sophie Turner",
      rating: 5,
      content:
        "Absolutely love this watch! Perfect for daily wear and professional settings.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
    {
      id: "71",
      author: "Christopher Adams",
      rating: 4,
      content: "Nice watch with great style. Keeps accurate time.",
      verified: true,
      reaction: ReviewReaction.SATISFIED,
    },
  ],
};

// Export a function to get reviews by product ID
export function getProductReviews(productId: number): Review[] {
  return reviewsData[productId] || [];
}
