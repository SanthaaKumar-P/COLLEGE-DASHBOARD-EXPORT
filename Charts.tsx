import React from 'react';

interface ChartData {
  label: string;
  value: number;
  color: string;
}

const colors = [
  '#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe',
  '#43e97b', '#38f9d7', '#ffecd2', '#fcb69f', '#a8edea', '#fed6e3'
];

export const RegionChart = ({ data }: { data: any[] }) => {
  // Count students by city/region
  const regionCounts: { [key: string]: number } = {};
  
  data.forEach(student => {
    const city = student[22] || 'Unknown'; // CITY_NAME column
    regionCounts[city] = (regionCounts[city] || 0) + 1;
  });

  const chartData: ChartData[] = Object.entries(regionCounts)
    .map(([label, value], index) => ({
      label,
      value,
      color: colors[index % colors.length]
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10); // Top 10 regions

  const maxValue = Math.max(...chartData.map(d => d.value));

  return (
    <div style={{
      background: 'white',
      borderRadius: '15px',
      padding: '25px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      marginBottom: '30px'
    }}>
      <h3 style={{ 
        margin: '0 0 20px 0', 
        fontSize: '20px', 
        fontWeight: '600',
        color: '#1a202c'
      }}>
        📍 Students by Region/City
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {chartData.map((item, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              minWidth: '120px', 
              fontSize: '14px', 
              fontWeight: '500',
              color: '#4a5568'
            }}>
              {item.label}
            </div>
            <div style={{ 
              flex: 1, 
              height: '24px', 
              background: '#f7fafc', 
              borderRadius: '12px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${(item.value / maxValue) * 100}%`,
                background: `linear-gradient(90deg, ${item.color}, ${item.color}dd)`,
                borderRadius: '12px',
                transition: 'width 0.5s ease'
              }} />
            </div>
            <div style={{ 
              minWidth: '40px', 
              fontSize: '14px', 
              fontWeight: '600',
              color: '#1a202c',
              textAlign: 'right'
            }}>
              {item.value}
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        background: '#f8fafc', 
        borderRadius: '10px',
        fontSize: '14px',
        color: '#718096'
      }}>
        Total Students: {data.length} | Showing top 10 regions
      </div>
    </div>
  );
};

export const AccommodationChart = ({ data }: { data: any[] }) => {
  // Count students by accommodation type
  const accommodationCounts: { [key: string]: number } = {};
  
  data.forEach(student => {
    const accommodation = student[37] || 'Unknown'; // DAY_SCHOLAR_HOSTELLER column
    accommodationCounts[accommodation] = (accommodationCounts[accommodation] || 0) + 1;
  });

  const chartData: ChartData[] = Object.entries(accommodationCounts)
    .map(([label, value], index) => ({
      label,
      value,
      color: colors[index % colors.length]
    }))
    .sort((a, b) => b.value - a.value);

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div style={{
      background: 'white',
      borderRadius: '15px',
      padding: '25px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      marginBottom: '30px'
    }}>
      <h3 style={{ 
        margin: '0 0 20px 0', 
        fontSize: '20px', 
        fontWeight: '600',
        color: '#1a202c'
      }}>
        🏠 Students by Accommodation Type
      </h3>
      
      <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
        {/* Pie Chart */}
        <div style={{ position: 'relative', width: '200px', height: '200px' }}>
          <svg width="200" height="200" style={{ transform: 'rotate(-90deg)' }}>
            {chartData.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const angle = (percentage / 100) * 360;
              const startAngle = chartData.slice(0, index).reduce((sum, prev) => 
                sum + ((prev.value / total) * 360), 0
              );
              
              const x1 = 100 + 80 * Math.cos((startAngle * Math.PI) / 180);
              const y1 = 100 + 80 * Math.sin((startAngle * Math.PI) / 180);
              const x2 = 100 + 80 * Math.cos(((startAngle + angle) * Math.PI) / 180);
              const y2 = 100 + 80 * Math.sin(((startAngle + angle) * Math.PI) / 180);
              
              const largeArcFlag = angle > 180 ? 1 : 0;
              
              return (
                <path
                  key={index}
                  d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                  fill={item.color}
                  stroke="white"
                  strokeWidth="2"
                />
              );
            })}
          </svg>
        </div>
        
        {/* Legend */}
        <div style={{ flex: 1 }}>
          {chartData.map((item, index) => (
            <div key={index} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              marginBottom: '12px'
            }}>
              <div style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: item.color
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontSize: '14px', 
                  fontWeight: '500',
                  color: '#1a202c'
                }}>
                  {item.label}
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#718096'
                }}>
                  {item.value} students ({((item.value / total) * 100).toFixed(1)}%)
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
