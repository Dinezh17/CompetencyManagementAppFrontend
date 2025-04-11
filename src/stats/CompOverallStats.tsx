import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import api from '../interceptor/api';
import { useNavigate } from 'react-router-dom';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Data structure for competency performance
interface CompetencyPerformance {
  rank: number;
  competency_code: string;
  competency_name: string;
  description: string;
  required_score: number;
  average_score: number;
  fulfillment_rate: number;
  total_evaluations: number;
  employees_meeting_required: number;
  performance_gap: number;
}

const OverallCompetencyDashboard: React.FC = () => {
  // State for competency data
  const [competencyData, setCompetencyData] = useState<CompetencyPerformance[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate overall statistics
  const calculateOverallStats = (data: CompetencyPerformance[]) => {
    if (!data.length) return { avgScore: 0, avgFulfillment: 0, avgGap: 0 };
    
    const avgScore = data.reduce((sum, item) => sum + item.average_score, 0) / data.length;
    const avgFulfillment = data.reduce((sum, item) => sum + item.fulfillment_rate, 0) / data.length;
    const avgGap = data.reduce((sum, item) => sum + item.performance_gap, 0) / data.length;
    
    return {
      avgScore: avgScore.toFixed(2),
      avgFulfillment: avgFulfillment.toFixed(2),
      avgGap: avgGap.toFixed(2)
    };
  };

  // Fetch competency performance data
  useEffect(() => {
    const fetchCompetencyData = async () => {
      setLoading(true);
      try {
        const response = await api.get('/stats/overall-competency-performance');
        // Ensure we're getting an array from the API
        if (Array.isArray(response.data)) {
          setCompetencyData(response.data);
        } else {
          // If the API returns an object with a data property that's an array
          if (response.data && Array.isArray(response.data.data)) {
            setCompetencyData(response.data.data);
          } else {
            throw new Error('Expected an array of competency data');
          }
        }
        setError(null);
      } catch (err) {
        setError('Failed to fetch competency performance data');
        console.error('Error fetching competency data:', err);
        // Ensure competencyData is an empty array when there's an error
        setCompetencyData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCompetencyData();
  }, []);

  // Only prepare chart data if competencyData is a valid array with items
  const prepareChartData = () => {
    if (!Array.isArray(competencyData) || competencyData.length === 0) {
      return {
        scoreChartData: { labels: [], datasets: [] },
        fulfillmentChartData: { labels: [], datasets: [] }
      };
    }

    // Prepare chart data for competency scores
    const scoreChartData = {
      labels: competencyData.map(comp => comp.competency_code),
      datasets: [
        {
          label: 'Average Score',
          data: competencyData.map(comp => comp.average_score),
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
        {
          label: 'Required Score',
          data: competencyData.map(comp => comp.required_score),
          backgroundColor: 'rgba(255, 99, 132, 0.7)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        }
      ],
    };

    // Prepare chart data for fulfillment rates
    const fulfillmentChartData = {
      labels: competencyData.map(comp => comp.competency_code),
      datasets: [
        {
          label: 'Fulfillment Rate (%)',
          data: competencyData.map(comp => comp.fulfillment_rate),
          backgroundColor: 'rgba(75, 192, 192, 0.7)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        }
      ],
    };

    return { scoreChartData, fulfillmentChartData };
  };

  // Get chart data
  const { scoreChartData, fulfillmentChartData } = prepareChartData();

  // Chart options
  const scoreChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Overall Competency Scores',
        font: {
          size: 16
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max:4,
        title: {
          display: true,
          text: 'Score',
        },
      },
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
  };

  const fulfillmentChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Competency Fulfillment Rates',
        font: {
          size: 16
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Fulfillment Rate (%)',
        },
      },
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
  };

  
const buttonStyle = {
    padding: '12px 24px',
    backgroundColor: '#4f46e5', // Indigo
    color: '#ffffff',
    border: 'none',
    width: '200px',
    height: '50px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
  };
  // Get overall statistics - ensure we're passing an array
  const overallStats = calculateOverallStats(Array.isArray(competencyData) ? competencyData : []);
  const navigate = useNavigate();
  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1500px',
      margin: '0 auto',
      padding: '20px'
    }}>
    <div style={{padding:"10px", marginTop:"70px", display: 'flex',justifyContent: 'center',gap: '16px',}}>
    <button style={buttonStyle} onClick={()=>{navigate("/employee-stats-overall")}}>Overall</button>
    <button style={buttonStyle} onClick={()=>{navigate("/employee-stats-departmentwise")}}>DepartMent</button>
    
    </div>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Overall Competency Performance</h1>
      
      {error && (
        <div style={{ 
          backgroundColor: '#ffebee', 
          color: '#c62828', 
          padding: '10px', 
          borderRadius: '5px',
          marginBottom: '20px' 
        }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>Loading competency data...</p>
        </div>
      ) : Array.isArray(competencyData) && competencyData.length > 0 ? (
        <>
          {/* Overall Statistics */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '20px',
            marginBottom: '30px'
          }}>
            <div style={{
              backgroundColor: '#f5f5f5',
              padding: '15px',
              borderRadius: '5px',
              textAlign: 'center'
            }}>
              <h3>Average Score</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{overallStats.avgScore}</p>
            </div>
            <div style={{
              backgroundColor: '#f5f5f5',
              padding: '15px',
              borderRadius: '5px',
              textAlign: 'center'
            }}>
              <h3>Average Fulfillment Rate</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{overallStats.avgFulfillment}%</p>
            </div>
            <div style={{
              backgroundColor: '#f5f5f5',
              padding: '15px',
              borderRadius: '5px',
              textAlign: 'center',
              
            }}>
              <h3>Average Performance Gap</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{overallStats.avgGap}</p>
            </div>
          </div>
          
          {/* Charts */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '30px',
            marginBottom: '30px'
          }}>
            <div style={{ width:"1100px"  }}>
              <Bar data={scoreChartData} options={scoreChartOptions} />
            </div>
            <div style={{width:"1100px" }}>
              <Bar data={fulfillmentChartData} options={fulfillmentChartOptions} />
            </div>
          </div>
          
          {/* Top Performing Competencies */}
          <div style={{ marginBottom: '30px' }}>
            <h2>Top Performing Competencies</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
              gap: '15px'
            }}>
              {competencyData.slice(0, 3).map(comp => (
                <div key={comp.competency_code} style={{
                  backgroundColor: '#e6f7ff',
                  padding: '15px',
                  borderRadius: '5px',
                  borderLeft: '4px solid #1890ff'
                }}>
                  <h3 style={{ marginTop: 0 }}>{comp.competency_name}</h3>
                  <p><strong>Rank:</strong> {comp.rank}</p>
                  <p><strong>Code:</strong> {comp.competency_code}</p>
                  <p><strong>Score:</strong> {comp.average_score}/{comp.required_score}</p>
                  <p><strong>Fulfillment:</strong> {comp.fulfillment_rate}%</p>
                  <p><strong>Gap:</strong> <span style={{ color: comp.performance_gap >= 0 ? 'green' : 'red' }}>{comp.performance_gap}</span></p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Needs Improvement */}
          <div style={{ marginBottom: '30px' }}>
            <h2>Areas Needing Improvement</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
              gap: '15px'
            }}>
              {[...competencyData].reverse().slice(0, 3).map(comp => (
                <div key={comp.competency_code} style={{
                  backgroundColor: '#fff1f0',
                  padding: '15px',
                  borderRadius: '5px',
                  borderLeft: '4px solid #f5222d'
                }}>
                  <h3 style={{ marginTop: 0 }}>{comp.competency_name}</h3>
                  <p><strong>Rank:</strong> {comp.rank}</p>
                  <p><strong>Code:</strong> {comp.competency_code}</p>
                  <p><strong>Score:</strong> {comp.average_score}/{comp.required_score}</p>
                  <p><strong>Fulfillment:</strong> {comp.fulfillment_rate}%</p>
                  <p><strong>Gap:</strong> <span style={{ color: 'red' }}>{comp.performance_gap}</span></p>
                </div>
              ))}
            </div>
          </div>
          
          {/* All Competencies Table */}
          <div>
            <h2>All Competencies</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse'
              }}>
                <thead>
                  <tr style={{
                    backgroundColor: '#f0f0f0',
                    textAlign: 'left'
                  }}>
                    <th style={{ padding: '20px', border: '1px solid #ddd' , fontSize:"20px" }}>Rank</th>
                    <th style={{ padding: '20px', border: '1px solid #ddd' , fontSize:"20px" }}>Code</th>
                    <th style={{ padding: '20px', border: '1px solid #ddd' , fontSize:"20px" }}>Competency</th>
                    <th style={{ padding: '20px', border: '1px solid #ddd' , fontSize:"20px" }}>Required</th>
                    <th style={{ padding: '20px', border: '1px solid #ddd' , fontSize:"20px" }}>Average</th>
                    <th style={{ padding: '20px', border: '1px solid #ddd' , fontSize:"20px" }}>Gap</th>
                    <th style={{ padding: '20px', border: '1px solid #ddd' , fontSize:"20px" }}>Fulfillment</th>
                    <th style={{ padding: '20px', border: '1px solid #ddd' , fontSize:"20px" }}>Employees</th>
                  </tr>
                </thead>
                <tbody>
                  {competencyData.map(comp => (
                    <tr key={comp.competency_code} style={{
                      borderBottom: '1px solid #ddd' 
                    }}>
                      <td style={{ padding: '20px', border: '1px solid #ddd' , fontSize:"20px" }}>{comp.rank}</td>
                      <td style={{ padding: '20px', border: '1px solid #ddd' , fontSize:"20px" }}>{comp.competency_code}</td>
                      <td style={{ padding: '20px', border: '1px solid #ddd' , fontSize:"20px" }}>{comp.competency_name}</td>
                      <td style={{ padding: '20px', border: '1px solid #ddd' , fontSize:"20px" }}>{comp.required_score}</td>
                      <td style={{ padding: '20px', border: '1px solid #ddd' , fontSize:"20px" }}>{comp.average_score}</td>
                      <td style={{ 
                        padding: '12px', 
                        border: '1px solid #ddd',
                        color: comp.performance_gap >= 0 ? 'green' : 'red'
                      }}>
                        {comp.performance_gap}
                      </td>
                      <td style={{ padding: '20px', border: '1px solid #ddd' , fontSize:"20px" }}>{comp.fulfillment_rate}%</td>
                      <td style={{ padding: '20px', border: '1px solid #ddd' , fontSize:"20px" }}>
                        {comp.employees_meeting_required}/{comp.total_evaluations}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>No competency data available.</p>
        </div>
      )}
    </div>
  );
};

export default OverallCompetencyDashboard;