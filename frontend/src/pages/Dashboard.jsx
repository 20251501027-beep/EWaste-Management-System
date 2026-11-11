import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getItems, getRequests, checkHealth } from '../services/api';
import { calculateEcoRewards, calculateEnvironmentalImpact } from '../utils/rewards';
import StatCard from '../components/StatCard';
import ItemTable from '../components/ItemTable';
import './Dashboard.css';

// ─── Icons ───────────────────────────────────────────────────────────────────
const icons = {
  box: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    </svg>
  ),
  truck: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  ),
  clock: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  check: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  weight: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="3" /><path d="M6.5 8h11l1 11H5.5L6.5 8z" />
    </svg>
  ),
  star: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  ),
};

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backendOk, setBackendOk] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await checkHealth();
      setBackendOk(true);
      const [itemsRes, requestsRes] = await Promise.all([getItems(), getRequests()]);
      setItems(itemsRes.items || []);
      setRequests(requestsRes.requests || []);
    } catch (err) {
      setBackendOk(false);
      setError(err.message || 'Could not connect to the backend.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const { totalPoints, totalWeight } = calculateEcoRewards(items);
  const { co2Saved, metalRecovered, waterSaved } = calculateEnvironmentalImpact(totalWeight);

  const pending = requests.filter((r) => r.status === 'Pending').length;
  const completed = requests.filter((r) => r.status === 'Completed').length;
  const recentItems = items.slice(0, 5);

  return (
    <div className="dashboard">
      {/* Backend status banner */}
      {backendOk === false && (
        <div className="dashboard-banner dashboard-banner--error">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>Cannot reach the backend at <strong>localhost:8080</strong>. Make sure your Node.js server is running. &nbsp;{error}</span>
          <button onClick={fetchData} className="dashboard-banner-retry">Retry</button>
        </div>
      )}

      {backendOk === true && (
        <div className="dashboard-banner dashboard-banner--success">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>Backend connected successfully.</span>
        </div>
      )}

      {/* Stats Grid */}
      <section className="dashboard-stats">
        <StatCard icon={icons.box}    label="Total E-Waste Items"       value={items.length}         color="green"  loading={loading} />
        <StatCard icon={icons.truck}  label="Total Pickup Requests"     value={requests.length}      color="blue"   loading={loading} />
        <StatCard icon={icons.clock}  label="Pending Pickups"           value={pending}              color="orange" loading={loading} />
        <StatCard icon={icons.check}  label="Completed Pickups"         value={completed}            color="teal"   loading={loading} />
        <StatCard icon={icons.weight} label="Total E-Waste Weight"      value={loading ? null : `${totalWeight} kg`}  color="purple" loading={loading} />
        <StatCard icon={icons.star}   label="Eco Points Earned"         value={totalPoints}          color="green"  loading={loading} sub="10 pts / kg" />
      </section>

      {/* Quick Actions */}
      <section className="dashboard-actions">
        <h2 className="dashboard-section-title">Quick Actions</h2>
        <div className="dashboard-action-btns">
          <Link to="/register" className="dashboard-action-btn dashboard-action-btn--primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            Register E-Waste Item
          </Link>
          <Link to="/pickups" className="dashboard-action-btn dashboard-action-btn--secondary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
            Schedule Pickup
          </Link>
          <Link to="/rewards" className="dashboard-action-btn dashboard-action-btn--accent">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
            </svg>
            View Eco Rewards
          </Link>
        </div>
      </section>

      {/* Environment Impact */}
      <section className="dashboard-impact">
        <h2 className="dashboard-section-title">🌿 Environmental Impact</h2>
        <div className="dashboard-impact-grid">
          <div className="dashboard-impact-card">
            <span className="dashboard-impact-emoji">🌍</span>
            <strong className="dashboard-impact-value">{loading ? '…' : `${co2Saved} kg`}</strong>
            <span className="dashboard-impact-label">CO₂ Emissions Saved</span>
          </div>
          <div className="dashboard-impact-card">
            <span className="dashboard-impact-emoji">⚙️</span>
            <strong className="dashboard-impact-value">{loading ? '…' : `${metalRecovered} kg`}</strong>
            <span className="dashboard-impact-label">Precious Metals Recovered</span>
          </div>
          <div className="dashboard-impact-card">
            <span className="dashboard-impact-emoji">💧</span>
            <strong className="dashboard-impact-value">{loading ? '…' : `${waterSaved} L`}</strong>
            <span className="dashboard-impact-label">Water Saved</span>
          </div>
        </div>
      </section>

      {/* Recent Items */}
      <section className="dashboard-recent">
        <div className="dashboard-section-header">
          <h2 className="dashboard-section-title">Recent E-Waste Registrations</h2>
          <Link to="/register" className="dashboard-see-all">See all →</Link>
        </div>
        <ItemTable items={recentItems} loading={loading} emptyMessage="No e-waste items registered yet." />
      </section>
    </div>
  );
}
