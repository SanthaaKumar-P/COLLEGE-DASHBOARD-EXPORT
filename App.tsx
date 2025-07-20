import React, { useEffect, useState } from "react";
import axios from "axios";

// Google Sheets API Configuration
const API_KEY = "AIzaSyBItOEnfIr0jZvqwfA31PCZuF-BK3-OqzA";
const SHEET_ID = "147SwmzfHZZzEbWlwBBVYfXqgwJonSXekdN_iE9O9O0c";
const PERSONAL_RANGE = "PERSONAL!A2:BF";
const ADMIN_PASSWORD = "admin123";

const fetchData = async (range: string) => {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(
      range
    )}?key=${API_KEY}`;
    const response = await axios.get(url);
    return response.data.values || [];
  } catch (error: any) {
    console.error("Error fetching data:", error);
    throw new Error(error.message || "Error fetching data");
  }
};

interface Filters {
  degree: string;
  class: string;
  community: string;
}

// Column mapping based on your sheet structure
const COLUMNS = {
  TIMESTAMP: 0,
  EMAIL_ADDRESS: 1,
  REGISTER_NUMBER: 2,
  FULL_NAME: 3,
  GENDER: 4,
  DATE_OF_BIRTH: 5,
  BLOOD_GROUP: 6,
  DEGREE: 7,
  YEAR_OF_JOINING: 8,
  CLASS_SECTION: 9,
  TIMESTAMP_2: 10,
  EMAIL_ADDRESS_2: 11,
  COMMUNITY: 12,
  CLASS_10_SCHOOL: 13,
  CLASS_10_BOARD: 14,
  CLASS_10_MEDIUM: 15,
  CLASS_10_PERCENTAGE: 16,
  CLASS_12_SCHOOL: 17,
  CLASS_12_BOARD: 18,
  CLASS_12_MEDIUM: 19,
  CLASS_12_PERCENTAGE: 20,
  NATIVITY: 21,
  CITY_NAME: 22,
  MOTHER_TONGUE: 23,
  TUTOR_NAME: 24,
  TUTOR_MOBILE: 25,
  COLLEGE_MAIL: 26,
  PERSONAL_MAIL: 27,
  PHONE_NUMBER: 28,
  WHATSAPP_NUMBER: 29,
  FATHER_NAME: 30,
  FATHER_OCCUPATION: 31,
  FATHER_PHONE: 32,
  MOTHER_NAME: 33,
  MOTHER_PHONE: 34,
  MOTHER_OCCUPATION: 35,
  PERMANENT_ADDRESS: 36,
  DAY_SCHOLAR_HOSTELLER: 37,
  REACHING_CAMPUS: 38,
  VEHICLE_REGISTRATION: 39,
  VEHICLE_LICENSE: 40,
  DAY_SCHOLAR_TYPE: 41,
  ADDRESS_WITH_PINCODE: 42,
  SIBLING_FRIEND_DETAILS: 43,
  GPS_LOCATION: 44,
  ADDRESS_WITH_PINCODE_2: 45,
  HOSTEL_NAME: 46,
  ROOM_NUMBER: 47,
  WARDEN_DETAILS: 48,
  ROOMMATE_DETAILS: 49,
  AADHAR_NUMBER: 50,
  PAN_NUMBER: 51,
  PHOTO: 52,
  LINKEDIN_PROFILE: 53,
  CGPA: 54,
  HISTORY_OF_ARREARS: 55,
  STANDING_ARREARS: 56,
  GAP_IN_EDUCATION: 57,
};

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    margin: 0,
    padding: 0,
  },
  loginContainer: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  loginCard: {
    background: "white",
    borderRadius: "20px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
    padding: "40px",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center" as const,
  },
  loginIcon: {
    width: "60px",
    height: "60px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
    fontSize: "24px",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    border: "2px solid #e1e5e9",
    borderRadius: "10px",
    fontSize: "16px",
    marginBottom: "20px",
    boxSizing: "border-box" as const,
    transition: "border-color 0.3s ease",
  },
  button: {
    width: "100%",
    padding: "12px 20px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "transform 0.2s ease",
  },
  dashboardContainer: {
    minHeight: "100vh",
    background: "#f8fafc",
    padding: "20px",
  },
  mainContent: {
    maxWidth: "1400px",
    margin: "0 auto",
  },
  header: {
    background: "white",
    borderRadius: "15px",
    padding: "30px",
    marginBottom: "30px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap" as const,
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1a202c",
    margin: "0 0 8px 0",
  },
  subtitle: {
    color: "#718096",
    margin: 0,
  },
  filtersContainer: {
    background: "white",
    borderRadius: "15px",
    padding: "25px",
    marginBottom: "30px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
  },
  filtersGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "15px",
    marginTop: "20px",
  },
  searchInput: {
    padding: "12px 16px",
    border: "2px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "14px",
    width: "100%",
    boxSizing: "border-box" as const,
  },
  select: {
    padding: "12px 16px",
    border: "2px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "14px",
    width: "100%",
    boxSizing: "border-box" as const,
    background: "white",
    cursor: "pointer",
  },
  clearButton: {
    padding: "12px 20px",
    background: "#f7fafc",
    color: "#4a5568",
    border: "2px solid #e2e8f0",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
  },
  studentsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
    gap: "25px",
  },
  studentCard: {
    background: "white",
    borderRadius: "15px",
    padding: "25px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    cursor: "pointer",
  },
  studentCardExpanded: {
    background: "white",
    borderRadius: "15px",
    padding: "25px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    cursor: "pointer",
    transform: "translateY(-2px)",
  },
  studentHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
    paddingBottom: "15px",
    borderBottom: "2px solid #f7fafc",
  },
  avatar: {
    width: "60px",
    height: "60px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "20px",
    fontWeight: "600",
    marginRight: "15px",
  },
  studentName: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#1a202c",
    margin: "0 0 4px 0",
  },
  studentId: {
    fontSize: "14px",
    color: "#718096",
    margin: "0 0 4px 0",
  },
  studentDegree: {
    fontSize: "14px",
    color: "#667eea",
    fontWeight: "600",
    margin: 0,
  },
  sectionTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#4a5568",
    margin: "20px 0 10px 0",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "4px 0",
    borderBottom: "1px solid #f7fafc",
    gap: "8px",
  },
  detailLabel: {
    fontSize: "13px",
    color: "#4a5568",
    fontWeight: "500",
    minWidth: "100px",
    flexShrink: 0,
  },
  detailValue: {
    fontSize: "13px",
    color: "#1a202c",
    fontWeight: "500",
    textAlign: "right" as const,
    wordBreak: "break-word" as const,
    flex: 1,
  },
  link: {
    color: "#667eea",
    textDecoration: "underline",
    cursor: "pointer",
  },
  expandIcon: {
    fontSize: "18px",
    color: "#667eea",
    marginLeft: "auto",
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "60px",
    fontSize: "18px",
    color: "#667eea",
  },
  error: {
    background: "#fed7d7",
    border: "1px solid #feb2b2",
    borderRadius: "10px",
    padding: "20px",
    textAlign: "center" as const,
    color: "#c53030",
  },
  noData: {
    textAlign: "center" as const,
    padding: "60px",
    color: "#718096",
  },
  logoutButton: {
    padding: "10px 20px",
    background: "#e53e3e",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
  },
};

// Utility functions
const encryptAadhar = (aadhar: string) => {
  if (!aadhar || aadhar.length < 4) return aadhar;
  return "*".repeat(aadhar.length - 4) + aadhar.slice(-4);
};

const getUniqueValues = (data: any[], columnIndex: number) => {
  const values = data
    .map((row) => row[columnIndex])
    .filter((value) => value && value.trim())
    .map((value) => value.trim());
  return [...new Set(values)].sort();
};

const parsePhotoUrls = (photoString: string) => {
  if (!photoString) return [];
  // Split by common separators, clean up, and filter valid URLs
  const urls = photoString
    .split(/[,;\n\r\t\|]/)
    .map((url) => url.trim())
    .filter(
      (url) =>
        url &&
        url.length > 10 &&
        (url.startsWith("http") || url.startsWith("https"))
    )
    .slice(0, 3); // Limit to first 3 photos to avoid clutter
  return urls;
};

const LoadingSpinner = () => (
  <div style={styles.loading}>
    <div
      style={{
        width: "40px",
        height: "40px",
        border: "4px solid #e2e8f0",
        borderTop: "4px solid #667eea",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
        marginRight: "15px",
      }}
    ></div>
    Loading student data...
  </div>
);

const ErrorMessage = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) => (
  <div style={styles.error}>
    <h3 style={{ margin: "0 0 10px 0" }}>Error Loading Data</h3>
    <p style={{ margin: "0 0 15px 0" }}>{message}</p>
    <button
      onClick={onRetry}
      style={{
        ...styles.button,
        width: "auto",
        background: "#e53e3e",
      }}
    >
      Try Again
    </button>
  </div>
);

const StudentCard = ({
  student,
  isExpanded,
  onToggle,
}: {
  student: any[];
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  const fullName = student[COLUMNS.FULL_NAME] || "Unknown Student";
  const registerNumber = student[COLUMNS.REGISTER_NUMBER] || "N/A";
  const gender = student[COLUMNS.GENDER] || "N/A";
  const degree = student[COLUMNS.DEGREE] || "N/A";
  const classSection = student[COLUMNS.CLASS_SECTION] || "N/A";
  const isHosteller = (student[COLUMNS.DAY_SCHOLAR_HOSTELLER] || "")
    .toLowerCase()
    .includes("hostel");

  const gpsLocation = student[COLUMNS.GPS_LOCATION];
  const linkedinProfile = student[COLUMNS.LINKEDIN_PROFILE];
  const photoUrls = parsePhotoUrls(student[COLUMNS.PHOTO]);

  const handleGpsClick = () => {
    if (gpsLocation) {
      window.open(
        `https://maps.google.com/?q=${encodeURIComponent(gpsLocation)}`,
        "_blank"
      );
    }
  };

  const handleLinkedinClick = () => {
    if (linkedinProfile) {
      let url = linkedinProfile;
      if (!url.startsWith("http")) {
        url = "https://" + url;
      }
      window.open(url, "_blank");
    }
  };

  const handlePhotoClick = (photoUrl: string) => {
    window.open(photoUrl, "_blank");
  };

  return (
    <div
      style={isExpanded ? styles.studentCardExpanded : styles.studentCard}
      className="student-card"
      onClick={onToggle}
    >
      <div style={styles.studentHeader}>
        <div style={styles.avatar}>{fullName[0]?.toUpperCase() || "U"}</div>
        <div style={{ flex: 1 }}>
          <h3 style={styles.studentName}>{fullName}</h3>
          <p style={styles.studentId}>Reg: {registerNumber}</p>
          <p style={styles.studentId}>Gender: {gender}</p>
          {isExpanded && (
            <p style={styles.studentDegree}>
              {degree} - {classSection}
            </p>
          )}
        </div>
        <div style={styles.expandIcon}>{isExpanded ? "🔽" : "▶️"}</div>
      </div>

      {isExpanded && (
        <>
          {/* Basic Information */}
          <div style={styles.sectionTitle}>📋 Basic Information</div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Email</span>
            <span style={styles.detailValue}>
              {student[COLUMNS.EMAIL_ADDRESS] || "-"}
            </span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>DOB</span>
            <span style={styles.detailValue}>
              {student[COLUMNS.DATE_OF_BIRTH] || "-"}
            </span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Blood Group</span>
            <span style={styles.detailValue}>
              {student[COLUMNS.BLOOD_GROUP] || "-"}
            </span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Community</span>
            <span style={styles.detailValue}>
              {student[COLUMNS.COMMUNITY] || "-"}
            </span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Aadhar No</span>
            <span style={styles.detailValue}>
              {student[COLUMNS.AADHAR_NUMBER]
                ? encryptAadhar(student[COLUMNS.AADHAR_NUMBER])
                : "-"}
            </span>
          </div>

          {/* Academic Details */}
          <div style={styles.sectionTitle}>🎓 Academic Details</div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Year of Joining</span>
            <span style={styles.detailValue}>
              {student[COLUMNS.YEAR_OF_JOINING] || "-"}
            </span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Current CGPA</span>
            <span style={styles.detailValue}>
              {student[COLUMNS.CGPA] || "-"}
            </span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>10th %</span>
            <span style={styles.detailValue}>
              {student[COLUMNS.CLASS_10_PERCENTAGE]
                ? `${student[COLUMNS.CLASS_10_PERCENTAGE]}%`
                : "-"}
            </span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>12th %</span>
            <span style={styles.detailValue}>
              {student[COLUMNS.CLASS_12_PERCENTAGE]
                ? `${student[COLUMNS.CLASS_12_PERCENTAGE]}%`
                : "-"}
            </span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Standing Arrears</span>
            <span style={styles.detailValue}>
              {student[COLUMNS.STANDING_ARREARS] || "0"}
            </span>
          </div>

          {/* Contact Details */}
          <div style={styles.sectionTitle}>📞 Contact Details</div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Phone</span>
            <span style={styles.detailValue}>
              {student[COLUMNS.PHONE_NUMBER] || "-"}
            </span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>WhatsApp</span>
            <span style={styles.detailValue}>
              {student[COLUMNS.WHATSAPP_NUMBER] || "-"}
            </span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>College Email</span>
            <span style={styles.detailValue}>
              {student[COLUMNS.COLLEGE_MAIL] || "-"}
            </span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Personal Email</span>
            <span style={styles.detailValue}>
              {student[COLUMNS.PERSONAL_MAIL] || "-"}
            </span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>LinkedIn</span>
            <span style={styles.detailValue}>
              {linkedinProfile ? (
                <span
                  style={styles.link}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLinkedinClick();
                  }}
                >
                  View Profile
                </span>
              ) : (
                "-"
              )}
            </span>
          </div>

          {/* Family Details */}
          <div style={styles.sectionTitle}>👨‍👩‍👧‍👦 Family Details</div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Father's Name</span>
            <span style={styles.detailValue}>
              {student[COLUMNS.FATHER_NAME] || "-"}
            </span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Father's Phone</span>
            <span style={styles.detailValue}>
              {student[COLUMNS.FATHER_PHONE] || "-"}
            </span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Mother's Name</span>
            <span style={styles.detailValue}>
              {student[COLUMNS.MOTHER_NAME] || "-"}
            </span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Mother's Phone</span>
            <span style={styles.detailValue}>
              {student[COLUMNS.MOTHER_PHONE] || "-"}
            </span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Tutor Name</span>
            <span style={styles.detailValue}>
              {student[COLUMNS.TUTOR_NAME] || "-"}
            </span>
          </div>

          {/* Location & Transport */}
          <div style={styles.sectionTitle}>🏠 Accommodation & Transport</div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Type</span>
            <span style={styles.detailValue}>
              {student[COLUMNS.DAY_SCHOLAR_HOSTELLER] || "-"}
            </span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Transport</span>
            <span style={styles.detailValue}>
              {student[COLUMNS.REACHING_CAMPUS] || "-"}
            </span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>City</span>
            <span style={styles.detailValue}>
              {student[COLUMNS.CITY_NAME] || "-"}
            </span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Mother Tongue</span>
            <span style={styles.detailValue}>
              {student[COLUMNS.MOTHER_TONGUE] || "-"}
            </span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>GPS Location</span>
            <span style={styles.detailValue}>
              {gpsLocation ? (
                <span
                  style={styles.link}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGpsClick();
                  }}
                >
                  View on Map
                </span>
              ) : (
                "-"
              )}
            </span>
          </div>

          {/* Hostel Details (only for hostellers) */}
          {isHosteller && (
            <>
              <div style={styles.sectionTitle}>🏨 Hostel Details</div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Hostel Name</span>
                <span style={styles.detailValue}>
                  {student[COLUMNS.HOSTEL_NAME] || "-"}
                </span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Room Number</span>
                <span style={styles.detailValue}>
                  {student[COLUMNS.ROOM_NUMBER] || "-"}
                </span>
              </div>
            </>
          )}

          {/* Photos */}
          {photoUrls.length > 0 && (
            <>
              <div style={styles.sectionTitle}>📸 Photos</div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>
                  Photos ({photoUrls.length})
                </span>
                <span style={styles.detailValue}>
                  {photoUrls.map((photoUrl, index) => (
                    <span key={index}>
                      <span
                        style={{ ...styles.link, marginRight: "8px" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePhotoClick(photoUrl);
                        }}
                      >
                        Photo {index + 1}
                      </span>
                      {index < photoUrls.length - 1 && " | "}
                    </span>
                  ))}
                </span>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

const LoginForm = ({
  passwordInput,
  setPasswordInput,
  onLogin,
  showPassword,
  setShowPassword,
}: {
  passwordInput: string;
  setPasswordInput: (value: string) => void;
  onLogin: () => void;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
}) => (
  <div style={styles.loginContainer}>
    <div style={styles.loginCard}>
      <div style={styles.loginIcon}>🔒</div>
      <h2 style={{ margin: "0 0 8px 0", fontSize: "24px", fontWeight: "700" }}>
        Admin Access
      </h2>
      <p style={{ margin: "0 0 30px 0", color: "#718096" }}>
        Enter your password to continue
      </p>

      <div style={{ position: "relative", marginBottom: "20px" }}>
        <input
          type={showPassword ? "text" : "password"}
          style={styles.input}
          placeholder="Enter admin password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onLogin();
          }}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          style={{
            position: "absolute",
            right: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          {showPassword ? "🙈" : "👁️"}
        </button>
      </div>

      <button onClick={onLogin} style={styles.button}>
        Access Dashboard
      </button>
    </div>
  </div>
);

export default function Dashboard() {
  const [personalData, setPersonalData] = useState<any[]>([]);
  const [filters, setFilters] = useState<Filters>({
    degree: "",
    class: "",
    community: "",
  });
  const [searchName, setSearchName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());

  const loadData = async () => {
    if (!isAdmin) return;

    setLoading(true);
    setError("");

    try {
      const personal = await fetchData(PERSONAL_RANGE);
      console.log("Fetched data:", personal);
      setPersonalData(personal);
    } catch (err: any) {
      setError(
        "Failed to fetch data. Please check your API key, sheet ID, and sheet/tab names."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [isAdmin]);

  const handleLogin = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAdmin(true);
    } else {
      alert("Incorrect password. Please try again.");
    }
  };

  const toggleCardExpansion = (index: number) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedCards(newExpanded);
  };

  const filterData = (data: any[]) => {
    return data.filter((row) => {
      const degree = (row[COLUMNS.DEGREE] || "").toLowerCase();
      const classSection = (row[COLUMNS.CLASS_SECTION] || "").toLowerCase();
      const community = (row[COLUMNS.COMMUNITY] || "").toLowerCase();
      const fullName = (row[COLUMNS.FULL_NAME] || "").toLowerCase();

      return (
        (!filters.degree || degree.includes(filters.degree.toLowerCase())) &&
        (!filters.class ||
          classSection.includes(filters.class.toLowerCase())) &&
        (!filters.community ||
          community.includes(filters.community.toLowerCase())) &&
        (!searchName || fullName.includes(searchName.toLowerCase()))
      );
    });
  };

  if (!isAdmin) {
    return (
      <LoginForm
        passwordInput={passwordInput}
        setPasswordInput={setPasswordInput}
        onLogin={handleLogin}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
      />
    );
  }

  const filteredData = filterData(personalData);
  const uniqueDegrees = getUniqueValues(personalData, COLUMNS.DEGREE);
  const uniqueClasses = getUniqueValues(personalData, COLUMNS.CLASS_SECTION);
  const uniqueCommunities = getUniqueValues(personalData, COLUMNS.COMMUNITY);

  return (
    <div style={styles.dashboardContainer}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .student-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
          }
          
          .button:hover {
            transform: translateY(-1px);
          }
          
          .input:focus {
            border-color: #667eea;
            outline: none;
          }
        `}
      </style>

      <div style={styles.mainContent}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>College Dashboard</h1>
            <p style={styles.subtitle}>Complete Student Management System</p>
          </div>
          <button onClick={() => setIsAdmin(false)} style={styles.logoutButton}>
            🔒 Logout
          </button>
        </div>

        {/* Filters */}
        <div style={styles.filtersContainer}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px",
            }}
          >
            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
              🔍 Filters
            </h3>
            <span style={{ fontSize: "14px", color: "#718096" }}>
              Showing {filteredData.length} of {personalData.length} students
            </span>
          </div>

          <div style={styles.filtersGrid}>
            <input
              style={styles.searchInput}
              placeholder="🔍 Search by name..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />

            <select
              style={styles.select}
              value={filters.degree}
              onChange={(e) =>
                setFilters({ ...filters, degree: e.target.value })
              }
            >
              <option value="">All Degrees</option>
              {uniqueDegrees.map((degree) => (
                <option key={degree} value={degree}>
                  {degree}
                </option>
              ))}
            </select>

            <select
              style={styles.select}
              value={filters.class}
              onChange={(e) =>
                setFilters({ ...filters, class: e.target.value })
              }
            >
              <option value="">All Classes</option>
              {uniqueClasses.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>

            <select
              style={styles.select}
              value={filters.community}
              onChange={(e) =>
                setFilters({ ...filters, community: e.target.value })
              }
            >
              <option value="">All Communities</option>
              {uniqueCommunities.map((community) => (
                <option key={community} value={community}>
                  {community}
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                setFilters({ degree: "", class: "", community: "" });
                setSearchName("");
                setExpandedCards(new Set());
              }}
              style={styles.clearButton}
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Content */}
        <div
          style={{
            background: "white",
            borderRadius: "15px",
            padding: "25px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "25px",
            }}
          >
            <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "600" }}>
              Student Records
            </h2>
            <button
              onClick={loadData}
              disabled={loading}
              style={{
                ...styles.button,
                width: "auto",
                opacity: loading ? 0.5 : 1,
              }}
            >
              🔄 Refresh
            </button>
          </div>

          {loading && <LoadingSpinner />}

          {error && <ErrorMessage message={error} onRetry={loadData} />}

          {!loading && !error && (
            <>
              {filteredData.length === 0 ? (
                <div style={styles.noData}>
                  <div style={{ fontSize: "48px", marginBottom: "15px" }}>
                    👥
                  </div>
                  <h3
                    style={{
                      margin: "0 0 8px 0",
                      fontSize: "18px",
                      fontWeight: "600",
                    }}
                  >
                    No Students Found
                  </h3>
                  <p style={{ margin: 0, color: "#718096" }}>
                    Try adjusting your filters or search criteria.
                  </p>
                </div>
              ) : (
                <div style={styles.studentsGrid}>
                  {filteredData.map((student, idx) => (
                    <StudentCard
                      key={idx}
                      student={student}
                      isExpanded={expandedCards.has(idx)}
                      onToggle={() => toggleCardExpansion(idx)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
