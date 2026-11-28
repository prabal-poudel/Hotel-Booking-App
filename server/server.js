require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// add this for images publicity
app.use('/uploads', express.static('uploads'));

// multer for handling file/image uploads
const upload = multer ({dest: 'uploads/'});

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET;
const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT || 3000;

// Check environment variables
if (!JWT_SECRET || !MONGO_URL) {
    throw new Error('Missing JWT_SECRET or MONGO_URL in .env');
}

// JWT verification middleware 
// JWT VERIFICATION MIDDLEWARE
const verifytoken = (req, res, next) => {

    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            message: 'Access denied. No token provided.'
        });
    }

    try {
        const verified = jwt.verify(token, JWT_SECRET);

        req.user = verified;

        next();

    } catch (err) {
        res.status(403).json({
            message: "Invalid or expired token"
        });
    }
};

// Connect to MongoDB
mongoose.connect(MONGO_URL)
    .then(() => {
        console.log("Connected to the database");
    })
    .catch(error => {
        console.error("Database connection error:", error.message);
    });

const propertyInfoschema = new mongoose.Schema ({
    name: String,
    location: String,
    price: Number,
    photos: [String], //photo haru ko url/paths haru
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
});
const Property = mongoose.model('property', propertyInfoschema);

// User Schema
const userschema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }, 
    role: {
        type: String,
        enum: ['client', 'owner'],
        default: 'client'
    }
});

const user = mongoose.model("user", userschema);

// Booking model
const bookingschema = new mongoose.Schema({
    user:       { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    property:   { type: mongoose.Schema.Types.ObjectId, ref: 'property', required: true },
    checkIn:    { type: Date, required: true },
    checkOut:   { type: Date, required: true },
    nights:     { type: Number, required: true },
    totalPrice: { type: Number, required: true },
}, { timestamps: true } ); 

const Booking = mongoose.model('booking', bookingschema);

// post route for new property 
app.post('/api/properties', verifytoken, upload.array('photos', 5), async (req, res) => {
    try {
        const { name, location, price } = req.body;
        const photoPaths = req.files.map(file => file.path);

        const newProperty = new Property({
        name,
        location,
        price,
        photos: photoPaths,
        owner: req.user.userId,
        });

        await newProperty.save();
        res.status(201).json({ message: 'Property saved successfully!', property: newProperty });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// hotel created by the login owner 
app.get('/api/properties/mine', verifytoken, async (req, res) => {
    try {
        const properties = await Property.find({ owner: req.user.userId })
            .sort({ _id: -1 });
        res.json(properties);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// get route to fetch all properties 
app.get('/api/properties', async (req, res) => {
    try {
        const properties = await Property.find();
        res.json(properties);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

// route to get one property by its id
app.get('/api/properties/:id', async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ message: 'property not found' });
        }
        res.json(property);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// REGISTER ROUTE
app.post('/api/auth/register', async (req, res) => {
    try {
        const { fullname, email, password, role } = req.body;

        if (!fullname || !email || !password) {
            return res.status(400).json({
                message: "fullname, Email and password are required"
            });
        }

        // Check existing user
        const existingUser = await user.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User is already registered"
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        // Save user
        const newUser = new user({
            fullname,
            email,
            password: hashedPass,
            role
        });

        await newUser.save();

        res.status(201).json({
            message: "User registered successfully!"
        });

    } catch (err) {
        res.status(500).json({
            message: "Server error",
            error: err.message
        });
    }
});

// LOGIN ROUTE
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Find user
        const existingUser = await user.findOne({ email });

        if (!existingUser) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        // Compare password
        const ismatch = await bcrypt.compare(
            password,
            existingUser.password
        );

        if (!ismatch) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: existingUser._id },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Send response
        res.json({
            message: "Logged in successfully",
            token,
            user: {
                id: existingUser._id,
                email: existingUser.email,
                role: existingUser.role 
            }
        });

    } catch (err) {
        res.status(500).json({
            message: "Server error",
            error: err.message
        });
    }
});

// bookings made on the owner's hotels
app.get('/api/bookings/owner', verifytoken, async (req, res) => {
    try {
        const myProperties = await Property.find({ owner: req.user.userId }).select('_id');
        const ids = myProperties.map(p => p._id);

        const bookings = await Booking.find({ property: { $in: ids } })
            .populate('user', 'fullname email')        
            .populate('property', 'name location')
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// now creating booking
// CREATE BOOKING
app.post('/api/bookings', verifytoken, async (req, res) => {
    try {
        const { propertyId, checkIn, checkOut } = req.body;

        const inDate = new Date(checkIn);     
        const outDate = new Date(checkOut);

        if (isNaN(inDate) || isNaN(outDate) || outDate <= inDate) {
            return res.status(400).json({ message: 'Check-out must be after check-in' });
        }

        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        const nights = Math.round((outDate - inDate) / (1000 * 60 * 60 * 24));
        const totalPrice = nights * property.price;
        // block overlapping bookings for the same hotel
        const clash = await Booking.findOne({
            property: propertyId,
            checkIn: { $lt: outDate },
            checkOut: { $gt: inDate },
        });
        if (clash) {
            return res.status(409).json({ message: 'This hotel is already booked for those dates.' });
        }

        const booking = await Booking.create({
            user: req.user.userId,
            property: propertyId,
            checkIn: inDate,
            checkOut: outDate,
            nights,
            totalPrice,
        });

        res.status(201).json({ message: 'Booking confirmed!', booking });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// my trips (Booking made by the login user)
app.get('/api/bookings/my', verifytoken, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.userId })
            .populate('property')       // replaces the id with the full hotel data
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// delete a booking (guest who made it OR owner of that hotel)
app.delete('/api/bookings/:id', verifytoken, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('property', 'owner');   // we need the hotel's owner

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        const isGuest = booking.user.toString() === req.user.userId;
        const isOwner =
            booking.property?.owner &&
            booking.property.owner.toString() === req.user.userId;

        if (!isGuest && !isOwner) {
            return res.status(403).json({ message: 'Not allowed to delete this booking' });
        }

        await booking.deleteOne();
        res.json({ message: 'Booking deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PROTECTED PROFILE ROUTE
app.get('/api/user/profile', verifytoken, async (req, res) => {
    try {

        const existingUser = await user.findById(req.user.userId)
            .select('-password');

        if (!existingUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            message: 'Access granted to protected route!',
            user: existingUser
        });

    } catch (err) {
        res.status(500).json({
            message: 'Server error'
        });
    }
});

app.get('/', (req, res) => {
    res.send("Hotel Booking API is running");
});

// START SERVER
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;