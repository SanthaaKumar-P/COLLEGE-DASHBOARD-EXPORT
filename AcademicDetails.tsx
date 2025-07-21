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
  academicGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))',
    gap: '25px'
  },
  academicCard: {
    background: 'white',
    borderRadius: '15px',
    padding: '25px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
  },
  studentName: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: '15px'
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid #f7fafc'
  },
  detailLabel: {
    fontSize: '13px',
    color: '#4a5568',
    fontWeight: '500',
    minWidth: '120px'
  },
  detailValue: {
    fontSize: '13px',
    color: '#1a202c',
    fontWeight: '500',
    textAlign: 'right' as const
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

interface AcademicDetailsProps {
  onBack: () => void;
}

const AcademicDetails: React.FC<AcademicDetailsProps> = ({ onBack }) => {
  const [academicData, setAcademicData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAcademicData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const academic = await fetchAcademicData(ACADEMIC_RANGE);
      console.log('Fetched academic data:', academic);
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
      Loading academic data...
    </div>
  );

  const ErrorMessage = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
    <div style={styles.error}>
      <h3 style={{ margin: '0 0 10px 0' }}>Error Loading Academic Data</h3>
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

  const AcademicCard = ({ student }: { student: any[] }) => {
    // Assuming the academic sheet has columns like:
    // Register Number, Name, Sem1 CGPA, Sem2 CGPA, etc.
    const registerNumber = student[0] || 'N/A';
    const studentName = student[1] || 'Unknown Student';
    const sem1CGPA = student[2] || 'N/A';
    const sem2CGPA = student[3] || 'N/A';
    const overallCGPA = student[4] || 'N/A';
    const totalCredits = student[5] || 'N/A';
    const attendance = student[6] || 'N/A';

    return (
      <div style={styles.academicCard}>
        <div style={styles.studentName}>
          {studentName} ({registerNumber})
        </div>
        
        <div style={styles.detailRow}>
          <span style={styles.detailLabel}>Semester 1 CGPA</span>
          <span style={styles.detailValue}>{sem1CGPA}</span>
        </div>
        
        <div style={styles.detailRow}>
          <span style={styles.detailLabel}>Semester 2 CGPA</span>
          <span style={styles.detailValue}>{sem2CGPA}</span>
        </div>
        
        <div style={styles.detailRow}>
          <span style={styles.detailLabel}>Overall CGPA</span>
          <span style={styles.detailValue}>{overallCGPA}</span>
        </div>
        
        <div style={styles.detailRow}>
          <span style={styles.detailLabel}>Total Credits</span>
          <span style={styles.detailValue}>{totalCredits}</span>
        </div>
        
        <div style={styles.detailRow}>
          <span style={styles.detailLabel}>Attendance %</span>
          <span style={styles.detailValue}>{attendance}%</span>
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
            <h1 style={styles.title}>Academic Details</h1>
            <p style={styles.subtitle}>Student Academic Performance Overview</p>
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
              Academic Records
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
                  <div style={{ fontSize: '48px', marginBottom: '15px' }}>📚</div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600' }}>
                    No Academic Data Found
                  </h3>
                  <p style={{ margin: 0, color: '#718096' }}>
                    Please check the academic sheet configuration.
                  </p>
                </div>
              ) : (
                <div style={styles.academicGrid}>
                  {academicData.map((student, idx) => (
                    <AcademicCard key={idx} student={student} />
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

export default AcademicDetails;
