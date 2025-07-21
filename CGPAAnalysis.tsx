import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Academic sheet configuration
const API_KEY = "AIzaSyBItOEnfIr0jZvqwfA31PCZuF-BK3-OqzA";
const ACADEMIC_SHEET_ID = "1HyCbs7UxR_jDmKeUuz-lV33078NfH7fM6BuHLgE0VAw";
const ACADEMIC_RANGE = "Academic!A2:Z";

const fetchAcademicData = async (range: string) => {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${ACADEMIC_SHEET_ID}/values/${encodeURIComponent(range)}?key=${API_KEY}`;
    const response = await axios.get(url);
    return response.data.values || [];
  } catch (error: any) {
    console.error('Error fetching academic data:', error);
    throw new Error(error.message || 'Error fetching academic data');
  }
};

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f8fafc',
    padding: '20px'
  },
  mainContent: {
    maxWidth: '1400px',
    margin: '0 auto'
  },
  header: {
    background: 'white',
    borderRadius: '15px',
    padding: '30px',
    marginBottom: '30px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1a202c',
    margin: '0 0 8px 0'
  },
  subtitle: {
    color: '#718096',
    margin: 0
  },
  backButton: {
    padding: '10px 20px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(600px, 1fr))',
    gap: '25px'
  },
  chartCard: {
    background: 'white',
    borderRadius: '15px',
    padding: '25px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
  },
  chartTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: '20px',
    textAlign: 'center' as const
  },
  chartContainer: {
    position: 'relative' as const,
    height: '300px',
    marginBottom: '15px'
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '60px',
    fontSize: '18px',
    color: '#667eea'
  },
  error: {
    background: '#fed7d7',
    border: '1px solid #feb2b2',
    borderRadius: '10px',
    padding: '20px',
    textAlign: 'center' as const,
    color: '#c53030'
  },
  noData: {
    textAlign: 'center' as const,
    padding: '60px',
    color: '#718096'
  }
};

interface CGPAAnalysisProps {
  onBack: () => void;
}

const CGPAAnalysis: React.FC<CGPAAnalysisProps> = ({ onBack }) => {
  const [academicData, setAcademicData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAcademicData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const academic = await fetchAcademicData(ACADEMIC_RANGE);
      console.log('Fetched academic data for CGPA analysis:', academic);
      setAcademicData(academic);
    } catch (err: any) {
      setError('Failed to fetch academic data. Please check the sheet configuration.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAcademicData();
  }, []);

  const LoadingSpinner = () => (
    <div style={styles.loading}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '4px solid #e2e8f0',
        borderTop: '4px solid #667eea',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginRight: '15px'
      }}></div>
      Loading CGPA analysis...
    </div>
  );

  const ErrorMessage = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
    <div style={styles.error}>
      <h3 style={{ margin: '0 0 10px 0' }}>Error Loading CGPA Data</h3>
      <p style={{ margin: '0 0 15px 0' }}>{message}</p>
      <button onClick={onRetry} style={{
        padding: '10px 20px',
        background: '#e53e3e',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer'
      }}>
        Try Again
      </button>
    </div>
  );

  const LineChart = ({ student, index }: { student: any[]; index: number }) => {
    const registerNumber = student[0] || 'N/A';
    const studentName = student[1] || 'Unknown Student';
    const sem1CGPA = parseFloat(student[2]) || 0;
    const sem2CGPA = parseFloat(student[3]) || 0;

    // Create line chart data points
    const dataPoints = [
      { semester: 'Sem 1', cgpa: sem1CGPA },
      { semester: 'Sem 2', cgpa: sem2CGPA }
    ];

    const maxCGPA = 10;
    const chartWidth = 500;
    const chartHeight = 250;
    const padding = 50;

    // Calculate positions
    const xStep = (chartWidth - 2 * padding) / (dataPoints.length - 1);
    const yScale = (chartHeight - 2 * padding) / maxCGPA;

    const points = dataPoints.map((point, idx) => ({
      x: padding + idx * xStep,
      y: chartHeight - padding - (point.cgpa * yScale),
      cgpa: point.cgpa,
      semester: point.semester
    }));

    const pathData = points.map((point, idx) => 
      `${idx === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ');

    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];
    const color = colors[index % colors.length];

    return (
      <div style={styles.chartCard}>
        <div style={styles.chartTitle}>
          {studentName} ({registerNumber})
        </div>
        
        <div style={styles.chartContainer}>
          <svg width={chartWidth} height={chartHeight} style={{ width: '100%', height: '100%' }}>
            {/* Grid lines */}
            {[0, 2, 4, 6, 8, 10].map(cgpa => (
              <g key={cgpa}>
                <line
                  x1={padding}
                  y1={chartHeight - padding - (cgpa * yScale)}
                  x2={chartWidth - padding}
                  y2={chartHeight - padding - (cgpa * yScale)}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                />
                <text
                  x={padding - 10}
                  y={chartHeight - padding - (cgpa * yScale) + 5}
                  fontSize="12"
                  fill="#718096"
                  textAnchor="end"
                >
                  {cgpa}
                </text>
              </g>
            ))}
            
            {/* X-axis labels */}
            {points.map((point, idx) => (
              <text
                key={idx}
                x={point.x}
                y={chartHeight - padding + 20}
                fontSize="12"
                fill="#718096"
                textAnchor="middle"
              >
                {point.semester}
              </text>
            ))}
            
            {/* Line */}
            <path
              d={pathData}
              stroke={color}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Data points */}
            {points.map((point, idx) => (
              <g key={idx}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="6"
                  fill={color}
                  stroke="white"
                  strokeWidth="2"
                />
                <text
                  x={point.x}
                  y={point.y - 15}
                  fontSize="12"
                  fill={color}
                  textAnchor="middle"
                  fontWeight="600"
                >
                  {point.cgpa.toFixed(2)}
                </text>
              </g>
            ))}
            
            {/* Axes */}
            <line
              x1={padding}
              y1={padding}
              x2={padding}
              y2={chartHeight - padding}
              stroke="#4a5568"
              strokeWidth="2"
            />
            <line
              x1={padding}
              y1={chartHeight - padding}
              x2={chartWidth - padding}
              y2={chartHeight - padding}
              stroke="#4a5568"
              strokeWidth="2"
            />
          </svg>
        </div>
        
        {/* Statistics */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          padding: '15px',
          background: '#f8fafc',
          borderRadius: '10px',
          fontSize: '14px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: '600', color: '#1a202c' }}>Sem 1 CGPA</div>
            <div style={{ color: '#667eea', fontWeight: '600' }}>{sem1CGPA.toFixed(2)}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: '600', color: '#1a202c' }}>Sem 2 CGPA</div>
            <div style={{ color: '#764ba2', fontWeight: '600' }}>{sem2CGPA.toFixed(2)}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: '600', color: '#1a202c' }}>Improvement</div>
            <div style={{ 
              color: sem2CGPA >= sem1CGPA ? '#48bb78' : '#f56565', 
              fontWeight: '600' 
            }}>
              {sem2CGPA >= sem1CGPA ? '+' : ''}{(sem2CGPA - sem1CGPA).toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      
      <div style={styles.mainContent}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>CGPA Analysis</h1>
            <p style={styles.subtitle}>Individual Student CGPA Progression Charts</p>
          </div>
          <button onClick={onBack} style={styles.backButton}>
            ← Back to Dashboard
          </button>
        </div>

        {/* Content */}
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '25px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '25px'
          }}>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>
              📈 Individual CGPA Progression
            </h2>
            <button
              onClick={loadAcademicData}
              disabled={loading}
              style={{
                padding: '12px 20px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                opacity: loading ? 0.5 : 1
              }}
            >
              🔄 Refresh
            </button>
          </div>

          {loading && <LoadingSpinner />}
          
          {error && (
            <ErrorMessage message={error} onRetry={loadAcademicData} />
          )}

          {!loading && !error && (
            <>
              {academicData.length === 0 ? (
                <div style={styles.noData}>
                  <div style={{ fontSize: '48px', marginBottom: '15px' }}>📊</div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600' }}>
                    No CGPA Data Found
                  </h3>
                  <p style={{ margin: 0, color: '#718096' }}>
                    Please check the academic sheet configuration.
                  </p>
                </div>
              ) : (
                <div style={styles.chartsGrid}>
                  {academicData.map((student, idx) => (
                    <LineChart key={idx} student={student} index={idx} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CGPAAnalysis;
