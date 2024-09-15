require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://aniket007:8hVFUFf7knYaEE64@afforestation-cluster.5iefj.mongodb.net/?retryWrites=true&w=majority&appName=afforestation-cluster')
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

// Start server
app.listen(5000, () => {
  console.log('Server running on port 5000');
});
