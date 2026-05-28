import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('🌱 Seeding demo data...');

  // Settings
  await prisma.settings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      dealerName: 'AUTO',
      tagline: 'Drive the Extraordinary',
      address: '142 Motorway Boulevard, London, UK',
      phone: '+44 20 7946 0200',
      email: 'sales@auto-dealership.com',
      mondayFridayHours: '09:00 – 18:30',
      saturdayHours: '10:00 – 17:00',
      sundayHours: 'By Appointment',
      currency: 'EUR',
      distanceUnit: 'km',
    },
  });

  // Cars
  const cars = [
    {
      make: 'Porsche', model: '911 Carrera S', year: 2023, price: 142000,
      mileage: 4200, category: 'Sports', status: 'available',
      color: 'GT Silver Metallic', engine: '3.0L Twin-Turbo Flat-6 (450 hp)',
      transmission: '8-Speed PDK', acceleration: '3.5s 0–100 km/h',
      topSpeed: '308 km/h', weight: '1,515 kg',
      badge: 'Featured',
      description: 'One-owner, full Porsche service history. Sport Chrono Package, PASM, 20/21" Carrera S wheels. Ceramic coating applied 2024.',
      image: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=800&q=80',
    },
    {
      make: 'BMW', model: 'M3 Competition', year: 2024, price: 98500,
      mileage: 1800, category: 'Saloon', status: 'available',
      color: 'Brooklyn Grey Metallic', engine: '3.0L Twin-Turbo S58 (510 hp)',
      transmission: '8-Speed M Steptronic', acceleration: '3.5s 0–100 km/h',
      topSpeed: '290 km/h', weight: '1,730 kg',
      badge: 'New Arrival',
      description: 'Nearly new. M Carbon exterior package, M Driver\'s Package, Harman Kardon audio. Full dealer PDI completed.',
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
    },
    {
      make: 'Mercedes-Benz', model: 'AMG GT 63 S', year: 2022, price: 168000,
      mileage: 9700, category: 'Grand Tourer', status: 'available',
      color: 'Obsidian Black Metallic', engine: '4.0L Biturbo V8 (639 hp)',
      transmission: '9-Speed AMG Speedshift MCT', acceleration: '3.2s 0–100 km/h',
      topSpeed: '315 km/h', weight: '2,045 kg',
      badge: 'Hot Deal',
      description: 'AMG Performance seats, carbon fibre trim, Burmester 3D surround sound. Panoramic roof. Last service at 8,000 km.',
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80',
    },
    {
      make: 'Audi', model: 'RS6 Avant', year: 2023, price: 132000,
      mileage: 6100, category: 'Estate', status: 'available',
      color: 'Nardo Grey', engine: '4.0L Twin-Turbo V8 TFSI (600 hp)',
      transmission: '8-Speed Tiptronic', acceleration: '3.6s 0–100 km/h',
      topSpeed: '305 km/h', weight: '2,075 kg',
      badge: null,
      description: 'Audi Sport exhaust, Dynamic Ride Control, Carbon Optic package. Full Audi history. The ultimate family performance machine.',
      image: 'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?w=800&q=80',
    },
    {
      make: 'Range Rover', model: 'Sport SVR', year: 2022, price: 121000,
      mileage: 14500, category: 'SUV', status: 'available',
      color: 'Santorini Black', engine: '5.0L Supercharged V8 (575 hp)',
      transmission: '8-Speed Automatic', acceleration: '4.5s 0–100 km/h',
      topSpeed: '280 km/h', weight: '2,365 kg',
      badge: null,
      description: 'Carbon fibre bonnet vents, SVR carbon pack. Meridian signature sound. Full Land Rover service history.',
      image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80',
    },
    {
      make: 'Ferrari', model: 'Roma', year: 2021, price: 218000,
      mileage: 7200, category: 'Grand Tourer', status: 'available',
      color: 'Rosso Portofino', engine: '3.9L Twin-Turbo V8 (620 hp)',
      transmission: '8-Speed DCT', acceleration: '3.4s 0–100 km/h',
      topSpeed: '320 km/h', weight: '1,472 kg',
      badge: 'Featured',
      description: 'Ferrari Approved Certified. Daytona seats, carbon steering wheel, JBL Professional audio. One private owner from new.',
      image: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=800&q=80',
    },
    {
      make: 'Lamborghini', model: 'Urus S', year: 2023, price: 289000,
      mileage: 2900, category: 'SUV', status: 'available',
      color: 'Verde Mantis', engine: '4.0L Twin-Turbo V8 (666 hp)',
      transmission: '8-Speed Automatic', acceleration: '3.5s 0–100 km/h',
      topSpeed: '305 km/h', weight: '2,150 kg',
      badge: 'New Arrival',
      description: 'Carbon ceramic brakes, full Alcantara interior, panoramic roof. Authorized Lamborghini dealer trade-in.',
      image: 'https://images.unsplash.com/photo-1638618164682-12b986ec2a75?w=800&q=80',
    },
    {
      make: 'Tesla', model: 'Model S Plaid', year: 2024, price: 109000,
      mileage: 3300, category: 'Saloon', status: 'available',
      color: 'Midnight Silver Metallic', engine: 'Tri-Motor Electric (1,020 hp)',
      transmission: 'Single-Speed', acceleration: '1.99s 0–100 km/h',
      topSpeed: '322 km/h', weight: '2,162 kg',
      badge: null,
      description: 'Yoke steering, 21" Arachnid wheels, FSD capability included. 637 km rated range. Nearly new condition.',
      image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80',
    },
  ];

  for (const car of cars) {
    await prisma.car.create({ data: car });
  }

  // Services
  const services = [
    {
      icon: '🔧',
      name: 'Full Service & MOT',
      description: 'Comprehensive inspection, fluid changes, filter replacement, and roadworthiness certification.',
      price: 'From £399',
      active: true,
    },
    {
      icon: '✨',
      name: 'Premium Detailing',
      description: 'Full paint decontamination, ceramic coating, interior deep-clean, and glass treatment.',
      price: 'From £699',
      active: true,
    },
    {
      icon: '🛡️',
      name: 'Paint Protection Film',
      description: 'Self-healing PPF applied to full front-end or whole vehicle. 10-year warranty.',
      price: 'From £1,200',
      active: true,
    },
    {
      icon: '💳',
      name: 'Finance & Leasing',
      description: 'Tailored PCP, HP, and lease packages with same-day decisions. Rates from 5.9% APR.',
      price: 'Get a quote',
      active: true,
    },
    {
      icon: '🔄',
      name: 'Part Exchange',
      description: 'We buy any car. Guaranteed valuations valid for 7 days. Nationwide collection available.',
      price: 'Free valuation',
      active: true,
    },
    {
      icon: '🚗',
      name: 'Extended Warranty',
      description: 'Up to 3 years mechanical and electrical cover. All-inclusive roadside assistance.',
      price: 'From £299/yr',
      active: true,
    },
  ];

  for (const service of services) {
    await prisma.service.create({ data: service });
  }

  // Sample inquiries
  const inquiries = [
    {
      name: 'James Harrington', email: 'j.harrington@gmail.com', phone: '+44 7700 900142',
      subject: 'Porsche 911 Carrera S', vehicle: 'Porsche 911 Carrera S (2023)',
      message: 'Hi, I\'d like to book a test drive for the Carrera S. Available this Saturday afternoon?',
      status: 'new', pipelineStage: 'new',
    },
    {
      name: 'Sophie Laurent', email: 'sophie.l@outlook.com', phone: '+33 6 12 34 56 78',
      subject: 'Finance enquiry — BMW M3', vehicle: 'BMW M3 Competition (2024)',
      message: 'Can you send me PCP options for the M3? Looking at 36 months, £15k deposit.',
      status: 'replied', pipelineStage: 'negotiate',
    },
    {
      name: 'Marco Bianchi', email: 'marco.bianchi@yahoo.com', phone: null,
      subject: 'Ferrari Roma — interested', vehicle: 'Ferrari Roma (2021)',
      message: 'Is the Roma still available? What is the best price you can do?',
      status: 'new', pipelineStage: 'new',
    },
    {
      name: 'Anna Kowalski', email: 'anna.k@proton.me', phone: '+48 500 123 456',
      subject: 'Trade-in + Urus S', vehicle: 'Lamborghini Urus S (2023)',
      message: 'I have a 2021 Porsche Cayenne to part-ex. Can you value it alongside the Urus?',
      status: 'replied', pipelineStage: 'test_drive',
    },
  ];

  for (const inquiry of inquiries) {
    await prisma.inquiry.create({ data: inquiry });
  }

  console.log(`✅ Demo seed complete — ${cars.length} cars, ${services.length} services, ${inquiries.length} inquiries.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
