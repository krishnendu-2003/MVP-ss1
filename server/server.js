
// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import the Link model
const Link = require('./models/Link'); // Ensure this path is correct based on your project structure

const app = express();
const PORT = process.env.PORT || 5001;
const ngrokUrl = 'https://7513-2405-201-8018-60b9-b927-e114-bcaf-47b2.ngrok-free.app'; // Your Ngrok URL

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Define a basic route to verify the server is working
app.get('/', (req, res) => {
  res.send("Backend server is running!");
});

// Example link generation endpoint
app.post('/api/generate-link', async (req, res) => {
  const { email, brand } = req.body;

  // Generate a custom link
  const uniqueLink = `http://switchsocial.com/${brand}-${Date.now()}`; // Customize your link logic here

  // Save the link to the database
  try {
    const newLink = new Link({ email, brand, link: uniqueLink });
    await newLink.save();
    res.json({ link: uniqueLink });
  } catch (error) {
    console.error("Error saving link:", error);
    res.status(500).json({ error: "Failed to save the link." });
  }
});

// Click count API endpoint
app.get('/api/click/:customLink', async (req, res) => {
  const { customLink } = req.params;

  try {
    // Find the link in the database and increment the click count
    const link = await Link.findOneAndUpdate(
      { link:  `http://switchsocial.com/${customLink}`  }, // You may need to change this to match the format of the saved link
      { $inc: { clickCount: 1 } }, // Increment the click count
      { new: true } // Return the updated document
    );

    if (link) {
      res.status(200).json({ clickCount: link.clickCount }); // Respond with the updated click count
    } else {
      res.status(404).json({ error: 'Link not found' });
    }
  } catch (error) {
    console.error("Error incrementing click count", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
