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
    });
    const Property = mongoose.model('property', propertyInfoschema);

    // add this for images publicity
    app.use('/uploads', express.static('uploads'));
    // post route for new property 
    app.post('/api/properties', upload.array('photos', 5), async (req, res) => {
    try {
        const { name, location, price } = req.body;
        const photoPaths = req.files.map(file => file.path);

        const newProperty = new Property({
        name,
        location,
        price,
        photos: photoPaths,
        });

        await newProperty.save();
        res.status(201).json({ message: 'Property saved successfully!', property: newProperty });
    } catch (error) {
        res.status(500).json({ error: error.message });
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

// REGISTER ROUTE
app.post('/api/auth/register', async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

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
            password: hashedPass
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
            { expiresIn: '1h' }
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
