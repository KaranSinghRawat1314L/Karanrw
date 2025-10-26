<<<<<<< HEAD
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path"); // Useful for resolving paths

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
mongoose
    .connect(      
        process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Failed to connect to MongoDB:", err));

// Define the User model
const User = mongoose.model(
    "User",
    new mongoose.Schema({
        name: { type: String, required: true },
        phone: { type: Number, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, default: "" },
        profilePic: { type: String, default: "" },
        address: { type: String, default: "" },
        bloodGroup: { type: String, default: "" },
        userType: { type: String, required: true },
        lastLoc: {
            type: { type: String, enum: ["Point"], default: "Point" },
            coordinates: { type: [Number], default: [0, 0] },
        },
        emergencyHistory: { type: [String], default: [] },
        medicalHistory: { type: [String], default: [] },
        emergencyContact: {
            username: { type: String, default: "" },
            phone: { type: Number, default: 0 },
        },
        locale: { type: String, default: "" },
        license: { type: Number, default: 0 },
        vehicleInfo: {
            brand: { type: String, default: "" },
            model: { type: String, default: "" },
            color: { type: String, default: "" },
            rc: { type: String, default: "" },
            insurance: { type: String, default: "" },
        },
        identificationMark: { type: String, default: "" },
        aadhaar: { type: Number, default: 0 },
        futureLoc: {
            location: { type: String, default: "" },
            time: { type: String, default: "" },
        },
        testStatus: { type: String, default: "" },
        sosType: { type: String, default: "" },
        picture: { type: String, default: "" },
        currentStatus: {
            type: String,
            enum: ["online", "offline"],
            default: "offline",
        },
    })
);

// Create the Express app
const app = express();

// Allow all CORS requests
app.use(cors());

// Middleware to log all requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Parse JSON bodies
app.use(express.json());

// Route to check if email exists in the database
app.post("/service/login", async (req, res) => {
    const { email } = req.body;

    try {
        let user = {};
        if (email) {
            user = {
                email: "user@example.com",
                password: "testpassA@1",
                servicename: "National Disaster Response Force",
                totalServiceCompleted: 250,
                serviceCompletedToday: 5,
                runningServices: {
                    count: 3,
                    names: ["Delhi", "Mumbai", "Chennai"],
                },
                pendingServices: {
                    count: 2,
                    names: ["Rajisthan", "Haryana"],
                },
            };
            res.json(user);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// Route to save user info in the database
app.post("/service/signup", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = new User({ email, password });
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// Route to read and return contents of a JSON file
app.post("/service/getx", (req, res) => {
    const filePath = path.join(__dirname, "Gemini_Posts_Good.json"); // Resolve the path to the JSON file

    // Read the file asynchronously
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return res.status(500).json({ error: "Internal server error" });
        }

        try {
            // Parse the file contents into JSON
            const jsonData = JSON.parse(data);
            res.json(jsonData); // Return the JSON data
        } catch (parseErr) {
            console.error("Error parsing JSON:", parseErr);
            res.status(500).json({ error: "Error parsing JSON" });
        }
    });
});

// Route to get SOS details with sosType not blank
app.post("/service/getsos", async (req, res) => {
    try {
        // Fetch all users with non-empty sosType
        const usersWithSOS = await User.find({ sosType: { $ne: "" } });

        if (usersWithSOS.length === 0) {
            return res.status(404).json({ error: "No SOS data found" });
        }

        res.json(usersWithSOS);
    } catch (error) {
        console.error("Error fetching SOS details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Start the server using the port from .env
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
=======
const express = require("express");
const axios = require("axios")
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require('bcrypt');
const fs = require("fs");
const path = require("path"); // Useful for resolving paths

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
mongoose
    .connect(
        process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Failed to connect to MongoDB:", err));

// Define the User model
const User = mongoose.model(
    "User",
    new mongoose.Schema({
        name: { type: String, required: true },
        phone: { type: Number, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, default: "" },
        profilePic: { type: String, default: "" },
        address: { type: String, default: "" },
        bloodGroup: { type: String, default: "" },
        userType: { type: String, required: true },
        servicename: { type: String, default: "" },
        totalServiceCompleted: { type: Number, default: 0 },
        serviceCompletedToday: { type: Number, default: 0 },
        runningServices: { count: { type: Number, default: 0 } },
        pendingServices: { count: { type: Number, default: 0 } },
        lastLoc: {
            type: { type: String, enum: ["Point"], default: "Point" },
            coordinates: { type: [Number], default: [0, 0] },
        },
        emergencyHistory: { type: [String], default: [] },
        medicalHistory: { type: [String], default: [] },
        emergencyContact: {
            username: { type: String, default: "" },
            phone: { type: Number, default: 0 },
        },
        locale: { type: String, default: "" },
        license: { type: Number, default: 0 },
        vehicleInfo: {
            brand: { type: String, default: "" },
            model: { type: String, default: "" },
            color: { type: String, default: "" },
            rc: { type: String, default: "" },
            insurance: { type: String, default: "" },
        },
        identificationMark: { type: String, default: "" },
        aadhaar: { type: Number, default: 0 },
        futureLoc: {
            location: { type: String, default: "" },
            time: { type: String, default: "" },
        },
        testStatus: { type: String, default: "" },
        sosType: { type: String, default: "" },
        picture: { type: String, default: "" },
        currentStatus: {
            type: String,
            enum: ["online", "offline"],
            default: "offline",
        },
    })
);

// Create the Express app
const app = express();

// Allow all CORS requests
app.use(cors());

// Middleware to log all requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Parse JSON bodies
app.use(express.json());

// Route to check if email exists in the database
app.post("/service/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Successful login
        const userData = {
            servicename: user.servicename || "",
            totalServiceCompleted: user.totalServiceCompleted || 0,
            serviceCompletedToday: user.serviceCompletedToday || 0,
            runningServices: user.runningServices || { count: 0 },
            pendingServices: user.pendingServices || { count: 0 },
            email: user.email,
        };

        return res.json(userData);
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Server error" });
    }
});

// Route to save user info in the database
app.post("/service/signup", async (req, res) => {
    const { name, email, password } = req.body;
    console.log("📩 Incoming signup data:", req.body);

    try {
        if (!email || !password || !name) {
            return res.status(400).json({ error: "Name, email, and password are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("⚠️ User already exists:", email);
            return res.status(400).json({ error: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            userType: "user",
            phone: Date.now(),
        });

        await user.save();
        console.log("✅ User saved successfully:", user);

        res.status(201).json({
            message: "Signup successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("❌ Signup error details:", error);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
});

// Route to read and return contents of a JSON file
app.post("/service/getx", (req, res) => {
    const filePath = path.join(__dirname, "Gemini_Posts_Good.json");

    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return res.status(500).json({ error: "Internal server error" });
        }

        try {
            const jsonData = JSON.parse(data);
            res.json(jsonData);
        } catch (parseErr) {
            console.error("Error parsing JSON:", parseErr);
            res.status(500).json({ error: "Error parsing JSON" });
        }
    });
});

// Route to get SOS details with sosType not blank
app.post("/service/getsos", async (req, res) => {
    try {
        const usersWithSOS = await User.find({ sosType: { $ne: "" } });

        if (usersWithSOS.length === 0) {
            return res.status(404).json({ error: "No SOS data found" });
        }

        res.json(usersWithSOS);
    } catch (error) {
        console.error("Error fetching SOS details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
app.post('/service/googleauth',async (req, res)=>{
    const {access_token} = req.body;
    try{
         const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      const {name , email} = response.data;
      const user = await User.findOne({email});
      if(!user){
        const phone = Date.now();
        const userType = 'user';
        user = await User.create({name, email, userType, phone});
      }
     res.status(201).json({
            message: "Signup successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    }
    catch(error){
        console.log(error);
        res.status(401).json({message:'Invalid Google Token'});
    }
});

// Start the server using the port from .env
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
>>>>>>> 906622b (googleauth addition)
