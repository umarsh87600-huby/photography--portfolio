export interface Artwork {
  id: string;
  title: string;
  series: string;
  category: 'Architecture' | 'Portraiture' | 'Landscape' | 'Street' | 'Fine Art';
  year: number;
  location: string;
  coordinates: string;
  camera: string;
  lens: string;
  exif: {
    focalLength: string;
    aperture: string;
    shutter: string;
    iso: string;
    metering: string;
  };
  medium: string;
  edition: string;
  dimensions: string;
  story: string;
  palette: string[];
  aspectRatio: number; // width / height
  imageSrc: string;
  // 3D positioning metadata in exhibition pavilion
  galleryPosition: [number, number, number]; // [x, y, z]
  galleryRotation: [number, number, number]; // [rx, ry, rz]
  ribbonPosition: [number, number, number];
  ribbonRotation: [number, number, number];
}

import archImg from '../assets/images/arch_monolith_1791450642660.jpg';
import portraitImg from '../assets/images/cinematic_portrait_1791450659653.jpg';
import alpineImg from '../assets/images/alpine_solitude_1791450673727.jpg';
import tokyoImg from '../assets/images/tokyo_nocturne_1791450688894.jpg';
import ceramicImg from '../assets/images/sculpture_ceramic_1791450705897.jpg';

export const PORTFOLIO_WORKS: Artwork[] = [
  {
    id: 'monolith-vii',
    title: 'MONOLITH VII — BRUTALIST ASCENT',
    series: 'Concrete & Horizon',
    category: 'Architecture',
    year: 2025,
    location: 'Vals, Graubünden, Switzerland',
    coordinates: '46.6181° N, 9.1802° E',
    camera: 'Hasselblad H6D-100c Medium Format',
    lens: 'HC 3.5/35mm',
    exif: {
      focalLength: '35mm',
      aperture: 'f/8.0',
      shutter: '1/320s',
      iso: 'ISO 64',
      metering: 'Spot Evaluative',
    },
    medium: 'Archival Pigment Print on Hahnemühle Photo Rag 308gsm',
    edition: 'Edition of 7 + 2 AP',
    dimensions: '120 × 90 cm (47.2 × 35.4 in)',
    story:
      'An exploration of raw mass, concrete grain, and fleeting alpine raking light. Carved into the mountain topography, the fluted facade captures the quiet gravity of modernist monoliths while challenging geometric perspective under late afternoon low-angle sun.',
    palette: ['#8C877E', '#45423D', '#D4CEC5', '#1E1C1B'],
    aspectRatio: 4 / 3,
    imageSrc: archImg,
    galleryPosition: [-16, 2.5, -4],
    galleryRotation: [0, 0.35, 0],
    ribbonPosition: [-18, 1.5, -8],
    ribbonRotation: [0, 0.5, 0],
  },
  {
    id: 'chiaroscuro-studio',
    title: 'STUDIO MEDITATION IN CHIAROSCURO',
    series: 'The Silent Interior',
    category: 'Portraiture',
    year: 2026,
    location: 'Belleville, Paris, France',
    coordinates: '48.8721° N, 2.3854° E',
    camera: 'Leica M11 Rangefinder',
    lens: 'Summilux-M 50mm f/1.4 ASPH',
    exif: {
      focalLength: '50mm',
      aperture: 'f/1.4',
      shutter: '1/125s',
      iso: 'ISO 200',
      metering: 'Center-Weighted Average',
    },
    medium: 'Hand-Coated Platinum-Palladium on Arches Platine',
    edition: 'Edition of 5 + 1 AP',
    dimensions: '100 × 133 cm (39.4 × 52.4 in)',
    story:
      'Captured in the unhurried north-facing daylight of an artist atelier. The frame searches for the fragile threshold between public performance and interior solitude, using natural falloff to sculpt bone structure and atmospheric depth.',
    palette: ['#B38D6B', '#3B2F28', '#14110F', '#E0CFC3'],
    aspectRatio: 3 / 4,
    imageSrc: portraitImg,
    galleryPosition: [-8, 2.5, 3],
    galleryRotation: [0, 0.15, 0],
    ribbonPosition: [-9, 3.2, 0],
    ribbonRotation: [0, 0.25, 0],
  },
  {
    id: 'serac-dawn',
    title: 'SERAC & MORAINE: DAWN OVER THE MASSIF',
    series: 'Alpine Topographies',
    category: 'Landscape',
    year: 2025,
    location: 'Mont Blanc Massif, Haute-Savoie',
    coordinates: '45.8326° N, 6.8652° E',
    camera: 'Fujifilm GFX 100 II Large Sensor',
    lens: 'GF 45-100mm f/4 R LM OIS WR',
    exif: {
      focalLength: '70mm',
      aperture: 'f/11.0',
      shutter: '1/60s',
      iso: 'ISO 100',
      metering: 'Multi-Segment Matrix',
    },
    medium: 'Direct Carbon Pigment on Canson Infinity Baryta Prestige II',
    edition: 'Edition of 10 + 2 AP',
    dimensions: '160 × 90 cm (63.0 × 35.4 in)',
    story:
      'Documented at 3,842 meters during the first 6 minutes of nautical dawn. The glacial ridge catches delicate rose and amber alpenglow while the moraine floor remains trapped beneath sub-zero thermal mist, articulating geological time versus human fragility.',
    palette: ['#D6A59B', '#48576D', '#8CA1B7', '#1A2332'],
    aspectRatio: 16 / 9,
    imageSrc: alpineImg,
    galleryPosition: [0, 2.5, -5],
    galleryRotation: [0, 0, 0],
    ribbonPosition: [0, 2.0, -6],
    ribbonRotation: [0, 0, 0],
  },
  {
    id: 'tokyo-nocturne',
    title: 'NOCTURNE IN AMBER & RAIN',
    series: 'Chromatic Solitude',
    category: 'Street',
    year: 2026,
    location: 'Shibuya, Tokyo, Japan',
    coordinates: '35.6595° N, 139.7004° E',
    camera: 'Leica Q3 Full-Frame',
    lens: 'Summilux 28mm f/1.7 ASPH Fixed',
    exif: {
      focalLength: '28mm',
      aperture: 'f/1.7',
      shutter: '1/160s',
      iso: 'ISO 800',
      metering: 'Highlight-Weighted',
    },
    medium: 'High-Gloss Acrylic Face Mount on Brushed Aluminium Dibond',
    edition: 'Edition of 8 + 2 AP',
    dimensions: '120 × 90 cm (47.2 × 35.4 in)',
    story:
      'Midnight rainfall in the narrow alleys beyond Dogenzaka. The wet asphalt acts as a fluid optical mirror for neon signage and warm paper lantern illumination, catching a solitary figure navigating the chromatic mist with an umbrella.',
    palette: ['#E28743', '#1E272E', '#E74C3C', '#0F1419'],
    aspectRatio: 4 / 3,
    imageSrc: tokyoImg,
    galleryPosition: [8, 2.5, 3],
    galleryRotation: [0, -0.15, 0],
    ribbonPosition: [9, 1.2, 1],
    ribbonRotation: [0, -0.3, 0],
  },
  {
    id: 'forms-clay-stone',
    title: 'FORMS OF CLAY AND STONE',
    series: 'Tactile Geometries',
    category: 'Fine Art',
    year: 2026,
    location: 'Higashiyama, Kyoto, Japan',
    coordinates: '35.0016° N, 135.7812° E',
    camera: 'Phase One IQ4 150MP Achromatic/Color',
    lens: 'Schneider Kreuznach 80mm LS f/2.8',
    exif: {
      focalLength: '80mm',
      aperture: 'f/5.6',
      shutter: '1/200s',
      iso: 'ISO 50',
      metering: 'Precision Spot 1°',
    },
    medium: 'Handmade Awagami Washi Kozo Paper with Deckled Edges',
    edition: 'Edition of 6 + 1 AP',
    dimensions: '110 × 82.5 cm (43.3 × 32.5 in)',
    story:
      'Hand-coiled organic ceramics placed upon split travertine stone. A quiet meditation on the gravitational weight of physical objects, natural mineral textures, and the delicate equilibrium between human handcraft and geological permanence.',
    palette: ['#C9B097', '#736353', '#E8DFD5', '#2C2621'],
    aspectRatio: 4 / 3,
    imageSrc: ceramicImg,
    galleryPosition: [16, 2.5, -4],
    galleryRotation: [0, -0.35, 0],
    ribbonPosition: [18, 3.0, -7],
    ribbonRotation: [0, -0.55, 0],
  },
];

