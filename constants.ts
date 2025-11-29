
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
    imageUrl: 'https://places.googleapis.com/v1/places/ChIJw3l-FL4X2jERw2pScvHQCbg/photos/AWn5SU79jqbDN4zBb1VJ1vyAWwKjqn3tiXsIEMFXpElicTVr0Yg34Ida0VFU-r9iiqUMCbsJwu0ZUknDeD0CuhHKbu04OhEIKx-gfWEKIG0JaFivz8sMa7VZ8ir2GwinW-mMtYoCTKsrYI9q8XEW7wNp4Jz3dWeTt3F_ncGdlhrFb9Ju5joZnOU6-OUUWmGLnuwEDk8seS9DJZqdLfE2sBxSeGk9-nXE1JozC8wahdIYYLl_WvkoD3NWMMyJRXImkJdikI9VgdXTHjIOAjGVI2iXUi-Jqkexz4-OkeDQnx5re2WiA6OyTVy4qKElMQsaQt3yJQvRYOnrPyJTb4OzxtV2Y684zqKSZdn07MDdIdzq7P32nikSIbs5zmxM0mEXJA1ESAJyiYVfwDv8EZksZUKP15xbYtIj4vAekkZp5Yw-FGM/media?maxWidthPx=800&key=' + (process.env.GOOGLE_MAPS_API_KEY || ''),
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
    imageUrl: 'https://places.googleapis.com/v1/places/ChIJw3l-FL4X2jERw2pScvHQCbg/photos/AWn5SU79jqbDN4zBb1VJ1vyAWwKjqn3tiXsIEMFXpElicTVr0Yg34Ida0VFU-r9iiqUMCbsJwu0ZUknDeD0CuhHKbu04OhEIKx-gfWEKIG0JaFivz8sMa7VZ8ir2GwinW-mMtYoCTKsrYI9q8XEW7wNp4Jz3dWeTt3F_ncGdlhrFb9Ju5joZnOU6-OUUWmGLnuwEDk8seS9DJZqdLfE2sBxSeGk9-nXE1JozC8wahdIYYLl_WvkoD3NWMMyJRXImkJdikI9VgdXTHjIOAjGVI2iXUi-Jqkexz4-OkeDQnx5re2WiA6OyTVy4qKElMQsaQt3yJQvRYOnrPyJTb4OzxtV2Y684zqKSZdn07MDdIdzq7P32nikSIbs5zmxM0mEXJA1ESAJyiYVfwDv8EZksZUKP15xbYtIj4vAekkZp5Yw-FGM/media?maxWidthPx=800&key=' + (process.env.GOOGLE_MAPS_API_KEY || ''),
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
    imageUrl: 'https://places.googleapis.com/v1/places/ChIJRYMSeKwe2jERAR2QXVU39vg/photos/AWn5SU4Bs2l8jR6oavRQ7dilivMkhZsJxpYQeXm6VaJb65AHt6HUdVBzPPtljD3a0fmlfYEUY3x5rJrvGWiAKGQvL6dltQNEfFXiquIVCb8ykUHjNWnHmIq5v73xfOHsBi2dL_SzpKZgreQvxiB-PUHxVyVkYtpA20LSFfDC5e6F_Cbj1vTPg-UdJYL4rydxgL0hTyLGBymBcWZRxAyPRPgALSjNxc96ZITktvY6kvYRPIKRAtLe80z7tx54jBvKnO2D23kRHdbDTXyQFc5JrlMgsyoADrn22jgWsnyX2I1pODQ1yMvsLLhJ2xUQoSK255TTqTXO1MRzTqZ2Oppp-24GFUw9KAPlveSvvmM3ee1jTPvBMzKFuK1MH1yUJPc_m_I7bwvZLwogyGdwf71LmX4e6_8z5unhfYMSTtOhMXWa0htvdlbw/media?maxWidthPx=800&key=' + (process.env.GOOGLE_MAPS_API_KEY || ''),
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
    imageUrl: 'https://places.googleapis.com/v1/places/ChIJr9wqENkT2jERkRs7pMj6FLQ/photos/AWn5SU4wlsb22eaNviNAKIqa-vmAnbVeMwz0VBIr7tL91HiVIIZl6bXFFO95ci6_Lz-cBNSDFKpat2AGwbYB1xugmFSsGVQIjIfw44Iebaf8Cd9KSKha1qCbLcwkabRIL_dXuJgwFKo6SoycLM_u-YkaSSL6sGEV9iVuiNoGe_SQNGHUQt0ABNBR5iK22suS1UYaKqvUaU4VPHik6i7KsC_BOzuBlTZkDwrERI_uP6sORrPo0kHBdGfHTkAlM-xO32ivrQIBk3k_e2yjBZqWfV7jMyEDv4QBalO1XzoQwk6p_pHiJlHALrZjGYozFwYfc5g-cqBPGoxv3KppzI-gQRQ6KQk4-KhBL07-STjK5P53n59tO0DK0gXu1CB2XCGEDOVS6NFE9EIU3MtHgS-obHN6VtuC-NewfoQqXFheoWmCR3p5-DyK/media?maxWidthPx=800&key=' + (process.env.GOOGLE_MAPS_API_KEY || ''),
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
    imageUrl: 'https://places.googleapis.com/v1/places/ChIJBTYg1g4Z2jERp_MBbu5erWY/photos/AWn5SU4utEw5WxLHkuVfieQO7fh2l67ByMaA-EmY99QzqRG1nKpFANUFpZktfVuI3aXOZHtsSmvG0SXl8v7DSei8tHZUKcmxSTqBiFN0ffkx1wprjPNixs018vUyhan7xgq90zO24o9BZu2k2oUUnWK3CGZ4dJGp87jP1J0cvbiFVlKHoV6vdn2_XSM2linU_-tboyApGVQOegkwILerKVDFk-6xG8u09FUCV53e-GKwlX3VZBtcu3EdkX9ngNtV6dGBfsoKd6QQ4Z7IgA0NGlAPQYc1a3u362EIJJYE5xydzy8jrc781niUDL5iN3i03T-h8AY6e1V4JBIr5jw_rd_CxNsOAheWeU22Xy8kFy2WXvGG_saVvWx77ouzGdcUO-qv25S-B1x2vkZbBOXfE31PlV8zjs3W2K_n5Qp6o9A4ZFEXcw/media?maxWidthPx=800&key=' + (process.env.GOOGLE_MAPS_API_KEY || ''),
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
    imageUrl: 'https://places.googleapis.com/v1/places/ChIJyQfG_rAZ2jER6Yr2-WKP3mc/photos/AWn5SU6W_PGZtJh9yzjMO_xJluY8X8sDqNuDwlJHls83HftjGMzpMr7WagV1M8HGhJS5_cu2ny39_n9arokMxYi3clt0nt9xu7XbM3BFd_EtSgT2OQwdLzieQqAyYMCClDhlUf5UgXek-YaLK0iKsZ7FDM0MlVKV6BBgB_io99JWBTzRsnZAFJXatjJLeTTkjpddEIeICtXCJx96TawffqXxfC0jd5XU__jq8PASY_MfYEd5WTXBuxG0tV7j8-lhfZhvtOth-EawOh8V3k3LWmCgewO17dRUGWH12jdRuYyw0bvoZoB8G-lFn0cymNe5gMkMr7fo_uafoZVHuhZB7-mHAJO3w1aUFoq404p-kh9OL_np-l-KGwpMFeFvIjYcUEybqC-lWU0_xrYM0rWASesVeNthtoTDg9XCl_YcYQUWDt5AejOo/media?maxWidthPx=800&key=' + (process.env.GOOGLE_MAPS_API_KEY || ''),
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
    imageUrl: 'https://places.googleapis.com/v1/places/ChIJQ6MVplUZ2jERn1LmNH0DlDA/photos/AWn5SU65KsKuEjAkL-uNmanqfQ5I_ZaDDMnJe101j0845yps4wHWcf7brI7Qc-qWwTqkxxQopR1fye-QArpjvEP9AqlnXqIYo80bGFf8FVTlb2lP1eLe8pQ7mqjqmssNWWyZlnsuMTDpSLa16OB5kZz8SX1ohKWU7t2FMaoCHfHppPUIwF7rscKdNhFwcsNnvxDN0DCHSW7WNSKMcAYQwcKD8IVPWzjgpt0EOXtFR7ii_KJGmmwhZk1AvlbcpiIFtyZB9GZabun_5XkH5GipI6BRH9R35eeeqctTx2iM8pieeqRBi2__BdsdVaH3gHrX85Qaq7h0Wzamx6kOg2CuP_Mab7EmDFkUYxPVLnhzJmYq_hPnS0PuObxdm1xA12ACMNCrHXMhSAx74AAx0k3pYpFqLPIng1UZXREB9Uuluor0bKfFc80U/media?maxWidthPx=800&key=' + (process.env.GOOGLE_MAPS_API_KEY || ''),
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
    imageUrl: 'https://places.googleapis.com/v1/places/ChIJzVHFNqkZ2jERboLN2YrltH8/photos/AWn5SU66zfS9GITE5njPKTUUWHDmXD9gCKf1NRbmOaYUFTgG74q_wFXhBmYwgJY7vbDjlaYNRWR6UsmZ4DpHCs4rnSrmw_kb-EDDEzjaoqhCa4FXo6tceXlBpGak-RLPIwnVzJv9pvwwyGEbE_ju28pxpjqF5G-a3kB73b8jJ2-vbDvrQ1K1E3uLKXw9BeHhnGpNN1y11Wbth1kkxDZA1926iEkLeOVvf21tFy6FlrOidL8KNncTBchPFrrkRXSw2jIjceqYHpgoSUckC7_1wtzKn10WIEeVYvyNYqYzDfeOw844_JW9diJEvkEp7d77RnrJJHouCV0YlSHLfrb1sWKMuc-hVZiQIj7Mm7nXTl7RrPwXUWNV_FjDbrDLaUD0pDgTfV_i8pjCMoeDouBRns_d2eyxPdM0OFSoMeriWHBGIl-04Hz7/media?maxWidthPx=800&key=' + (process.env.GOOGLE_MAPS_API_KEY || ''),
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
    imageUrl: 'https://places.googleapis.com/v1/places/ChIJ9xUuiNcT2jER49FS2OpE8W8/photos/AWn5SU7K4Ajogf4-oTx78zdA2XyPrkVE7eLfM6msVpIlUEi1WWJmtTpaGJltf30n4fhZzBmbBE_ew86dDaXKVNYscyAeMzNSI13wu4xyzpw8LiTosGPt0VC4VgDlY-B1_8iw23L62GQqoiptzVaM6Ck4HrgHXEC68UpwvZ8eZUeR226frMkPoP5LRo6S4NL03sspt24NEmhffHs2CtUmbvAlt2VzBKryXgeYbZPE4Adt2Ore26-ozZ-yTK7ceXM9bgCjhHKG4BZtdyGicPKiGckChOwyMInWA8DxTUGIpA3jPoYb_XorNScAoY2ete_zNFR1SeohMDVIKnoXP_f7Uc2i1ckHwxYBLsVbyKb11R-9c1N9KIBDfa_kHBdUaWt5UI6cyqyE3m-HoZjcNozH4XpQpZCFPw7MGQ0gHkdoH6FLZ7h97iA/media?maxWidthPx=800&key=' + (process.env.GOOGLE_MAPS_API_KEY || ''),
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
    imageUrl: 'https://places.googleapis.com/v1/places/ChIJj-3Cq_0b2jERJv2MBkSVsPQ/photos/AWn5SU7P1aPHpVRM4fgNYBeTqdvXrrtCqI8psngpIbYBqEOySxDcKMXU3yTaYz50HI4WUQIAdPdjwqsqKiSZvCdroJoaurTVTf9A28j0hf-aB6PdbHlrOKGKhmlKS9p2velhhhb1OebJnomzKFKtBEh9QdXAwDrOz-D1SJ7dNwmi8asQvRDnXYBQjhyp8R_B4XfeijSuN1ad7Nx12eQrZVHdTdkWDtKi5AVVFSKpjt5eihY5SBq5GbC2883inYfIs-g3pv4yyEW8JQ9_2d0ZIjeJeEmGYpSi11DYM0Mr8-dwTOwYUP6AP-cN58x_RTPbh2ThMPxHeULHVHKkG1x1v0zfNGHGAJ_mhKFJmHjWKac_WrC-_kxLjCffHMDjKe_ANd-fwzXT_QKgGg7ERo7xo2Xv8sErUqfm7Z7-vreNYQjWxA0/media?maxWidthPx=800&key=' + (process.env.GOOGLE_MAPS_API_KEY || ''),
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
    imageUrl: 'https://places.googleapis.com/v1/places/ChIJS0Dhxf0b2jERAuG9YaPrYjA/photos/AWn5SU6HmmeegXe34ltAC4ZzcucWs_kpdoZGCJrTa95TRmO-GtsvvbHUmk4Ygh7x7eaSNMLyRyfCR3IEtgTsC9gTC9z2ySVJQXqKtaPV3xNiq6cL6OjVUH6VG1OdkM3tglTSNIQb9jfr2R5y82u6ART26herRULAE70x92JeHJaRmiLGhgGBoDRsDlSWG0CeWcPLYhy4DueBj-EECf1g8jCkxRv9_NnlObff4TK_9ESZY0uXjYs7KIiSyq5q_OG8u_ORfzrD7K0BG9NQcQNyaFtYtViCoVjOynPfWV8QYMEaQ6OueJa-aaVrSZJliIFrz81HsRp09yTLswMLFJH-keY4s3-F3Ri37ep0KM397g0gzkhxoJhjLKwsNQMYMujH9hVZ5y3W-Ur0DFPmD6sJSH9wOu-rwxMYXyEiom1SIuhHFk7xS-WiNlK6Uu_WbcdZPN1-/media?maxWidthPx=800&key=' + (process.env.GOOGLE_MAPS_API_KEY || ''),
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
    imageUrl: 'https://places.googleapis.com/v1/places/ChIJseQsTQ0Z2jERqpBTWF0Zf84/photos/AWn5SU796Nl6Z1jXZYYLyqFaA4AvsnTh90IAPSOiRtXNW35J2wgIqIY9sIyDNr9se_dfdneXtupP94ifqGNoVCViZSIP1sINCyo4WhULHx6iDUxNyz5_4hb-pGBYzT6wKKc_2_KihN9YhWDEn_72m-8wSzOzLIX2jnhZ3pK3HDwJu3xaIc3wJmumVODcZF0qmIx2DzZ8yUFawjh3RucSQ3HEPIy90KJgupKbONr35buCb1l5I3l-6jUYYVb-DzSvmn7ZIo0XHroZTg3cZ0iKbmKJN0UyM47lJsi5ONIr7Oem6Ldzniert8BWcoOTZrEGAC5WaR6MnVf2sP93agVi4SIf-oJQ4DABA2qG4hZsF_vXGTZcJnvFt1YVhU9Qj7cgGkdAf-B7leq5Zwih--829JRjgvYk_hrJ1YEIqqH-CV6gczRTbQ/media?maxWidthPx=800&key=' + (process.env.GOOGLE_MAPS_API_KEY || ''),
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
    imageUrl: 'https://places.googleapis.com/v1/places/ChIJ5Y6l4Q0Z2jERYL0KDIjT6v0/photos/AWn5SU5VFdnLv8npm4xLWtjm26mxL1tqLMH6SI9PNW_4QlSrBcW9bmrY4Tu63FLrMcu-67GZ8fgKv4zh2hkeOpD2Pwk70kMSNFmx9r-M3M3SiYWXDlnoce-4TkovHtGLRaS6_g0-UFjtQqmVUN5cQRQTfwiqb7yMxl2aZ4fiUv7LhH1w1rKM4XhnmAsKr9ECH_qIo48BoQcW5dITJde7HbWQ3PVtBS7KaM2qTuuxAfw1mW3Jh1H4B3WCaEQN96dLHcjj6TaEykyQPaS8apeeU-JuVNIRcdqbQmsJnEty-jLAJGmsdzGpyCUdvf5Uisu6nmtLSG5M5DOPZBS8O4yW-YI61usBspqhGyZ8jacsV3TuZRFT_bCmu1UZcNAcwdGoewrveHlWwJ-sY1EZUSBkh-B_kAd0rbMxCLqE8XXPGWUbHfdredky/media?maxWidthPx=800&key=' + (process.env.GOOGLE_MAPS_API_KEY || ''),
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
    imageUrl: 'https://places.googleapis.com/v1/places/ChIJbVJtrEAY2jERMdmtbkpOMDU/photos/AWn5SU6jU3FHPIJfOunryMXZuJVOBMiyFDADeceHNHJwWHpDXCgub1nkL5W2eX9Uoww9BC7GD5WGju7KY44U1aXAhP7pLqq_dnx3tKvovU3K8vBTPhRCGrYTnvfuOggty6ScNsX0MHegh1Svwg5fBB9i9MYZpR9v7f56amu4FuC8eS_Fl2iltzSRKHE_9FIc6_YQCGBnXKlXXVcPhFKarW2iqajTz2--8waNJxPaL6_QnCCYDzwjIOl2WR-hpm9RYLaiA6Jp4WhOq9-43wHoAdV2RaAnJa_xeyO9kYsNyjti8gJQ-1UMSTSrUpsS_joX_VsL7qCBCUxsD342U_xKFaLwHPAUz_4TgZOpopW4iBZVGt0I6Hw4ZEVT-hr8UHcnkU_DNrjwxGCvYRk37zqXNapRz40XSczc_ujpnZINGFHAd38/media?maxWidthPx=800&key=' + (process.env.GOOGLE_MAPS_API_KEY || ''),
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
    imageUrl: 'https://places.googleapis.com/v1/places/ChIJe4wL_OsZ2jERySoDk6jlhNQ/photos/AWn5SU4wRv_C8VMJikeaomllX4HUpBltnJClwdxaRQeEv_IbMZjmr8kbPnN-WXr6ARCKYDT9RREmk4JdLHmRJ85nyMpDWO3_wi3zWnW8ARKqART0pTU8lV8MSrWa8SENSPN1YMHoE7UvVx3BeHXfsLpkWcs18ZcOFujyXPIxmY_XnW5t4KC39yP6SQIj_oXwgTymzQlFgWqc76s7hbrmoynWxS4ytXIz36OlonNzoqu-_4NgfxEhe8st8qkQ6PoyVfFg4qR4s0c1HhOxrEIaxM2wVDHth-FjupjaUrX2o3M7Nzq6iQ/media?maxWidthPx=800&key=' + (process.env.GOOGLE_MAPS_API_KEY || ''),
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
    imageUrl: 'https://places.googleapis.com/v1/places/ChIJOU6y-HkZ2jERchOICIgjl0E/photos/AWn5SU4te1e8iQvj4bNdM3YxLyaKiLA1Ahgg7b1ydAgWabGjLSSRhllVouihsysI-yfuAy0xdE5cEA4RSohxZY4tKu-Qi_j9yyAh2ktbu2v5ew0jq9_z-2pYRxhL3Kw9G5T06TmfJMJdW2MuqvObxfAM6DV_ObEQveNDnZOZdb8mRYgTCE8Rb1QAzbUwZLFXxYKW324Htb03ceFyazIaITFmFZ2rEW--O0GVEbgRfL8AGGoV5SD_Imf9TYLdJCqf5kAykXcGMqYoVbt2Rj9AfhBDbQQVNfpS6dJ_1PEJwwQHDkIWOdF1uzo09r3FGDNQwndgo50n705kcje556h5J7U98iAT53CJzNn_0oXzZMTjjfa8h9ICG8nHSScNe2mq4rMNN_gTv0wPF6wstuH_4v-q5rllGuwJVXK0k5eujzyiMlNi7g/media?maxWidthPx=800&key=' + (process.env.GOOGLE_MAPS_API_KEY || ''),
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
    imageUrl: 'https://places.googleapis.com/v1/places/ChIJQ0ge3fEZ2jER3M6bSkGnWec/photos/AWn5SU6_FS0e4Iw-DzXM4t08yfPlhlvE-4N8FFVeQ_TSpb4sljkG4cKwqBzFj38GMxXDWJP2xMtSBYQCsw7Lo-j2CsYLciPh4ZnV5cGd9Ni_YPI-L6CxFQtG0wvXd-_tCvUwQhvS-u5TGFmW8qeNi3Lw3a6qPGLgNUJyvowEni3_hPjFTjl-0GyXb6rZQnoaCppEmNMA4uahdVYA5MkkbSsOJ6AyGyHONaSPhu2BWdOUhGWeCJ0N5aQciz7yLmWCIcGEQLy8xhv6OxGstLlQrofZJPFQhDe0keAiho58iFnl-zDX0miHIznteIWnQCi3ffTSlXHIaCl5HM5lZosj-VI2Xrme7My4QSGiyoqmu2ZG8nPZRL9lgZ4OWBDfTuolyMrFPsHE8Kq_jpHBmd_EDNmo9KxLku-kHPzrXXc_dj_ktwf4u19R/media?maxWidthPx=800&key=' + (process.env.GOOGLE_MAPS_API_KEY || ''),
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
    imageUrl: 'https://places.googleapis.com/v1/places/ChIJD1u-EaMZ2jERaLhNfFkR45I/photos/AWn5SU5Ik4A16grmfF98ObZ917cyBK9BtbOdrSdlaS9epE757FvzFGY909wLMZ76HRohujK2tLQc5AUgk6cNEioYsvKi9nUM2k3aXN1YEnnS8Jz6hdTqUd9aRgJcJqcQSunbkFqd2kAtNUUCgD_5yKgH6faCxffFB3hVilTj-XPCAIj3GrMMCGyHN3IMVFUZxVjccmoDcH1X9rD8R8hMCA_ZIna4lm2yyhVYGjxkMYpJg-KXsrpAjCvzrhSgRX8cYRvqdQG-WhtQeWNRDtoZklZumcbXKIkzxgkTI3kAX9IMTLbQJy4rdUTUlyk4zj8RDcpg2koO58JKrRi6ebdv0-xSpuV3pZKa9Qm2Fg5swF-7w1cm-eOWS-_ucBfCouYu7uaGm2FMYX2VmD7OjySFcFqIh74pgYV7F_ohNT8ebskTUhqgEEf4/media?maxWidthPx=800&key=' + (process.env.GOOGLE_MAPS_API_KEY || ''),
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
    imageUrl: 'https://places.googleapis.com/v1/places/ChIJdXkrRKIZ2jERL3OFhRYeSp4/photos/AWn5SU7Bw6hxz3tcVXh9GztEhUXJ2gZUl5E70j8ENzM80NLTQMX8eHaLKw-XTSyuRLF7WbNOejxq9PH3OVCSg7TKDYUIoTDpQkf_K90-X3bWOb0_VqKxzEjXNPM6uj1iuevRomb4GSJHwMgATgEsEF18JWZ70kjTM5taiHPZLZ7FHDdxJ40uERKeCNMaGRzk8FwvvU1pGLDJyAgStEbXatoJfrDaDinT6ksOL4l99XlFS2Lj5Y939Y7XpyFtWnAltnfzTZ9Nf4JIUMymbNkZqODYVt0L2Cif_Da-btgvNWCIgOFI7w/media?maxWidthPx=800&key=' + (process.env.GOOGLE_MAPS_API_KEY || ''),
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
    imageUrl: 'https://places.googleapis.com/v1/places/ChIJ3eg6SXMZ2jERCxutt4adUyY/photos/AWn5SU7HiXiYnCdaI8Comgrl7AKUxfpW1o0CrsWS07eA4r03dLHTDVd1lglzgncTQAZsyzIdhAvT5kJtARUIFkBaKOk31iJjtqL1etOpo80g-nc5mgZimuKRUaxIbZNjeLOXpYxJRbBdEftgkoX6-0I73M3rRexJ9Ii1c39MrKLepblMxJBap0vUhffx536ULIwB9mWAyEbSVtGwONe_K4SvQr2AuczWT5uqOHdpVY9O5sKDqUQT-BqwHKZXM4jsAL6xFKZN5MvHmyX6SgBhJItFrycRrHNb4DpIszORGqqzPDMweQ/media?maxWidthPx=800&key=' + (process.env.GOOGLE_MAPS_API_KEY || ''),
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
    imageUrl: 'https://places.googleapis.com/v1/places/ChIJoZOhmQkZ2jERehLfvKlsoCA/photos/AWn5SU4yfWZo7Z7XVJnvQ9IZX_Wy7yJqIf_8gKdWVXfsMjX8Ock7yOUrnvT0Cn9nsk_hTWE6T5kBEgWqMHL3YnhCvr3fJX-MR2AeNmL5w2K4ncwU1e9O4it2IDVR0vHXcYNtpK7aCm8CiVVcav_yTDyvegORlLB6ny74F0mcOM0aWCIL0MEkvc3w-fxnkO7koGMmUC5Ty_GtLvzJ4wNsuGWKWHKkil3RUoSiW4k0HvOH9rxsad6eDq1GjNx4N--ry10Vz4b54PklXD1lfj4I9rw0FAfA0tiCvd7MLwG9yt59-50UuHbxlFcaTbtaWFXrC2MqCVvloJv04chay5LgaG_56QJpT_wCzj7KnMlR0ERknmuh1R3mVc1ZDRb6nMHfZNinAcSvHNl0FmQ7jRudhyZL5TdJzBS-Ga3BVMgKdCGY_G5u_xWVKiIzfvOsrM4cdOuq/media?maxWidthPx=800&key=' + (process.env.GOOGLE_MAPS_API_KEY || ''),
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
    imageUrl: 'https://places.googleapis.com/v1/places/ChIJ9e68CQ0Z2jER4G80iFVcJgo/photos/AWn5SU6FjfutEdTE5VVuXeS-X7TsIZA1z0V_f0nMnefB_YbBXgu5MU-4SkuWylYmfZRLVhpPTPg3PuekE2wZ9NPmCCgFr_mFlOcfOzrHHrq97JrH_v1pGQXYOq2AnRLEXfK-CjlSgnaFlX8-EhTQo1PuX8yRr3iCld7UfGnlhYXL5W6WSo_Q8uhtHE6uAgQFikTRMkaQy-SdC_uqPrdCoNY4r0O-3sTzjXiiiEaZk-LUVXvQEZUc8FiBakT-lKtlWOGEPfXi6lW1NsKcb6ycIM-2bBgN8pci5nKR8jOUfkw8ZOdOvsQW3Ko-MfKSQoMVWwUcvdKI7LF2TjH1r3CIytTHLLPz_mGVywr1ZC6vg30fCKs29rgrmwpWZpZ_DGJwTS7BtapZUhSD320JGX6s4GsU2vmLf5uXpRncHypPGSyewl4mkA/media?maxWidthPx=800&key=' + (process.env.GOOGLE_MAPS_API_KEY || ''),
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
    imageUrl: 'https://places.googleapis.com/v1/places/ChIJvWDbfRwa2jERgNnTOpAU3-o/photos/AWn5SU7l9eaATroa-KmrXYbwbo7ScoKTGjiD7-EsGkN11E2zrm0o8djNRKpmxqzdwx3811b3_CXWoiuSpkoDPncqr9Y4zaq6DiRePGN-N9RjPfCost1DVnQWyV-UZFODoTGewgUT-DPH4LUrS04AUFl21dJ2VcBSbGULduy-ZyEJSiM12Rs8tgF1lPMz1FLXDmbK2d7WEivcwz6OdgcLN92teeaBqVkdHkFji-eijuNvM_w0E_a0paD1yAlO0ubIeUz5tklxhAgbS4bIxIWsYC4G6HGOjXadjQW5GVUJA6yWloa2rd9XrS3O4SvS2YJawOH2vcodzTz177t75pqpBrWCEVW3Gh8ezWYTOMqoiXMReOJvZEkIluIIvikUwtNVGzTZ2wA7HGsQWTcJAmfRhFJdrO7JMY5jO4hdaY75M2Uf9F0J-1JW/media?maxWidthPx=800&key=' + (process.env.GOOGLE_MAPS_API_KEY || ''),
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
    imageUrl: 'https://places.googleapis.com/v1/places/ChIJO1VVxd8b2jERTvL6uurcNWY/photos/AWn5SU4g5TSTRwGPWj4aHZcLWS2zK3QJiw28rsNDv1F9nJlD2qTaPrWIELKxMJVSXAL4dVr7XUnem9mEOlVf2HyfZE0_hGNrwxGX6lvqrj9ud15Zb_De7Mxsbr1R1xAP-tHK87p69sxTijGP-QDqyx8sUOeswXOZKCvpWQI0ISb0_lCcsn4jqMTQ1uW-WQJ35if5HjBSI9RmXlZ7FskDcqzT47wJf9MCc8pprTJ46jUgMor873jh3q97Tnp06SBWE7lWmv_Fzn1j5XO1xxEnMzKhHbIuk9t_pfZDfecDEcE8Etcr6aD24rum_oJH2oKgNqBrZ-RWQX7cfSXFlNPEGEK1fXaLReTewuunw3HlJSBkDRc-RdPfVNF1SFIRpfo-ewQbB2hvv0zRgWxEIYzgEl_5H2aoz6PSj8VTlAAXrGNN9x5OmA/media?maxWidthPx=800&key=' + (process.env.GOOGLE_MAPS_API_KEY || ''),
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
    imageUrl: 'https://places.googleapis.com/v1/places/ChIJr3wRuKUZ2jER6s2v4lk2y8o/photos/AWn5SU63RRhRGbuLbEDnyXLzUef5QUStGKn0HwTDeqVCFuXvM7elgJ5kVOCjbzUBfReDHroTzqnQx6nGXVfiFmHh0tFfal0k1O8XzBGRb31TGpWLW7unU7yixtwd1o56DH5txqNp0873dCHSOJ3Msw-SSboYI8uiZwmMV-jYqi6RBaEYexiCKWgI9pr1og8t1ZBsK8lvWjYZGDsR0_NyBopGYHm8_C3urjQBpSuvkSFpX90WJ-GsOO0m90DN3c3RAlrNPHxZPNC1HK0y6qoEbZygbImOAu8XcBwgF284S7WvemCDVw/media?maxWidthPx=800&key=' + (process.env.GOOGLE_MAPS_API_KEY || ''),
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
    imageUrl: 'https://places.googleapis.com/v1/places/ChIJbUjtT6cZ2jERJOB8kHFKljI/photos/AWn5SU6D0X2ryYeCK_8iniVO-3YSqeonD4Mmn0IlRBcPIVM1-_1QZBVp0ue8AaA9DxT2AZ2xRY2dihDV6jmNUM6CDYE98KBdyX3HABu-csy5AfbpRxdXlxGgqDBmZP25aWId2WPeAhIiGz8jxPFawiZNv7g3rmRTepOHpROZKpZ2qU96kf20DiY2teR4d734eZZRGDVBlRs8oucvgemIBue2dTtJq8i15G7G-W3_BC_nd54kANT1FGAYymZvh7K4shjYezYlt7BSNIAniBxzhvDWvc1QZLt6YESQtUGPzxyzMKowUw/media?maxWidthPx=800&key=' + (process.env.GOOGLE_MAPS_API_KEY || ''), // Generic fine dining
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
    imageUrl: 'https://places.googleapis.com/v1/places/ChIJycr4ZrAZ2jERk1LS3rkqgho/photos/AWn5SU4bnWcJb3i8hCJ9OoEzgnUUR0mcDNbrRlIg-TdH7RJIhPlYzPwyhrGQR4zOHiTxbfaCNCSzOK0VVUQdoo3o0afhXdMKDAMuVrRsSbAC-Sw9d7EKxNKRSjbHe4cXqIsY22cV9jgCx0JBiRM49alY1vj36d9lkoPpcRxL3llivuI0WvYw4NBbNBrOr_5BV_GwopvQlEMRxzTr_hnk9jVukGfJpMtvc2OaAqj6AliTll1EvpBO7vqOB9lCbxph_9IHaUCMPsLe7l7FsBnXCxttSYnzUmjYW0pt7KHj9OfJdBxEtphCHHQ59ocXLuvkNFxCqzNwuL0bIBhIoXP_nM5LLmvvDm_BMQfQ8uqhVS1D3e-8uJ9FjjDyYiFndRGBVdGpZ488YOv_pnTSGVbQ_4lufDsysTFNUu3U9JlaRR0FGlMsasDgTyUAsDTc6edeNPmv/media?maxWidthPx=800&key=' + (process.env.GOOGLE_MAPS_API_KEY || ''), // Bar vibe
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
    imageUrl: 'https://places.googleapis.com/v1/places/ChIJu1Ef88sb2jER3Fc3W0QRoq8/photos/AWn5SU7ux6_oi51ewuCUvNeK_KY_lMb-FF4lyf8W-5nac9kFTkToxQEprtlP9ANvo2yZqKZQYNqVMP_2CjznV212-SVYTgdyh5HTbpNmpXCk9mGEc9QwmLcB-fFDM4vv1R5kuYEwqH2aviHvRAtdyUmf62FRGmXY5t0weictSXO1-A44DuDapQ3F9m73ZO1xANn16bkCr9spX2EMd4yY-MVgTglFXA-wXEJ95X18UkCuI7jHrL54iwTe2ojQCdjg6CbVKpnKFyd4HLD1QJDKE_KFq62be2CceP7I_df4rpGZ47Iomg/media?maxWidthPx=800&key=' + (process.env.GOOGLE_MAPS_API_KEY || ''), // Asian food
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
    imageUrl: 'https://places.googleapis.com/v1/places/ChIJmTXpQAQZ2jERZmXslyMqczQ/photos/AWn5SU7GEH3rWHGknLpSHEbi9XDcv2s1u7gfOC-SWkMJx5S0dyJIo6s2j6fSw_Spq8rcKlVLQ0vSmc5vJqA7qOpI-IOYDDVHh0gaeNQGy0zbcW2_XvjsEe3Ru5Q92iCbLoAIJhE1XNbrgOMZqm7sZN_5ZMYCjfnXmy3pfE8wwEZTQ7AiNOT2V_3E8WEEw5S3XHq00gGEGLqqOOgMZdzBXeSc0DoWdU2EL0VmI6-EsJO6Vsby8lEJKoNSgqupg7lBlS2gaL-mkw7v353MnnNh6BrS6GM4oTydYYCNAcbb3iu178yKsA/media?maxWidthPx=800&key=' + (process.env.GOOGLE_MAPS_API_KEY || ''), // Rooftop
    priceRange: '$$$$',
    tips: 'Great spot for a drink if you want the view without paying for the observation deck.'
  }
];
