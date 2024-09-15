require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000; // Use the port provided by Heroku or default to 3000

app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB Atlas using environment variable
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((error) => console.log('Error connecting to MongoDB:', error));

// Afforestation Schema
const AfforestationSchema = new mongoose.Schema({
  treeType: String,
  areaSize: Number, // in hectares
  duration: Number,  // in years
  co2Reduction: [Number], // yearly CO2 sequestration
  years: [Number]
});

const Afforestation = mongoose.model('Afforestation', AfforestationSchema);

// API routes
app.post('/api/calculate', async (req, res) => {
  const { treeType, areaSize, duration } = req.body;
  
  // CO2 Sequestration calculation logic (dummy data for illustration)
  let co2Reduction = [];
  let years = [];
  for (let i = 1; i <= duration; i++) {
    co2Reduction.push(areaSize * i * 0.5); // simple formula: modify as needed
    years.push(i);
  }

  const newScenario = new Afforestation({
    treeType,
    areaSize,
    duration,
    co2Reduction,
    years
  });
  
  await newScenario.save();
  
  res.json(newScenario);
});

app.get('/api/afforestation', async (req, res) => {
  const data = await Afforestation.find();
  res.json(data);
});

// Serve static files from React's build directory (if deploying together)
app.use(express.static(path.join(__dirname, 'build')));

// Serve React's index.html for all routes (except API routes)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
