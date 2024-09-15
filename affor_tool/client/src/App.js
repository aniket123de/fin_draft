import React, { useState, useEffect } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import './styles.css';
import ChartComponent from './ChartComponent';


// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

const App = () => {
  const [data, setData] = useState({ co2Reduction: [], years: [], treeTypes: [] });
  const [scenario, setScenario] = useState({
    treeType: 'Pine',
    areaSize: 1000,
    duration: 10
  });
  const [co2Emissions, setCo2Emissions] = useState(0);
  const [suggestion, setSuggestion] = useState(null);
  const [costs, setCosts] = useState({
    landAcquisition: 0,
    planting: 0,
    maintenance: 0,
    total: 0
  });

  useEffect(() => {
    axios.get('http://localhost:5000/api/afforestation')
      .then(response => {
        // Extract and ensure data arrays
        const co2Reduction = Array.isArray(response.data.co2Reduction) ? response.data.co2Reduction : [];
        const years = Array.isArray(response.data.years) ? response.data.years : [];
        const treeTypes = response.data.map(item => item.treeType); // Extract tree types

        setData({
          co2Reduction,
          years,
          treeTypes
        });
      })
      .catch(error => {
        console.error("Error fetching afforestation data:", error);
      });
  }, []);

  const handleScenarioChange = (e) => {
    const { name, value } = e.target;
    setScenario({ ...scenario, [name]: value });
  };

  const calculateCO2Sequestration = () => {
    axios.post('http://localhost:5000/api/calculate', scenario)
      .then(response => {
        // Ensure new data is an object with arrays
        const newCo2Reduction = Array.isArray(response.data.co2Reduction) ? response.data.co2Reduction : [];
        const newYears = Array.isArray(response.data.years) ? response.data.years : [];
        const newTreeTypes = [scenario.treeType]; // Add new tree type

        setData(prevData => ({
          co2Reduction: [...prevData.co2Reduction, ...newCo2Reduction],
          years: [...prevData.years, ...newYears],
          treeTypes: [...prevData.treeTypes, ...newTreeTypes] // Update tree types
        }));
      })
      .catch(error => {
        console.error("Error calculating CO2 sequestration:", error);
      });
  };

  const calculateAfforestationNeeded = () => {
    const requiredArea = (co2Emissions / 1000); // Adjust the formula as needed
    setSuggestion(`Approximate area needed: ${requiredArea.toFixed(2)} hectares`);
    
    // Example cost calculation
    const landAcquisitionCost = requiredArea * 10000; // Cost per hectare
    const plantingCost = requiredArea * 500; // Cost per hectare
    const maintenanceCost = requiredArea * 200; // Cost per hectare
    const totalCost = landAcquisitionCost + plantingCost + maintenanceCost;
    
    setCosts({
      landAcquisition: landAcquisitionCost,
      planting: plantingCost,
      maintenance: maintenanceCost,
      total: totalCost
    });
  };

  const resetData = () => {
    setData({ co2Reduction: [], years: [], treeTypes: [] });
    setScenario({
      treeType: 'Pine',
      areaSize: 1000,
      duration: 10
    });
    setCo2Emissions(0);
    setSuggestion(null);
    setCosts({
      landAcquisition: 0,
      planting: 0,
      maintenance: 0,
      total: 0
    });
  };

  return (
    <div className="dashboard-container">
      <div className="side-panel">
        <h3>Afforestation Scenario</h3>
        
        <label>Tree Type</label>
        <select name="treeType" value={scenario.treeType} onChange={handleScenarioChange}>
          <option value="Pine">Pine</option>
          <option value="Oak">Oak</option>
          <option value="Bamboo">Bamboo</option>
        </select>

        <label>Area Size (hectares)</label>
        <input type="number" name="areaSize" value={scenario.areaSize} onChange={handleScenarioChange} />

        <label>Project Duration (years)</label>
        <input type="number" name="duration" value={scenario.duration} onChange={handleScenarioChange} />

        <button onClick={calculateCO2Sequestration} className="btn">Calculate</button>
        
        <h4>CO2 Emission Rate(tons)</h4>
        <input type="number" value={co2Emissions} onChange={(e) => setCo2Emissions(e.target.value)} />
        <button onClick={calculateAfforestationNeeded} className="btn">Calculate Afforestation Needed</button>
        
        {suggestion && <p className="suggestion">{suggestion}</p>}
        
        <button onClick={resetData} className="btn btn-reset">Reset Data</button>
      </div>
      
      <div className="charts-container">
        <div className="chart">
          <h4>CO2 Sequestration Over Time</h4>
          <Line
            data={{
              labels: data.years || [],
              datasets: [
                {
                  label: 'CO2 Reduction (tons)',
                  data: data.co2Reduction || [],
                  fill: false,
                  borderColor: '#4CAF50',
                  tension: 0.1
                }
              ]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                tooltip: {
                  callbacks: {
                    label: (context) => `${context.dataset.label}: ${context.raw} tons`
                  }
                }
              }
            }}
          />
        </div>
        <div className="chart">
          <h4>CO2 Reduction Distribution</h4>
          <Bar
            data={{
              labels: data.years || [],
              datasets: [
                {
                  label: 'CO2 Reduction (tons)',
                  data: data.co2Reduction || [],
                  backgroundColor: '#FFC107',
                  borderColor: '#FFC107',
                  borderWidth: 1
                }
              ]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                tooltip: {
                  callbacks: {
                    label: (context) => `${context.dataset.label}: ${context.raw} tons`
                  }
                }
              }
            }}
          />
        </div>
        <div className="chart">
          <h4>Tree Types Distribution</h4>
          <Pie
            data={{
              labels: [...new Set(data.treeTypes)] || [], // Ensure unique labels
              datasets: [
                {
                  label: 'Tree Types',
                  data: data.treeTypes.map(type => data.treeTypes.filter(t => t === type).length) || [], // Count occurrences of each type
                  backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                }
              ]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: true, // Ensures chart maintains its aspect ratio
              plugins: {
                legend: {
                  position: 'top',
                },
                tooltip: {
                  callbacks: {
                    label: (context) => `${context.label}: ${context.raw}`
                  }
                }
              }
            }}
          />
        </div>
      </div>

      <div className="cost-estimator">
        <h4>Cost Estimator</h4>
        <table>
          <thead>
            <tr>
              <th>Cost Type</th>
              <th>Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Land Acquisition</td>
              <td>₹{costs.landAcquisition.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Planting</td>
              <td>₹{costs.planting.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Maintenance</td>
              <td>₹{costs.maintenance.toFixed(2)}</td>
            </tr>
            <tr>
              <td><strong>Total Cost</strong></td>
              <td><strong>₹{costs.total.toFixed(2)}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
