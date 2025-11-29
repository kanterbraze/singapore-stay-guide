
import { LocationData, Trail } from './types';

// Helper to generate reliable Unsplash images
// We use direct links to ensure they load reliably compared to AI generators
const getUnsplashUrl = (id: string) => {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80`;
}

// Fallback for generated items
const getGeneratedPlaceholder = (name: string) => {
  return `https://loremflickr.com/800/600/singapore,travel?lock=${Math.abs(name.length)}`;
}

// Helper for local images
const getLocalPhotoUrl = (id: string) => {
  // import.meta.env.BASE_URL handles the subpath deployment (e.g. /singapore-stay-guide/)
  return `${import.meta.env.BASE_URL}places/${id}.jpg`;
}

export const SINGAPORE_TRAILS: Trail[] = [
  {
    id: 'trail-1',
    name: 'Colonial District Heritage',
    description: 'Walk through the heart of the British colonial era, visiting grand monuments and historic sites.',
    category: 'Heritage',
    duration: '3 hours',
    steps: [
      { name: 'Raffles Landing Site', coordinates: [1.2865, 103.8514], time: '09:00 AM', description: 'Start where Sir Stamford Raffles first landed.' },
      { name: 'Victoria Theatre', coordinates: [1.2882, 103.8515], time: '09:45 AM', description: 'Admire the colonial architecture.' },
      { name: 'National Gallery', coordinates: [1.2902, 103.8517], time: '10:30 AM', description: 'Former Supreme Court and City Hall.' },
      { name: 'St Andrew\'s Cathedral', coordinates: [1.2922, 103.8522], time: '11:15 AM', description: 'The largest cathedral in Singapore.' },
      { name: 'Raffles Hotel', coordinates: [1.2949, 103.8545], time: '12:00 PM', description: 'End with a Singapore Sling.' }
    ]
  },
  {
    id: 'trail-2',
    name: 'Joo Chiat Peranakan Walk',
    description: 'Explore the colorful shophouses and rich culture of the Straits Chinese community.',
    category: 'Culture',
    duration: '2 hours',
    steps: [
      { name: 'Koon Seng Road', coordinates: [1.3134, 103.9022], time: '04:00 PM', description: 'Famous colorful shophouses.' },
      { name: 'Kim Choo Kueh Chang', coordinates: [1.3093, 103.9045], time: '04:45 PM', description: 'Taste traditional Nyonya rice dumplings.' },
      { name: 'Rumah Bebe', coordinates: [1.3088, 103.9048], time: '05:15 PM', description: 'Heritage boutique and museum.' }
    ]
  },
  {
    id: 'trail-3',
    name: 'Southern Ridges Nature',
    description: 'A scenic 10km trail connecting parks through the lush rolling hills of Singapore.',
    category: 'Nature',
    duration: '4 hours',
    steps: [
      { name: 'Marang Trail', coordinates: [1.2678, 103.8189], time: '08:00 AM', description: 'Start your hike at Harbourfront.' },
      { name: 'Mount Faber Park', coordinates: [1.2727, 103.8166], time: '08:45 AM', description: 'Panoramic views of the city.' },
      { name: 'Henderson Waves', coordinates: [1.2760, 103.8154], time: '09:30 AM', description: 'Singapore\'s highest pedestrian bridge.' },
      { name: 'Forest Walk', coordinates: [1.2796, 103.8055], time: '10:30 AM', description: 'Elevated walkway through the canopy.' }
    ]
  },
  {
    id: 'trail-4',
    name: 'Chinatown Food Discovery',
    description: 'A culinary journey through the historic streets of Chinatown, hitting the best hawker spots.',
    category: 'Food',
    duration: '2.5 hours',
    steps: [
      { name: 'Chinatown Complex', coordinates: [1.2822, 103.8432], time: '11:00 AM', description: 'Start at the largest hawker centre in Singapore.' },
      { name: 'Maxwell Food Centre', coordinates: [1.2803, 103.8447], time: '12:00 PM', description: 'Stop for the famous Tian Tian Chicken Rice.' },
      { name: 'Tong Ah Eating House', coordinates: [1.2796, 103.8415], time: '01:00 PM', description: 'End with traditional coffee and crispy toast.' }
    ]
  },
  {
    id: 'trail-5',
    name: 'Singapore River Pub Crawl',
    description: 'Experience the vibrant nightlife along the historic river quays.',
    category: 'Nightlife',
    duration: '4 hours',
    steps: [
      { name: 'Boat Quay', coordinates: [1.2863, 103.8489], time: '06:00 PM', description: 'Start with sunset drinks by the river.' },
      { name: 'Clarke Quay', coordinates: [1.2905, 103.8466], time: '08:00 PM', description: 'Head to the party central of Singapore.' },
      { name: 'Robertson Quay', coordinates: [1.2909, 103.8383], time: '10:00 PM', description: 'Wind down with laid back vibes for a nightcap.' }
    ]
  },
  {
    id: 'trail-6',
    name: 'Civic District Art Walk',
    description: 'Walk through the arts and culture precinct of the city, admiring grand architecture.',
    category: 'Urban',
    duration: '2 hours',
    steps: [
      { name: 'National Museum', coordinates: [1.2966, 103.8485], time: '10:00 AM', description: 'Start at the oldest museum in Singapore.' },
      { name: 'Peranakan Museum', coordinates: [1.2944, 103.8490], time: '11:00 AM', description: 'Explore unique Peranakan culture.' },
      { name: 'The Arts House', coordinates: [1.2896, 103.8501], time: '11:45 AM', description: 'Visit the Old Parliament House turned art space.' }
    ]
  }
];

