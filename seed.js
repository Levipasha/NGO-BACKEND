require('dotenv').config();
const mongoose = require('mongoose');
const { 
  Program, GalleryItem, Event, Product, BlogPost, 
  ContactConfig, HomeConfig, Message, Registration, 
  Donation, Order, Newsletter, Member, AboutConfig, Story
} = require('./models');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/masterbrush';

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB Atlas for seeding...");

    // 1. Members
    await Member.deleteMany({});
    await Member.insertMany([
      {
        name: 'Vishnu Kondoj',
        email: 'vishnu@masterbrush.org',
        role: 'Founder & Lead Fine Arts Instructor',
        info: 'Vishnu is a seasoned visual artist with a passion for inclusive art training. He founded MasterBrush to empower students and create a space where everyone has a right to express their creative potential.',
        highlights: ['10+ Years Experience', 'Acrylic Specialist', 'Community Art Advisor'],
        image: '/founder.jpg'
      },
      {
        name: 'Archana Patel',
        email: 'archana@masterbrush.org',
        role: 'Art Therapist & Senior Counselor',
        info: 'Archana specializes in creative expression as a healing medium. She facilitates our Art Therapy sessions, helping children, senior citizens, and differently-abled individuals manage stress and gain confidence.',
        highlights: ['Licensed Art Therapist', 'Mental Well-being Advocate', 'Inclusive Workshops Designer'],
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600'
      },
      {
        name: 'Rohan Sharma',
        email: 'rohan@masterbrush.org',
        role: 'Traditional Crafts & Pebble Art Mentor',
        info: 'Rohan teaches traditional Indian art styles and creative handicrafts, including our popular Pebble Art classes. He guides students in turning everyday items into stunning gallery-ready creations.',
        highlights: ['Craft Master', 'Pebble Art Specialist', 'Eco-friendly Materials expert'],
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600'
      }
    ]);
    console.log("Seeded Members");

    // 1b. About Config
    await AboutConfig.deleteMany({});
    await AboutConfig.create({
      storyTitle: 'About the Foundation',
      storyText1: 'MasterBrush Art Foundation is a non-profit organization dedicated to making art education accessible, inclusive, and meaningful for everyone. We believe that art is more than creativity—it is a powerful language of expression, a source of emotional healing, a means of building confidence, and a pathway to sustainable livelihoods.',
      storyText2: 'Our mission is to ensure that every individual, regardless of physical ability, financial background, age, or social circumstances, has the opportunity to discover and develop their creative potential. We work closely with underprivileged communities, people with disabilities, children, youth, and aspiring artists to create an environment where creativity knows no boundaries.',
      storyText3: 'Through education, workshops, mentorship, exhibitions, and community engagement, we empower individuals to transform their artistic talents into skills that enrich their lives and open doors to personal and professional opportunities. At MasterBrush Art Foundation, we envision a society where art is not considered a privilege but a right that inspires confidence, inclusion, innovation, and positive social change.',
      storyImage: '/about_foundation.jpg',
      visionText: 'To build an inclusive world where art is accessible to everyone, empowering underprivileged and differently-abled individuals to express themselves, develop valuable skills, achieve financial independence, and contribute creatively to society.',
      founderQuote: 'As an artist and educator, I believe art has the power to heal, inspire and transform lives. Through MasterBrush, I want to create a space where every individual — regardless of age or ability — can discover their unique voice and shine. Thank you for being a part of this beautiful journey.',
      founderImage: '/founder.jpg',
      statYears: '10+',
      statStudents: '500+',
      statExhibitions: '50+',
      statLives: '1000+'
    });
    console.log("Seeded About Config");

    // 2. Gallery Items
    await GalleryItem.deleteMany({});
    await GalleryItem.insertMany([
      {
        title: 'Peacock Pride',
        artist: 'Vishnu Kondoj',
        category: 'Acrylic Paintings',
        image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600',
        size: '18" x 24"',
        price: 6000,
        status: 'Available',
        date: 'June 2025'
      },
      {
        title: 'Sunset Serenity',
        artist: 'Vishnu Kondoj',
        category: 'Acrylic Paintings',
        image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=600',
        size: '12" x 16"',
        price: 4500,
        status: 'Available',
        date: 'June 2025'
      },
      {
        title: 'Pebble Birds',
        artist: 'Community Class',
        category: 'Pebble Art',
        image: 'https://images.unsplash.com/photo-1580136579312-94651dfd596d?q=80&w=600',
        size: '10" x 10"',
        price: 1500,
        status: 'Available',
        date: 'June 2025'
      }
    ]);
    console.log("Seeded Gallery Items");

    // 3. Events
    await Event.deleteMany({});
    await Event.insertMany([
      {
        title: 'Art Exhibition 2025',
        date: '15–18 June, 2025',
        location: 'Hyderabad Gallery',
        time: '10:00 AM - 6:00 PM',
        category: 'Exhibition',
        description: 'A grand showcase of artworks by our students — watercolor, acrylic, pebble art and more. Open for all to attend.',
        image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=600'
      },
      {
        title: 'Acrylic Workshop',
        date: '22 June, 2025',
        location: 'MasterBrush Studio',
        time: '11:00 AM - 4:00 PM',
        category: 'Workshop',
        description: 'A hands-on one-day workshop exploring acrylic painting techniques. Materials provided. Beginners welcome!',
        image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=600'
      },
      {
        title: 'Art Retreat',
        date: '5–7 July, 2025',
        location: 'Hyderabad Outskirts',
        time: 'Full Weekend',
        category: 'Retreat',
        description: 'A 3-day immersive retreat in nature. Paint, reflect, connect with fellow artists and recharge your creative spirit.',
        image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=600'
      }
    ]);
    console.log("Seeded Events");

    // 4. Products
    await Product.deleteMany({});
    await Product.insertMany([
      {
        name: 'Sunset Serenity',
        category: 'Paintings',
        price: 4500,
        description: 'A beautiful acrylic landscape depicting the peaceful setting sun on canvas.',
        rating: 5,
        reviews: 12,
        image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=600'
      },
      {
        name: 'Peacock Pride',
        category: 'Paintings',
        price: 6000,
        description: 'Vibrant depiction of a majestic peacock, acrylic on canvas.',
        rating: 5,
        reviews: 8,
        image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600'
      }
    ]);
    console.log("Seeded Products");

    // 5. Blog Posts
    await BlogPost.deleteMany({});
    await BlogPost.insertMany([
      {
        title: '5 Beginner Mistakes in Acrylic Painting (and How to Avoid Them)',
        category: 'Art Tips',
        date: '12 June 2025',
        author: 'Vishnu Kondoj',
        readTime: '5 min read',
        summary: 'Acrylic paint is versatile and forgiving — but beginners often fall into common traps that can hold them back. Here are five mistakes and what to do instead...',
        content: 'Full post contents about beginner mistakes including using too much water, cheap brushes, blending too slow, and skipping the primer.',
        image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=600'
      },
      {
        title: 'How Art Transforms Lives of Specially-Abled Artists',
        category: 'Inclusion',
        date: '5 June 2025',
        author: 'MasterBrush Team',
        readTime: '4 min read',
        summary: 'Art goes beyond decoration; it is a communication tool, a confidence builder, and a source of emotional healing. See how creative training is changing lives.',
        content: 'Full post contents about inclusion, art therapy, self-esteem, focus, and income capabilities created for specially-abled individuals.',
        image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600'
      }
    ]);
    console.log("Seeded Blog Posts");

    // 6. Contact Config
    await ContactConfig.deleteMany({});
    await ContactConfig.create({
      address: 'Plot No. 13, Sri Sai Avenue Apartment, R.K.H Colony, AS Rao Nagar, Hyderabad - 500062',
      phone: '+91 98765 43210',
      email: 'info@masterbrush.org',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3805.8947834632!2d78.55870151528!3d17.47615498806!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb9c0e2d2bffff%3A0x1234abcd5678ef90!2sAS%20Rao%20Nagar%2C%20Hyderabad%2C%20Telangana%20500062!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin'
    });
    console.log("Seeded Contact Config");

    // 7. Home Config
    await HomeConfig.deleteMany({});
    await HomeConfig.create({
      heroTagline: '✦ Empowering Creativity Since 2025',
      heroTitle: 'MasterBrush Art Foundation',
      heroLogo: '/logo.png',
      heroVideoUrl: '/about_video.mp4'
    });
    console.log("Seeded Home Config");

    // 8. Seeding Mock Transaction Logs
    await Message.deleteMany({});
    await Message.insertMany([
      {
        name: "Aarav Sharma",
        email: "aarav@gmail.com",
        phone: "+91 98123 45678",
        subject: "Weekend Class Timings",
        message: "Hi, I wanted to enquire about the weekend timings for the inclusive art classes. Do you provide painting supplies or should we bring our own?",
        date: new Date(Date.now() - 3600000 * 2)
      },
      {
        name: "Priya Patel",
        email: "priya@yahoo.com",
        phone: "+91 98234 56789",
        subject: "Art Therapy Registration",
        message: "Hello, my grandmother is interested in your art therapy sessions. Can you guide me on the registration process and fees?",
        date: new Date(Date.now() - 3600000 * 12)
      }
    ]);
    console.log("Seeded Inquiries");

    await Registration.deleteMany({});
    await Registration.insertMany([
      {
        name: "Rohan Das",
        email: "rohan@gmail.com",
        phone: "+91 98345 67890",
        ageGroup: "Youth 13-18",
        program: "Inclusive Art Classes",
        date: new Date(Date.now() - 3600000 * 4)
      },
      {
        name: "Meera Reddy",
        email: "meera@outlook.com",
        phone: "+91 98456 78901",
        ageGroup: "Adults 18+",
        program: "Art Therapy Sessions",
        date: new Date(Date.now() - 3600000 * 24)
      }
    ]);
    console.log("Seeded Registrations");

    await Donation.deleteMany({});
    await Donation.insertMany([
      {
        name: "Karan Johar",
        email: "karan@gmail.com",
        phone: "+91 98567 89012",
        amount: 15000,
        project: "Artist Support Program",
        message: "Keep up the wonderful work of supporting underprivileged artists! Art has the power to change lives.",
        showOnWall: true,
        date: new Date(Date.now() - 3600000 * 8)
      },
      {
        name: "Ananya Panday",
        email: "ananya@gmail.com",
        phone: "+91 98678 90123",
        amount: 5000,
        project: "General Fund",
        message: "Art is healing. Happy to support this beautiful cause.",
        showOnWall: true,
        date: new Date(Date.now() - 3600000 * 30)
      }
    ]);
    console.log("Seeded Donations");

    await Order.deleteMany({});
    await Order.insertMany([
      {
        name: "Siddharth Malhotra",
        email: "sid@gmail.com",
        phone: "+91 98789 01234",
        address: "Flat 402, Sea Green Apartments, Bandra, Mumbai - 400050",
        items: [{ name: "Sunset Serenity", quantity: 1, price: 4500 }],
        total: 4500,
        status: "Pending Confirmation",
        date: new Date(Date.now() - 3600000 * 5)
      },
      {
        name: "Kiara Advani",
        email: "kiara@gmail.com",
        phone: "+91 98890 12345",
        address: "12, Rose Wood Villa, Juhu, Mumbai - 400049",
        items: [{ name: "Peacock Pride", quantity: 1, price: 6000 }],
        total: 6000,
        status: "Shipped",
        date: new Date(Date.now() - 3600000 * 18)
      }
    ]);
    console.log("Seeded Shop Orders");

    await Newsletter.deleteMany({});
    await Newsletter.insertMany([
      {
        email: "subscribe1@gmail.com",
        date: new Date(Date.now() - 3600000 * 10)
      },
      {
        email: "subscribe2@yahoo.com",
        date: new Date(Date.now() - 3600000 * 48)
      }
    ]);
    console.log("Seeded Newsletter subscriptions");

    // 14. Stories of Transformation
    await Story.deleteMany({});
    await Story.insertMany([
      {
        text: "MasterBrush gave me the confidence to believe in my talent. It's more than an art class, it's a family.",
        authorName: "Ananya",
        authorRole: "Student",
        avatarInitials: "AN"
      },
      {
        text: "My son has specially-abled needs and the team made him feel so included and celebrated. His artwork is now in the gallery!",
        authorName: "Priya Reddy",
        authorRole: "Parent",
        avatarInitials: "PR"
      },
      {
        text: "Art therapy sessions at MasterBrush helped me heal. I found a new way to express emotions I couldn't put into words.",
        authorName: "Rajan Kumar",
        authorRole: "Art Therapy Participant",
        avatarInitials: "RK"
      }
    ]);
    console.log("Seeded Transformation Stories");

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedData();
