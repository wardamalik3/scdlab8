const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const users = [
    { username: "user1" },
    { username: "user2" },
    { username: "user3" },
];

const events = [
    {
        name: "Meeting",
        description: "Team discussion",
        date: "2025-03-20",
        time: "10:00 AM",
        category: "Meetings",
        username: "user1",
    },
    {
        name: "Birthday Party",
        description: "John's Birthday",
        date: "2025-04-10",
        time: "7:00 PM",
        category: "Birthdays",
        username: "user2",
    },
    {
        name: "Doctor Appointment",
        description: "Dentist check-up",
        date: "2025-05-01",
        time: "9:00 AM",
        category: "Appointments",
        username: "user3",
    },
];

// Middleware: Checkinggg  if user exists
const authenticate = (req, res, next) => {
    const { username } = req.body;
    if (!username || !users.find((user) => user.username === username)) {
        return res
            .status(403)
            .json({ message: "Unauthorized. Please register first." });
    }
    req.user = { username };
    next();
};

// Registeringg  User
app.post("/register", (req, res) => {
    const { username } = req.body;
    if (users.find((user) => user.username === username)) {
        return res.status(400).json({ message: "User already exists" });
    }
    users.push({ username }); // Store only username
    res.status(201).json({ message: "User registered successfully." });
});

// Login User
app.post("/login", (req, res) => {
    const { username } = req.body;
    if (!users.find((user) => user.username === username)) {
        return res
            .status(400)
            .json({ message: "User not found. Please register." });
    }
    res.json({
        message: "Login successful. You can now create and view events.",
    });
});

// Creaing Event
app.post("/events", authenticate, (req, res) => {
    const { name, description, date, time, category } = req.body;
    if (!name || !date || !time || !category) {
        return res.status(400).json({ message: "All fields are required" });
    }
    events.push({
        name,
        description,
        date,
        time,
        category,
        username: req.user.username,
    });
    res.status(201).json({ message: "Event created successfully" });
});

// Getiing All Events for Logged-in User
app.get("/events", authenticate, (req, res) => {
    res.json(events.filter((event) => event.username === req.user.username));
});

// Get Events by Category
app.get("/events/category/:category", authenticate, (req, res) => {
    res.json(
        events.filter(
            (event) =>
                event.category === req.params.category &&
                event.username === req.user.username,
        ),
    );
});

// Get Upcoming Events Sorted by Date
app.get("/events/upcoming", authenticate, (req, res) => {
    const upcomingEvents = events
        .filter((event) => event.username === req.user.username)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    res.json(upcomingEvents);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
