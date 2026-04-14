import { useQuery } from "@apollo/client/react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import GlucoseChart from "../components/GlucoseChart";
import { GET_READINGS } from "../graphql/queries";

type Reading = {
  id: string;
  value: number;
  status: string;
  readingTime: string;
  note?: string;
};

type GetReadingsResponse = {
  myReadings: Reading[];
};

const Dashboard = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const { data, loading, error } = useQuery<GetReadingsResponse>(GET_READINGS, {
    context: {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  const readings = data?.myReadings || [];
  const totalReadings = readings.length;
  const averageValue =
    totalReadings > 0
      ? (
          readings.reduce((sum, reading) => sum + reading.value, 0) /
          totalReadings
        ).toFixed(1)
      : null;
  const latestReading = totalReadings > 0 ? readings[0] : null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-page">
      <div className="dashboard-shell">
        <header className="dashboard-header">
          <p className="dashboard-eyebrow">Diabetes Tracker</p>
          <h2 className="dashboard-title">Dashboard</h2>
          <p className="dashboard-subtitle">Welcome back, {user?.username}</p>
        </header>

        <section className="dashboard-profile">
          <div className="dashboard-profile-item">
            <span className="dashboard-profile-label">Username</span>
            <p className="dashboard-profile-value">{user?.username}</p>
          </div>

          <div className="dashboard-profile-item">
            <span className="dashboard-profile-label">Email</span>
            <p className="dashboard-profile-value">{user?.email}</p>
          </div>
        </section>

        <section className="dashboard-summary">
          <div className="dashboard-summary-card">
            <span className="dashboard-summary-label">Total Readings</span>
            <p className="dashboard-summary-value">{totalReadings}</p>
          </div>

          <div className="dashboard-summary-card">
            <span className="dashboard-summary-label">Average Glucose</span>
            <p className="dashboard-summary-value">
              {averageValue ? `${averageValue} mmol/L` : "No readings yet"}
            </p>
          </div>

          <div className="dashboard-summary-card dashboard-summary-card--latest">
            <span className="dashboard-summary-label">Latest Reading</span>

            {loading && <p className="dashboard-summary-text">Loading...</p>}

            {error && !loading && (
              <p className="dashboard-summary-text">Could not load readings</p>
            )}

            {!loading && !error && !latestReading && (
              <p className="dashboard-summary-text">No readings yet</p>
            )}

            {!loading && !error && latestReading && (
              <div className="dashboard-latest-reading">
                <p className="dashboard-summary-value dashboard-summary-value--latest">
                  {latestReading.value.toFixed(1)} mmol/L
                </p>
                <p className="dashboard-latest-status">{latestReading.status}</p>
                <p className="dashboard-summary-text">
                  {new Date(latestReading.readingTime).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="dashboard-chart-section">
          <div className="dashboard-chart-header">
            <h3 className="dashboard-chart-title">Glucose Trend</h3>
            <p className="dashboard-chart-subtitle">
              Your glucose readings over time in mmol/L.
            </p>
          </div>

          <GlucoseChart
            readings={readings}
            loading={loading}
            error={Boolean(error)}
          />
        </section>

        <section className="dashboard-actions">
          <Link to="/add-reading" className="dashboard-action-link">
            Add Glucose Reading
          </Link>

          <Link to="/readings" className="dashboard-action-link">
            View My Readings
          </Link>

          <button onClick={handleLogout} className="dashboard-logout">
            Logout
          </button>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
