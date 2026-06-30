const mongoose = require('mongoose');

// Program Schema
const ProgramSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  difficulty: { type: String, required: true },
  description: { type: String, required: true },
  highlights: [{ type: String }],
  mediaUrl: { type: String },
  iconName: { type: String } // e.g. "Heart", "Sparkles", "Palette", "Smile", "GraduationCap"
}, { timestamps: true });

// Gallery Item Schema
const GalleryItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  size: { type: String },
  price: { type: Number },
  status: { type: String, default: 'Available' }, // Available or Sold
  date: { type: String }
}, { timestamps: true });

// Event Schema
const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  location: { type: String, required: true },
  time: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true }
}, { timestamps: true });

// Product Schema
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  rating: { type: Number, default: 5 },
  reviews: { type: Number, default: 0 },
  image: { type: String, required: true }
}, { timestamps: true });

// Blog Post Schema
const BlogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  date: { type: String, required: true },
  author: { type: String, required: true },
  readTime: { type: String, required: true },
  summary: { type: String, required: true },
  image: { type: String, required: true },
  content: { type: String, required: true }
}, { timestamps: true });

// Contact Config Schema
const ContactConfigSchema = new mongoose.Schema({
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  mapUrl: { type: String }
}, { timestamps: true });

// Home Config Schema
const HomeConfigSchema = new mongoose.Schema({
  heroTagline: { type: String, required: true },
  heroTitle: { type: String, required: true },
  heroLogo: { type: String, required: true },
  heroVideoUrl: { type: String, required: true }
}, { timestamps: true });

// User Submissions schemas
const MessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String },
  email: { type: String, required: true },
  subject: { type: String },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const RegistrationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  ageGroup: { type: String },
  program: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const DonationSchema = new mongoose.Schema({
  name: { type: String, default: 'Anonymous Donor' },
  email: { type: String },
  phone: { type: String },
  amount: { type: Number, required: true },
  project: { type: String, default: 'General Fund' },
  message: { type: String },
  showOnWall: { type: Boolean, default: true },
  date: { type: Date, default: Date.now }
});

const OrderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  items: { type: Array, required: true },
  total: { type: Number, required: true },
  paymentMethod: { type: String, default: 'Cash on Delivery' },
  status: { type: String, default: 'Pending' },
  date: { type: Date, default: Date.now }
});

const NewsletterSchema = new mongoose.Schema({
  email: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const MemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  info: { type: String, required: true },
  highlights: [{ type: String }],
  image: { type: String }
}, { timestamps: true });

const AboutConfigSchema = new mongoose.Schema({
  storyTitle: { type: String, default: 'About the Foundation' },
  storyText1: { type: String },
  storyText2: { type: String },
  storyText3: { type: String },
  storyImage: { type: String },
  visionText: { type: String },
  founderQuote: { type: String },
  founderImage: { type: String },
  statYears: { type: String, default: '10+' },
  statStudents: { type: String, default: '500+' },
  statExhibitions: { type: String, default: '50+' },
  statLives: { type: String, default: '1000+' }
}, { timestamps: true });

module.exports = {
  Program: mongoose.model('Program', ProgramSchema),
  Member: mongoose.model('Member', MemberSchema),
  AboutConfig: mongoose.model('AboutConfig', AboutConfigSchema),
  GalleryItem: mongoose.model('GalleryItem', GalleryItemSchema),
  Event: mongoose.model('Event', EventSchema),
  Product: mongoose.model('Product', ProductSchema),
  BlogPost: mongoose.model('BlogPost', BlogPostSchema),
  ContactConfig: mongoose.model('ContactConfig', ContactConfigSchema),
  HomeConfig: mongoose.model('HomeConfig', HomeConfigSchema),
  Message: mongoose.model('Message', MessageSchema),
  Registration: mongoose.model('Registration', RegistrationSchema),
  Donation: mongoose.model('Donation', DonationSchema),
  Order: mongoose.model('Order', OrderSchema),
  Newsletter: mongoose.model('Newsletter', NewsletterSchema)
};
