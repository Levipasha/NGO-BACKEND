require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Models
const { 
  Program, GalleryItem, Event, Product, BlogPost, 
  ContactConfig, HomeConfig, Message, Registration, 
  Donation, Order, Newsletter, Member, AboutConfig 
} = require('./models');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/masterbrush';

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Database Connection
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB database successfully.');
    try {
      await Member.updateMany(
        { $or: [{ email: { $exists: false } }, { role: /Founder/i }, { role: /Instructor/i }, { role: /Counselor/i }, { role: /Mentor/i }] }, 
        { $set: { isApproved: true } }
      );
    } catch (e) {
      console.error('Member auto-approval migration notice:', e);
    }
  })
  .catch(err => console.error('MongoDB database connection error:', err));

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer in-memory storage config
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware to check Admin Authentication
const authenticateAdmin = (req, res, next) => {
  const token = req.headers['authorization'];
  if (token === `Bearer ${process.env.JWT_SECRET || 'admin-token-secret-123'}`) {
    next();
  } else {
    res.status(401).json({ success: false, message: 'Unauthorized access. Invalid credentials.' });
  }
};

// ==========================================
// PUBLIC GET APIS FOR CLIENT PAGES
// ==========================================

// Get Programs list
app.get('/api/programs', async (req, res) => {
  try {
    const list = await Program.find({});
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get Members list
app.get('/api/members', async (req, res) => {
  try {
    const list = await Member.find({});
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get About Us Config
app.get('/api/about', async (req, res) => {
  try {
    let config = await AboutConfig.findOne({});
    if (!config) {
      config = await AboutConfig.create({
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
    }
    res.json({ success: true, data: config });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get Gallery list
app.get('/api/gallery', async (req, res) => {
  try {
    const list = await GalleryItem.find({});
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get Events list
app.get('/api/events', async (req, res) => {
  try {
    const list = await Event.find({});
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get Shop Products list
app.get('/api/shop', async (req, res) => {
  try {
    const list = await Product.find({});
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get Blog posts list
app.get('/api/blog', async (req, res) => {
  try {
    const list = await BlogPost.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get Contact config details
app.get('/api/contact', async (req, res) => {
  try {
    const config = await ContactConfig.findOne({});
    res.json({ success: true, data: config });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get Home config details
app.get('/api/home', async (req, res) => {
  try {
    const config = await HomeConfig.findOne({});
    res.json({ success: true, data: config });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==========================================
// USER INTERACTIONS / PUBLIC FORM POSTS
// ==========================================

// Contact message submission
app.post('/api/contact', async (req, res) => {
  const { name, phone, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Please provide name, email, and message.' });
  }
  try {
    const newMsg = await Message.create({ name, phone, email, subject, message });
    res.json({ success: true, message: 'Message sent successfully! We will contact you soon.', id: newMsg._id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Program registration
app.post('/api/registrations', async (req, res) => {
  const { name, email, phone, ageGroup, program } = req.body;
  if (!name || !email || !phone || !program) {
    return res.status(400).json({ success: false, message: 'Please complete all required fields.' });
  }
  try {
    const reg = await Registration.create({ name, email, phone, ageGroup, program });
    res.json({ success: true, message: 'Registration submitted successfully!', id: reg._id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Donations submission
app.post('/api/donations', async (req, res) => {
  const { name, email, phone, amount, project, message, showOnWall } = req.body;
  if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
    return res.status(400).json({ success: false, message: 'Please enter a valid donation amount.' });
  }
  try {
    const don = await Donation.create({
      name: name || 'Anonymous Donor',
      email,
      phone,
      amount: parseFloat(amount),
      project,
      message,
      showOnWall: showOnWall !== undefined ? showOnWall : true
    });
    res.json({ success: true, message: 'Thank you for your donation!', donation: don });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Fetch active donor wall (Public API)
app.get('/api/donations/wall', async (req, res) => {
  try {
    const list = await Donation.find({ showOnWall: true }).sort({ date: -1 }).limit(10);
    res.json({ success: true, donors: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Shop orders placement
app.post('/api/orders', async (req, res) => {
  const { name, email, phone, address, items, total, paymentMethod } = req.body;
  if (!name || !email || !phone || !address || !items || items.length === 0 || !total) {
    return res.status(400).json({ success: false, message: 'Invalid order details. Please complete checkout.' });
  }
  try {
    const order = await Order.create({
      name, email, phone, address, items, total: parseFloat(total), paymentMethod
    });
    res.json({ success: true, message: 'Order placed successfully!', orderId: order._id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Newsletter subscription
app.post('/api/newsletter', async (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
  }
  try {
    const exists = await Newsletter.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(200).json({ success: true, message: 'You are already subscribed to our newsletter!' });
    }
    await Newsletter.create({ email: email.toLowerCase() });
    res.json({ success: true, message: 'Successfully subscribed to the MasterBrush newsletter!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==========================================
// ADMIN APIS (AUTHENTICATED)
// ==========================================

// Admin Login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  const expectedUser = process.env.ADMIN_USERNAME || 'admin';
  const expectedPass = process.env.ADMIN_PASSWORD || 'admin123';
  const secretToken = process.env.JWT_SECRET || 'admin-token-secret-123';

  if (username === expectedUser && password === expectedPass) {
    res.json({ success: true, token: secretToken, message: 'Logged in successfully' });
  } else {
    res.status(400).json({ success: false, message: 'Invalid username or password' });
  }
});

// Fetch all logs data for dashboard (Messages, Registrations, Donations, Orders, Newsletter)
app.get('/api/admin/data', authenticateAdmin, async (req, res) => {
  try {
    const messages = await Message.find({}).sort({ date: -1 });
    const registrations = await Registration.find({}).sort({ date: -1 });
    const donations = await Donation.find({}).sort({ date: -1 });
    const orders = await Order.find({}).sort({ date: -1 });
    const newsletter = await Newsletter.find({}).sort({ date: -1 });

    res.json({
      success: true,
      data: { messages, registrations, donations, orders, newsletter }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update Order Status
app.put('/api/admin/orders/:id/status', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, message: `Order status updated to ${status}`, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// File upload endpoint (to Cloudinary)
app.post('/api/admin/upload', authenticateAdmin, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded.' });
  }
  
  // Use memory buffer stream to upload to Cloudinary
  const uploadStream = cloudinary.uploader.upload_stream(
    { folder: 'masterbrush', resource_type: 'auto' },
    (error, result) => {
      if (error) {
        console.error("Cloudinary upload error:", error);
        return res.status(500).json({ success: false, message: 'Cloudinary upload failed.', error });
      }
      res.json({ success: true, url: result.secure_url });
    }
  );
  
  uploadStream.end(req.file.buffer);
});

// Program Updates
app.put('/api/admin/programs/:id', authenticateAdmin, async (req, res) => {
  try {
    const program = await Program.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!program) return res.status(404).json({ success: false, message: 'Program not found' });
    res.json({ success: true, data: program });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Gallery CRUD
app.post('/api/admin/gallery', authenticateAdmin, async (req, res) => {
  try {
    const item = await GalleryItem.create(req.body);
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/admin/gallery/:id', authenticateAdmin, async (req, res) => {
  try {
    const item = await GalleryItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ success: false, message: 'Gallery item not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/admin/gallery/:id', authenticateAdmin, async (req, res) => {
  try {
    const item = await GalleryItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Gallery item not found' });
    res.json({ success: true, message: 'Gallery item deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Events CRUD
app.post('/api/admin/events', authenticateAdmin, async (req, res) => {
  try {
    const item = await Event.create(req.body);
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/admin/events/:id', authenticateAdmin, async (req, res) => {
  try {
    const item = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/admin/events/:id', authenticateAdmin, async (req, res) => {
  try {
    const item = await Event.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Shop CRUD
app.post('/api/admin/shop', authenticateAdmin, async (req, res) => {
  try {
    const item = await Product.create(req.body);
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/admin/shop/:id', authenticateAdmin, async (req, res) => {
  try {
    const item = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/admin/shop/:id', authenticateAdmin, async (req, res) => {
  try {
    const item = await Product.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Blog CRUD
app.post('/api/admin/blog', authenticateAdmin, async (req, res) => {
  try {
    const item = await BlogPost.create(req.body);
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/admin/blog/:id', authenticateAdmin, async (req, res) => {
  try {
    const item = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ success: false, message: 'Blog post not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/admin/blog/:id', authenticateAdmin, async (req, res) => {
  try {
    const item = await BlogPost.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Blog post not found' });
    res.json({ success: true, message: 'Blog post deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Configs Updates
app.put('/api/admin/contact', authenticateAdmin, async (req, res) => {
  try {
    const item = await ContactConfig.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/admin/home', authenticateAdmin, async (req, res) => {
  try {
    const item = await HomeConfig.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/admin/about', authenticateAdmin, async (req, res) => {
  try {
    const item = await AboutConfig.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Member Registration & Self Services
app.post('/api/members/register', async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required.' });
    }

    let member = await Member.findOne({ email });
    if (member) {
      Object.assign(member, req.body);
      member.isApproved = false;
      await member.save();
      console.log('Updated registration for member:', email);
      return res.json({ success: true, message: 'Member registration updated! Submitted for Admin approval.', data: member });
    }

    member = await Member.create({
      ...req.body,
      isApproved: false,
      isFounder: false
    });
    console.log('Created new registration for member:', email);
    res.json({ success: true, message: 'Registration submitted! Awaiting Admin approval.', data: member });
  } catch (err) {
    console.error('Registration API error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/members/login-check', async (req, res) => {
  try {
    const { email } = req.body;
    const member = await Member.findOne({ email });
    if (!member) {
      return res.json({ success: true, isApproved: false, member: null });
    }
    res.json({ 
      success: true, 
      isApproved: !!member.isApproved, 
      member: member 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/admin/members/:id/approve', authenticateAdmin, async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    if (!member) return res.status(404).json({ success: false, message: 'Member not found' });
    res.json({ success: true, message: 'Member approved successfully', data: member });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/members/profile/update', async (req, res) => {
  try {
    const { email, name, info, image, highlights } = req.body;
    const member = await Member.findOneAndUpdate({ email }, { name, info, image, highlights }, { new: true });
    res.json({ success: true, message: 'Profile updated successfully', data: member });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/members/artworks/add', async (req, res) => {
  try {
    const { email, title, description, category, price, image } = req.body;
    const member = await Member.findOne({ email });
    if (!member) return res.status(404).json({ success: false, message: 'Member profile not found' });

    const newArt = {
      id: 'art_' + Date.now(),
      title,
      description,
      category: category || 'Paintings',
      price: Number(price) || 0,
      image,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    member.artworks.push(newArt);
    await member.save();

    // Also add as Product in Shop catalog so it can be purchased!
    await Product.create({
      name: title,
      category: category || 'Paintings',
      price: Number(price) || 0,
      description: `Original Artwork by ${member.name}. ${description}`,
      image
    });

    res.json({ success: true, message: 'Artwork posted to your portfolio and shop successfully!', data: member });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Member CRUD
app.post('/api/admin/members', authenticateAdmin, async (req, res) => {
  try {
    const item = await Member.create(req.body);
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/admin/members/:id', authenticateAdmin, async (req, res) => {
  try {
    const item = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ success: false, message: 'Member not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/admin/members/:id', authenticateAdmin, async (req, res) => {
  try {
    const item = await Member.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Member not found' });
    res.json({ success: true, message: 'Member deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is healthy and running.' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`MasterBrush server running on port ${PORT}`);
});
