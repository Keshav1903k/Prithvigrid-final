import bcrypt from 'bcryptjs';
import { connectDB, isMongoDBConnected } from './config/db.js';
import { User } from './models/User.js';
import { Project } from './models/Project.js';
import { Blog } from './models/Blog.js';
import { Service } from './models/Service.js';
import { Testimonial } from './models/Testimonial.js';
import { Inquiry } from './models/Inquiry.js';
import { getStore, persistStore, initializeFileStore } from './config/store.js';

export const seedData = async () => {
  console.log('[Seed] Initializing seed data...');
  const salt = await bcrypt.genSalt(10);
  const adminPasswordHash = await bcrypt.hash('Admin@12345', salt);

  const defaultAdmin = {
    name: 'PrithviGrid Admin',
    email: 'admin@prithvigrid.com',
    password: adminPasswordHash,
    role: 'admin',
  };

  const initialProjects = [
    {
      id: 1,
      title: 'Noida Sector 62 Glasshouse',
      titleItalic: 'Glasshouse',
      category: 'Architecture',
      heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80',
      gallery1: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
      gallery2: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
      location: 'Noida, Uttar Pradesh',
      year: '2023',
      materials: 'Reinforced Concrete, Low-E Glass, Structural Steel',
      overviewTitle: 'A landmark architectural study in structural glass integration and modern Vastu layout design.',
      overviewP1: 'Situated in the premium residential hub of Sector 62, Noida, this project was designed to balance high natural illumination with effective heat mitigation. The site conditions required customized cooling systems and durable materials resistant to northern plains weathering.',
      overviewP2: 'We utilized structural steel framing alongside high-performance double-glazed glass units. The internal spaces incorporate Vastu-compliant layouts with a continuous visual flow to the landscape gardens outside.',
      span: 'col-span-1 md:col-span-2',
      nextId: 2,
      nextTitle: 'Bangalore Whitefield Heritage',
      nextTitleItalic: 'Heritage',
      featured: true,
    },
    {
      id: 2,
      title: 'Bangalore Whitefield Heritage',
      titleItalic: 'Heritage',
      category: 'Residential',
      heroImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80',
      gallery1: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
      gallery2: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
      location: 'Bangalore, Karnataka',
      year: '2022',
      materials: 'Granite Plinths, Teak Wood, Engineered Earth Blockwork',
      overviewTitle: 'A sprawling multi-level villa designed to merge classical Karnataka elements with modern engineering.',
      overviewP1: 'Located in Bangalore\'s IT hub of Whitefield, this duplex estate was commissioned by a family wanting open-sky courtyards and deep shaded verandas. The design incorporates natural ventilation paths to optimize cooling.',
      overviewP2: 'Sustainably sourced granite and reclaimed local teak establish enduring tactile quality, paired with a precision-engineered rainwater harvesting system and zero-waste wastewater treatment on-site.',
      span: 'col-span-1',
      nextId: 3,
      nextTitle: 'Gurgaon Phase 5 Duplex',
      nextTitleItalic: 'Duplex',
      featured: true,
    },
    {
      id: 3,
      title: 'Gurgaon Phase 5 Duplex',
      titleItalic: 'Duplex',
      category: 'Renovations',
      heroImage: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
      gallery1: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
      gallery2: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
      location: 'Gurgaon, Haryana',
      year: '2023',
      materials: 'Brushed Brass, Acoustic Paneling, Micro-Cement Finishes',
      overviewTitle: 'Complete structural overhaul converting a 20-year-old masonry floor into an open-plan contemporary residence.',
      overviewP1: 'The challenge was reinforcing load-bearing columns to eliminate partition walls while maintaining code-compliant seismic performance.',
      overviewP2: 'The result is seamless spatial fluidity, concealed acoustic absorption, and smart ambient lighting integrated into floating soffits.',
      span: 'col-span-1',
      nextId: 4,
      nextTitle: 'Gachibowli Tech Hub',
      nextTitleItalic: 'Tech Hub',
      featured: false,
    },
    {
      id: 4,
      title: 'Gachibowli Tech Hub',
      titleItalic: 'Tech Hub',
      category: 'Commercial',
      heroImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
      gallery1: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
      gallery2: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
      location: 'Hyderabad, Telangana',
      year: '2023',
      materials: 'Post-Tensioned Slabs, Solar Glazing, Composite Cladding',
      overviewTitle: 'High-density, energy-efficient corporate campus with IGBC Platinum standards.',
      overviewP1: 'Engineered for scalability, daylight harvesting, and 40% reduction in HVAC energy footprint.',
      overviewP2: 'Completed two months ahead of schedule with zero safety incidents across 450,000 work hours.',
      span: 'col-span-1 md:col-span-2',
      nextId: 5,
      nextTitle: 'Pune Baner Retreat',
      nextTitleItalic: 'Retreat',
      featured: true,
    },
    {
      id: 5,
      title: 'Pune Baner Retreat',
      titleItalic: 'Retreat',
      category: 'Architecture',
      heroImage: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
      gallery1: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
      gallery2: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
      location: 'Pune, Maharashtra',
      year: '2024',
      materials: 'Basalt Stone, Corten Steel, Exposed Concrete',
      overviewTitle: 'Cliffside modern sanctuary capturing breezes and panoramic Western Ghats horizons.',
      overviewP1: 'Cantilevered decks and earth-bermed structures integrate into the hillside topography with minimal excavation.',
      overviewP2: 'Features an infinity rainwater swimming pool with biological filtration and natural cooling chimney vents.',
      span: 'col-span-1',
      nextId: 6,
      nextTitle: 'Mumbai Bandra Penthouse',
      nextTitleItalic: 'Penthouse',
      featured: false,
    },
    {
      id: 6,
      title: 'Mumbai Bandra Penthouse',
      titleItalic: 'Penthouse',
      category: 'Renovations',
      heroImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
      gallery1: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
      gallery2: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
      location: 'Mumbai, Maharashtra',
      year: '2024',
      materials: 'Italian Statuario Marble, Marine-Grade Stainless Steel, Smart Tint Glass',
      overviewTitle: 'Oceanfront rooftop luxury duplex renovation with sound-isolated structural flooring.',
      overviewP1: 'Marine environment challenges addressed with anti-corrosive coatings and wind-load reinforced balustrades.',
      overviewP2: 'Integrated bespoke private lift, sauna, and panoramic Arabian Sea entertainment deck.',
      span: 'col-span-1 md:col-span-2',
      nextId: 1,
      nextTitle: 'Noida Sector 62 Glasshouse',
      nextTitleItalic: 'Glasshouse',
      featured: true,
    },
  ];

  const initialBlogs = [
    {
      id: 1,
      title: 'The Poetry of Light in Modern Architecture',
      cat: 'Design',
      date: 'Oct 24, 2024',
      image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
      desc: 'Exploring how natural illumination shapes spatial awareness, textures, and the atmosphere within custom masonry structures.',
      content: 'Natural lighting in architectural design is far more than a utility—it dictates the emotional resonance and sensory cadence of every room. In our recent residential projects across northern and western India, we explore double-height glazed openings paired with strategically oriented vertical louvers that tame harsh mid-day sun while allowing gentle morning illumination to bathe key living zones.',
      featured: true,
      author: 'Ar. Rajesh Verma',
    },
    {
      id: 2,
      title: 'Honest Materials: The Soul of Concrete',
      cat: 'Craftsmanship',
      date: 'Oct 12, 2024',
      image: '/concrete_pouring.png',
      desc: 'Understanding the raw beauty and longevity of hand-poured architectural concrete and its role in modern minimalism.',
      content: 'Exposed reinforced concrete represents one of the most honest construction finishes available. When poured with precision formwork, it requires zero plaster or cosmetic paint—letting the aggregate texture and form ties celebrate structural integrity.',
      featured: false,
      author: 'Er. Sunita Iyer, Lead Structural Auditor',
    },
    {
      id: 3,
      title: 'Sustainable Luxury in Coastal Builds',
      cat: 'Sustainability',
      date: 'Sept 28, 2024',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
      desc: 'How contemporary construction techniques combine eco-friendly materials with architectural grandeur by the ocean.',
      content: 'Coastal climates demand strict attention to chloride ingress, humidity corrosion, and extreme wind load vectors. Through post-tensioned slabs and low-carbon geo-polymer cements, sustainable luxury is not just an aspiration—it is an engineering discipline.',
      featured: false,
      author: 'PrithviGrid Technical Board',
    },
  ];

  const initialServices = [
    {
      id: 1,
      title: 'Residential Construction',
      desc: 'From architectural planning to structural handover, we construct custom modern houses, villas, and independent floors tailored to your lifestyle and Vastu requirements.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
      features: ['Turnkey Execution', '10-Year Structural Warranty', 'Daily Digital Site Tracking', 'Escrow Milestone Payments'],
      order: 1,
    },
    {
      id: 2,
      title: 'Quality & Structural Audits',
      desc: 'Certified QA engineers conduct intensive inspections spanning foundation casting, slab reinforcement, brick alignment, plumbing pressure, and finish aesthetics.',
      image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
      features: ['310+ QA Gate Checks', 'Curing & Slump Testing', 'Rebar Cover Validation', 'Digital Audit Reports'],
      order: 2,
    },
    {
      id: 3,
      title: '3D Architecture & Design',
      desc: 'Create spatial layouts with Vastu compliance, detailed 2D/3D elevations, structural blueprints, and complete interior space mapping before breaking ground.',
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
      features: ['Vastu Compliant Layouts', 'Photorealistic 3D Walkthroughs', 'Structural Engineering Blueprints', 'MEP Design'],
      order: 3,
    },
    {
      id: 4,
      title: 'Commercial Construction',
      desc: 'Turnkey solutions for retail outlets, office workspace blocks, clinics, and light warehouses built with optimized materials and strict timeline adherence.',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
      features: ['Strict Timeline SLA', 'Pre-engineered Buildings (PEB)', 'Zero-Overrun Guarantee', 'Corporate Fitouts'],
      order: 4,
    },
  ];

  const initialTestimonials = [
    {
      id: 1,
      name: 'The Sharma Family',
      location: 'Whitefield, Bangalore',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
      quote: 'Building our dream villa with PrithviGrid was an absolute pleasure. Their milestone-based escrow system meant zero risk for us, and the structural quality exceeded all expectations.',
      projectNumber: 1,
      totalProjects: 5,
    },
    {
      id: 2,
      name: 'Vikram & Ananya Malhotra',
      location: 'Sector 62, Noida',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
      quote: 'The 310+ quality check reports gave us complete peace of mind while living abroad. Every beam, column, and finish was verified before releasing funds.',
      projectNumber: 2,
      totalProjects: 5,
    },
  ];

  const initialInquiries = [
    {
      from_name: 'Aditya Kapoor',
      from_email: 'aditya.kapoor@example.com',
      project_type: 'Residential Construction',
      phone: '+91 98112 34567',
      location: 'DLF Phase 5, Gurgaon',
      budget: '₹1.5 - 2 Cr',
      message: 'Looking to construct a 4-bedroom contemporary duplex villa with solar roofing and Vastu-compliant layout.',
      status: 'new',
      notes: 'Requested site visit on coming Saturday.',
    },
    {
      from_name: 'Pooja Deshmukh',
      from_email: 'pooja.d@example.com',
      project_type: 'Architecture & Design',
      phone: '+91 97654 32109',
      location: 'Baner, Pune',
      budget: '₹80 Lakhs - 1 Cr',
      message: 'Need 3D elevations and complete structural architectural drawings for our 3000 sq ft plot in Baner.',
      status: 'contacted',
      notes: 'Initial intro call completed; sending service brochure and rate card.',
    },
  ];

  if (isMongoDBConnected()) {
    // Seed Mongo
    const existingAdmin = await User.findOne({ email: defaultAdmin.email });
    if (!existingAdmin) {
      await User.create(defaultAdmin);
      console.log(`[Seed] Created default admin: ${defaultAdmin.email}`);
    }

    if ((await Project.countDocuments()) === 0) {
      await Project.insertMany(initialProjects);
      console.log(`[Seed] Seeded ${initialProjects.length} projects in MongoDB.`);
    }

    if ((await Blog.countDocuments()) === 0) {
      await Blog.insertMany(initialBlogs);
      console.log(`[Seed] Seeded ${initialBlogs.length} blog articles in MongoDB.`);
    }

    if ((await Service.countDocuments()) === 0) {
      await Service.insertMany(initialServices);
      console.log(`[Seed] Seeded ${initialServices.length} services in MongoDB.`);
    }

    if ((await Testimonial.countDocuments()) === 0) {
      await Testimonial.insertMany(initialTestimonials);
      console.log(`[Seed] Seeded ${initialTestimonials.length} testimonials in MongoDB.`);
    }

    if ((await Inquiry.countDocuments()) === 0) {
      await Inquiry.insertMany(initialInquiries);
      console.log(`[Seed] Seeded sample inquiries in MongoDB.`);
    }
  } else {
    // Seed local file store
    await initializeFileStore();
    const store = getStore();

    if (!store.users.some((u: any) => u.email === defaultAdmin.email)) {
      store.users.push({
        _id: 'user_admin_default',
        ...defaultAdmin,
        createdAt: new Date().toISOString(),
      });
      console.log(`[Seed] Created default admin in local store: ${defaultAdmin.email}`);
    }

    if (store.projects.length === 0) {
      store.projects = initialProjects.map((p, idx) => ({ _id: `proj_${idx + 1}`, ...p }));
      console.log(`[Seed] Seeded ${initialProjects.length} projects in local store.`);
    }

    if (store.blogs.length === 0) {
      store.blogs = initialBlogs.map((b, idx) => ({ _id: `blog_${idx + 1}`, ...b }));
      console.log(`[Seed] Seeded ${initialBlogs.length} blogs in local store.`);
    }

    if (store.services.length === 0) {
      store.services = initialServices.map((s, idx) => ({ _id: `srv_${idx + 1}`, ...s }));
      console.log(`[Seed] Seeded ${initialServices.length} services in local store.`);
    }

    if (store.testimonials.length === 0) {
      store.testimonials = initialTestimonials.map((t, idx) => ({ _id: `test_${idx + 1}`, ...t }));
      console.log(`[Seed] Seeded ${initialTestimonials.length} testimonials in local store.`);
    }

    if (store.inquiries.length === 0) {
      store.inquiries = initialInquiries.map((inq, idx) => ({
        _id: `inq_${idx + 1}`,
        ...inq,
        createdAt: new Date(Date.now() - idx * 3600000 * 24).toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      console.log(`[Seed] Seeded sample inquiries in local store.`);
    }

    await persistStore();
  }

  console.log('[Seed] Seeding completed successfully!');
};

// If run directly via tsx src/seed.ts
if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`) {
  connectDB().then(() => {
    seedData().then(() => {
      console.log('[Seed] Done. Exiting.');
      process.exit(0);
    });
  });
}