export const ARTIST_PROFILE = {
  name: 'KAIEN VANCE',
  discipline: 'Fine Art & Spatial Architecture Photography',
  location: 'Zurich / Tokyo / Paris',
  bio: 'Kaien Vance is a visual artist and photographer investigating the perceptual boundaries of architectural space, geological quietude, and optical phenomenology. Using high-resolution medium format optics and historical carbon pigment printmaking, Vance crafts physical dialogues between light, matter, and human introspection.',
  exhibitions: [
    { year: '2026', venue: 'Fondation d’Art Moderne', city: 'Zurich', show: 'Monoliths in Silence' },
    { year: '2025', venue: 'Mori Arts Center Pavilion', city: 'Tokyo', show: 'Nocturnes & Chromatic Mist' },
    { year: '2025', venue: 'Galerie Albarrán Bourdais', city: 'Madrid', show: 'Moraine & Alpenglow' },
    { year: '2024', venue: 'Palais de Tokyo (Solo Focus)', city: 'Paris', show: 'The Tactile Void' },
  ],
  awards: [
    'Hasselblad Master Finalist — Architecture & Spatial Form (2025)',
    'Prix Pictet Shortlist — Space & Humanity (2024)',
    'Tokyo International Foto Awards — Gold in Fine Art (2023)',
  ],
  contact: {
    email: 'studio@kaienvance.photography',
    representation: 'Galerie Vandevelde (Paris) / Studio Archival Press (Zurich)',
  },
};