export const SINGAPORE_LOCATIONS: LocationData[] = [
  // --- Places of Interests ---
  {
    id: 'braze-sg',
    name: 'Braze Singapore Office',
    description: 'The regional headquarters for Braze. A key hub for customer engagement in Asia.',
    category: 'Places of Interests',
    coordinates: [1.2829, 103.8509], // Approx near Raffles Place/Marina Bay Financial Centre
    rating: 5.0,
    imageUrl: getUnsplashUrl('1497366216548-37526070297c'),
    priceRange: 'Free',
    tips: 'Located in the heart of the CBD, surrounded by great food options.'
  },
  {
    id: '1',
    name: 'Marina Bay Sands',
    description: 'Iconic integrated resort fronting Marina Bay in Singapore. Known for its massive rooftop infinity pool and luxury shopping.',
    category: 'Places of Interests',
    coordinates: [1.2834, 103.8607],
    rating: 4.8,
    imageUrl: getLocalPhotoUrl('1'),
    priceRange: '$$$$',
    tips: 'Visit the observation deck at sunset for the best views. Book rooms well in advance.'
  },
  {
    id: '2',
    name: 'Gardens by the Bay',
    description: 'A futuristic nature park spanning 101 hectares. Features the iconic Supertrees and climate-controlled cooled conservatories.',
    category: 'Places of Interests',
    coordinates: [1.2816, 103.8636],
    rating: 4.9,
    imageUrl: getUnsplashUrl('1596429141088-7505672d2110'),
    priceRange: '$$',
    tips: 'Don\'t miss the Garden Rhapsody light show in the evening at the Supertree Grove.'
  },
  {
    id: '3',
    name: 'Jewel Changi Airport',
    description: 'Nature-themed entertainment and retail complex featuring the Rain Vortex, the world\'s tallest indoor waterfall.',
    category: 'Places of Interests',
    coordinates: [1.3602, 103.9898],
    rating: 4.9,
    imageUrl: getLocalPhotoUrl('3'),
    priceRange: 'Free',
    tips: 'Perfect for a visit right after landing or before flying out.'
  },
  {
    id: '3b',
    name: 'Sentosa Island',
    description: 'The State of Fun. A resort island with beaches, Universal Studios, and adventure parks.',
    category: 'Places of Interests',
    coordinates: [1.2494, 103.8303],
    rating: 4.7,
    imageUrl: getLocalPhotoUrl('3b'),
    priceRange: '$$$',
    tips: 'Take the cable car for a scenic entry into the island.'
  },
  {
    id: '3c',
    name: 'Singapore Zoo',
    description: 'World-famous "open concept" rainforest zoo where animals roam freely in naturalistic habitats.',
    category: 'Places of Interests',
    coordinates: [1.4043, 103.7930],
    rating: 4.8,
    imageUrl: getLocalPhotoUrl('3c'),
    priceRange: '$$$',
    tips: 'Go for the "Breakfast with Orangutans" experience.'
  },
  {
    id: '3d',
    name: 'Merlion Park',
    description: 'A major tourist attraction located at One Fullerton, Singapore, near the Central Business District.',
    category: 'Places of Interests',
    coordinates: [1.2868, 103.8545],
    rating: 4.5,
    imageUrl: getLocalPhotoUrl('3d'),
    priceRange: 'Free',
    tips: 'Best photo spot is from the jetty extending out onto the water.'
  },
  {
    id: '3e',
    name: 'Haji Lane',
    description: 'A narrow lane in the Kampong Glam neighborhood, famous for its colorful street art, indie boutiques, and cafes.',
    category: 'Places of Interests',
    coordinates: [1.3007, 103.8584],
    rating: 4.6,
    imageUrl: getLocalPhotoUrl('3e'),
    priceRange: 'Free',
    tips: 'Visit in the late afternoon for shopping and stay for live music at night.'
  },

  // --- Events & Activities (New Category) ---
  {
    id: 'evt-1',
    name: 'Universal Studios Singapore',
    description: 'Southeast Asia’s first and only Universal Studios theme park, featuring 24 rides, shows, and attractions in seven themed zones.',
    category: 'Events & Activities',
    coordinates: [1.2540, 103.8238],
    rating: 4.7,
    imageUrl: getLocalPhotoUrl('evt-1'),
    priceRange: '$$$$',
    tips: 'Buy an Express Pass if visiting on weekends to skip long queues.'
  },
  {
    id: 'evt-2',
    name: 'Singapore Flyer',
    description: 'A giant observation wheel offering 360-degree views of Marina Bay and the city skyline.',
    category: 'Events & Activities',
    coordinates: [1.2893, 103.8631],
    rating: 4.5,
    imageUrl: getLocalPhotoUrl('evt-2'),
    priceRange: '$$$',
    tips: 'Ride at dusk to see the city transition from day to night.'
  },
  {
    id: 'evt-3',
    name: 'Night Safari',
    description: 'The world’s first nocturnal wildlife park. Explore the jungle at night on a guided tram ride.',
    category: 'Events & Activities',
    coordinates: [1.4021, 103.7880],
    rating: 4.6,
    imageUrl: getLocalPhotoUrl('evt-3'),
    priceRange: '$$$',
    tips: 'Catch the "Creatures of the Night" show; arrive early for seats.'
  },
  {
    id: 'evt-4',
    name: 'S.E.A. Aquarium',
    description: 'One of the world\'s largest aquariums, home to more than 100,000 marine animals representing 1,000 species.',
    category: 'Events & Activities',
    coordinates: [1.2583, 103.8205],
    rating: 4.7,
    imageUrl: getLocalPhotoUrl('evt-4'),
    priceRange: '$$$',
    tips: 'The Open Ocean habitat viewing panel is mesmerizing for photos.'
  },
  {
    id: 'evt-5',
    name: 'Adventure Cove Waterpark',
    description: 'Aquatic adventure park with high-speed water slides and a chance to snorkel with fish.',
    category: 'Events & Activities',
    coordinates: [1.2590, 103.8200],
    rating: 4.5,
    imageUrl: getLocalPhotoUrl('evt-5'),
    priceRange: '$$$',
    tips: 'Don\'t miss the Riptide Rocket, Southeast Asia\'s first hydro-magnetic coaster.'
  },

  // --- Food (Local Hawker) ---
  {
    id: '4',
    name: 'Maxwell Food Centre',
    description: 'One of Singapore’s most famous hawker centres, located near Chinatown. Home to the legendary Tian Tian Chicken Rice.',
    category: 'Food (Local Hawker)',
    coordinates: [1.2803, 103.8447],
    rating: 4.6,
    imageUrl: getLocalPhotoUrl('4'),
    priceRange: '$',
    tips: 'Go early (before 11:30 AM) to avoid the massive queue for Chicken Rice.'
  },
  {
    id: '5',
    name: 'Lau Pa Sat',
    description: 'A historic market building blending Victorian architecture with local food culture. Famous for Satay Street at night.',
    category: 'Food (Local Hawker)',
    coordinates: [1.2807, 103.8504],
    rating: 4.4,
    imageUrl: getLocalPhotoUrl('5'),
    priceRange: '$$',
    tips: 'Visit after 7 PM when the street is closed off for outdoor Satay dining.'
  },
  {
    id: '6',
    name: 'Old Airport Road Food Centre',
    description: 'Widely considered by locals as one of the best hawker centres for variety and quality.',
    category: 'Food (Local Hawker)',
    coordinates: [1.3082, 103.8858],
    rating: 4.7,
    imageUrl: getLocalPhotoUrl('6'),
    priceRange: '$',
    tips: 'Try the Soya Beancurd and Hokkien Mee.'
  },
  {
    id: '6b',
    name: 'Newton Food Centre',
    description: 'Famous hawker centre featured in "Crazy Rich Asians". Known for seafood and BBQ wings.',
    category: 'Food (Local Hawker)',
    coordinates: [1.3129, 103.8395],
    rating: 4.3,
    imageUrl: getLocalPhotoUrl('6b'),
    priceRange: '$$',
    tips: 'Prices can be slightly higher here; always ask for the price of seafood by weight before ordering.'
  },
  {
    id: '6c',
    name: 'Tiong Bahru Market',
    description: 'Located in a hip art deco neighborhood. Great for local breakfast items like Chwee Kueh.',
    category: 'Food (Local Hawker)',
    coordinates: [1.2850, 103.8322],
    rating: 4.6,
    imageUrl: getLocalPhotoUrl('6c'),
    priceRange: '$',
    tips: 'Explore the wet market downstairs before heading upstairs for food.'
  },
  {
    id: '6d',
    name: 'Tekka Centre',
    description: 'The place for Indian food. Biryani, Prata, and Teh Tarik galore.',
    category: 'Food (Local Hawker)',
    coordinates: [1.3060, 103.8500],
    rating: 4.5,
    imageUrl: getLocalPhotoUrl('6d'),
    priceRange: '$',
    tips: 'Try the Dum Biryani and wash it down with a mango lassi.'
  },

  // --- History ---
  {
    id: '7',
    name: 'National Museum of Singapore',
    description: 'The oldest museum in Singapore. Its history gallery tells the story of the nation from the 14th century to the present.',
    category: 'History',
    coordinates: [1.2966, 103.8485],
    rating: 4.7,
    imageUrl: getLocalPhotoUrl('7'),
    priceRange: '$$',
    tips: 'The immersive digital art installations are great for photos.'
  },
  {
    id: '8',
    name: 'Battlebox at Fort Canning',
    description: 'A former WWII British underground command centre inside Fort Canning Hill.',
    category: 'History',
    coordinates: [1.2943, 103.8465],
    rating: 4.6,
    imageUrl: getLocalPhotoUrl('8'),
    priceRange: '$$',
    tips: 'You must book a guided tour to enter; it is very educational.'
  },
  {
    id: '9',
    name: 'Chinatown Heritage Centre',
    description: 'Located within three restored shophouses, it recreates the living quarters of Singapore\'s early pioneers.',
    category: 'History',
    coordinates: [1.2833, 103.8443],
    rating: 4.5,
    imageUrl: getLocalPhotoUrl('9'),
    priceRange: '$$',
    tips: 'A great starting point before exploring the rest of Chinatown.'
  },
  {
    id: '9b',
    name: 'Asian Civilisations Museum',
    description: 'Dedicated to exploring the rich artistic heritage of Asia and Singapore\'s ancestral cultures.',
    category: 'History',
    coordinates: [1.2875, 103.8514],
    rating: 4.6,
    imageUrl: getLocalPhotoUrl('9b'),
    priceRange: '$$',
    tips: 'Located right by the Singapore River, perfect for a walk afterwards.'
  },
  {
    id: '9c',
    name: 'Kranji War Memorial',
    description: 'A hillside cemetery that honors the men and women from the Commonwealth who died in the line of duty during WWII.',
    category: 'History',
    coordinates: [1.4194, 103.7580],
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1596707327339-38374d6c7014?auto=format&fit=crop&w=800&q=80',
    priceRange: 'Free',
    tips: 'It is very serene and solemn. A bit far from the city, so plan travel time.'
  },
  {
    id: '9d',
    name: 'Thian Hock Keng Temple',
    description: 'One of the oldest and most important Hokkien temples in Singapore. Built without using a single nail.',
    category: 'History',
    coordinates: [1.2813, 103.8475],
    rating: 4.6,
    imageUrl: getLocalPhotoUrl('9d'),
    priceRange: 'Free',
    tips: 'Admire the intricate carvings on the pillars and roof.'
  },

  // --- Hiking, Nature ---
  {
    id: '10',
    name: 'Singapore Botanic Gardens',
    description: 'A UNESCO World Heritage Site. A 162-year-old tropical garden located at the fringe of the Orchard Road shopping district.',
    category: 'Hiking, Nature',
    coordinates: [1.3138, 103.8159],
    rating: 4.8,
    imageUrl: getLocalPhotoUrl('10'),
    priceRange: 'Free',
    tips: 'The National Orchid Garden requires a ticket but is the highlight.'
  },
  {
    id: '11',
    name: 'MacRitchie Reservoir Park',
    description: 'Popular for nature lovers and exercise enthusiasts. Features the Treetop Walk, a 250m suspension bridge.',
    category: 'Hiking, Nature',
    coordinates: [1.3439, 103.8190],
    rating: 4.7,
    imageUrl: getUnsplashUrl('1635848984920-f5f569720468'),
    priceRange: 'Free',
    tips: 'Bring plenty of water and insect repellent. Watch out for monkeys (do not feed them!).'
  },
  {
    id: '12',
    name: 'Pulau Ubin',
    description: 'An island sanctuary that reflects 1960s Singapore. One of the last "kampongs" (villages) in Singapore.',
    category: 'Hiking, Nature',
    coordinates: [1.4110, 103.9575],
    rating: 4.6,
    imageUrl: getUnsplashUrl('1619586161138-0283c748c081'),
    priceRange: '$',
    tips: 'Rent a bicycle near the jetty to explore the island efficiently.'
  },
  {
    id: '12b',
    name: 'Southern Ridges',
    description: 'A 10km stretch of green open spaces connecting Mount Faber Park, Telok Blangah Hill Park, and Kent Ridge Park.',
    category: 'Hiking, Nature',
    coordinates: [1.2796, 103.8130],
    rating: 4.7,
    imageUrl: getLocalPhotoUrl('12b'),
    priceRange: 'Free',
    tips: 'Henderson Waves is the most photogenic spot on the trail.'
  },
  {
    id: '12c',
    name: 'Sungei Buloh Wetland Reserve',
    description: 'Singapore’s first ASEAN Heritage Park. A haven for migratory birds and mangrove wildlife.',
    category: 'Hiking, Nature',
    coordinates: [1.4468, 103.7302],
    rating: 4.5,
    imageUrl: getUnsplashUrl('1629853381467-3c58b6883501'),
    priceRange: 'Free',
    tips: 'Look out for crocodiles and monitor lizards basking in the sun.'
  },
  {
    id: '12d',
    name: 'Fort Canning Park',
    description: 'An iconic hilltop landmark that has witnessed many of Singapore’s historical milestones.',
    category: 'Hiking, Nature',
    coordinates: [1.2929, 103.8463],
    rating: 4.6,
    imageUrl: getUnsplashUrl('1565538054084-2e90f2cb831e'),
    priceRange: 'Free',
    tips: 'Find the famous "Tree Tunnel" spiral staircase for a great photo.'
  },

  // --- Food (Restaurants) ---
  {
    id: '13',
    name: 'Raffles Hotel (Long Bar)',
    description: 'Historic luxury hotel bar. The birthplace of the Singapore Sling.',
    category: 'Food (Restaurants)',
    coordinates: [1.2949, 103.8545],
    rating: 4.5,
    imageUrl: getLocalPhotoUrl('13'),
    priceRange: '$$$$',
    tips: 'It is a tradition to throw peanut shells on the floor here.'
  },
  {
    id: '14',
    name: 'Odette',
    description: 'A modern French restaurant located at the National Gallery Singapore. consistently ranked as one of Asia\'s best.',
    category: 'Food (Restaurants)',
    coordinates: [1.2902, 103.8517],
    rating: 4.9,
    imageUrl: getLocalPhotoUrl('14'),
    priceRange: '$$$$',
    tips: 'Reservations are required months in advance.'
  },
  {
    id: '15',
    name: 'Jumbo Seafood (East Coast)',
    description: 'Famous for its award-winning Chilli Crab and Black Pepper Crab.',
    category: 'Food (Restaurants)',
    coordinates: [1.3039, 103.9324],
    rating: 4.4,
    imageUrl: getUnsplashUrl('1548029960-6f4dd516ba79'), // Crab
    priceRange: '$$$',
    tips: 'Order the fried "mantou" buns to dip in the Chilli Crab sauce.'
  },
  {
    id: '15b',
    name: 'Atlas Bar',
    description: 'A grand lobby and bar located on the ground floor of Parkview Square. Known for its Art Deco design and gin tower.',
    category: 'Food (Restaurants)',
    coordinates: [1.3005, 103.8580],
    rating: 4.8,
    imageUrl: getLocalPhotoUrl('15b'),
    priceRange: '$$$$',
    tips: 'Dress code is smart casual. The interior is breathtaking.'
  },
  {
    id: '15c',
    name: 'Keng Eng Kee Seafood',
    description: 'A favorite "Zichar" (home-style cooking) spot among locals and chefs like Anthony Bourdain.',
    category: 'Food (Restaurants)',
    coordinates: [1.2858, 103.8058],
    rating: 4.6,
    imageUrl: getLocalPhotoUrl('15c'),
    priceRange: '$$',
    tips: 'Must try: Moonlight Hor Fun and Coffee Pork Ribs.'
  },
  {
    id: '15d',
    name: 'CÉ LA VI',
    description: 'Rooftop bar and restaurant atop Marina Bay Sands, offering panoramic views of the city skyline.',
    category: 'Food (Restaurants)',
    coordinates: [1.2834, 103.8607],
    rating: 4.3,
    imageUrl: getLocalPhotoUrl('15d'),
    priceRange: '$$$$',
    tips: 'Great spot for a drink if you want the view without paying for the observation deck.'
  }
];
