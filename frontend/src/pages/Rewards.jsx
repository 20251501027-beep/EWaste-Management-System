import { useState, useEffect } from 'react';
import { getItems } from '../services/api';
import { calculateEcoRewards, calculateEnvironmentalImpact } from '../utils/rewards';
import './Rewards.css';

// Reward tiers
const TIERS = [
  { label: 'Bronze Eco Warrior',  min: 0,   max: 99,   emoji: '🥉', color: '#92400e', bg: '#fef3c7', border: '#fde68a' },
  { label: 'Silver Eco Hero',     min: 100,  max: 299,  emoji: '🥈', color: '#475569', bg: '#f1f5f9', border: '#cbd5e1' },
  { label: 'Gold Eco Champion',   min: 300,  max: 699,  emoji: '🥇', color: '#92400e', bg: '#fefce8', border: '#fde047' },
  { label: 'Platinum Eco Legend', min: 700,  max: Infinity, emoji: '💎', color: '#1e40af', bg: '#eff6ff', border: '#93c5fd' },
];

function getTier(points) {
  return TIERS.find((t) => points >= t.min && points <= t.max) || TIERS[0];
}

function ProgressBar({ value, max, color }) {
  const pct = max === Infinity ? 100 : Math.min(100, (value / max) * 100);
  return (
    <div className="rewards-progress-track">
      <div className="rewards-progress-fill" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

export default function Rewards() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getItems()
      .then((res) => setItems(res.items || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const { totalPoints, totalWeight } = calculateEcoRewards(items);
  const { co2Saved, metalRecovered, waterSaved } = calculateEnvironmentalImpact(totalWeight);
  const tier = getTier(totalPoints);

  // Per-type weight breakdown
  const typeBreakdown = items.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + item.weight;
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="rewards rewards--loading">
        <div className="rewards-spinner-large" />
        <p>Loading your eco rewards…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rewards rewards--error">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fca5a5" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <p>Could not load data: <strong>{error}</strong></p>
        <p style={{ fontSize: '13px', color: '#9ca3af' }}>Make sure the backend is running at localhost:8080</p>
      </div>
    );
  }

  return (
    <div className="rewards">
      {/* Hero Card */}
      <div className="rewards-hero" style={{ background: `linear-gradient(135deg, ${tier.bg}, #fff)`, borderColor: tier.border }}>
        <div className="rewards-hero-left">
          <span className="rewards-tier-emoji">{tier.emoji}</span>
          <div>
            <span className="rewards-tier-label" style={{ color: tier.color }}>{tier.label}</span>
            <h1 className="rewards-points">{totalPoints.toLocaleString()}</h1>
            <p className="rewards-points-label">Total Eco Points Earned</p>
          </div>
        </div>
        <div className="rewards-hero-right">
          <div className="rewards-weight-bubble">
            <strong>{totalWeight} kg</strong>
            <span>E-Waste Recycled</span>
          </div>
          <div className="rewards-items-bubble">
            <strong>{items.length}</strong>
            <span>Items Registered</span>
          </div>
        </div>
      </div>

      {/* Tier Progress */}
      <div className="rewards-card">
        <h2 className="rewards-card-title">🏅 Tier Progress</h2>
        <div className="rewards-tiers">
          {TIERS.map((t) => {
            const active = t.label === tier.label;
            const done = totalPoints > t.max;
            return (
              <div key={t.label}
                className={`rewards-tier-item${active ? ' rewards-tier-item--active' : ''}${done ? ' rewards-tier-item--done' : ''}`}
                style={active ? { borderColor: t.border, background: t.bg } : {}}
              >
                <span className="rewards-tier-item-emoji">{t.emoji}</span>
                <span className="rewards-tier-item-name">{t.label}</span>
                <span className="rewards-tier-item-range">
                  {t.max === Infinity ? `${t.min}+ pts` : `${t.min}–${t.max} pts`}
                </span>
                {active && <span className="rewards-tier-current">Current</span>}
                {done && <span className="rewards-tier-done">✓ Achieved</span>}
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6b7280', marginBottom: 6 }}>
            <span>{totalPoints} pts earned</span>
            <span>{tier.max === Infinity ? 'Max tier!' : `${tier.max} pts to next tier`}</span>
          </div>
          <ProgressBar value={totalPoints - tier.min} max={tier.max === Infinity ? totalPoints || 1 : tier.max - tier.min} color="#22c55e" />
        </div>
      </div>

      {/* Environmental Impact */}
      <div className="rewards-card">
        <h2 className="rewards-card-title">🌿 Your Environmental Impact</h2>
        <div className="rewards-impact-grid">
          <div className="rewards-impact-item">
            <div className="rewards-impact-icon">🌍</div>
            <strong className="rewards-impact-value" style={{ color: '#16a34a' }}>{co2Saved} kg</strong>
            <span className="rewards-impact-label">CO₂ Emissions Saved</span>
          </div>
          <div className="rewards-impact-item">
            <div className="rewards-impact-icon">⚙️</div>
            <strong className="rewards-impact-value" style={{ color: '#7c3aed' }}>{metalRecovered} kg</strong>
            <span className="rewards-impact-label">Precious Metals Recovered</span>
          </div>
          <div className="rewards-impact-item">
            <div className="rewards-impact-icon">💧</div>
            <strong className="rewards-impact-value" style={{ color: '#0d9488' }}>{waterSaved} L</strong>
            <span className="rewards-impact-label">Water Saved</span>
          </div>
        </div>
        <div className="rewards-cpp-note">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          Reward calculation: 10 pts/kg (provisional). C++ OOP module integration ready.
        </div>
      </div>

      {/* Breakdown by Type */}
      {Object.keys(typeBreakdown).length > 0 && (
        <div className="rewards-card">
          <h2 className="rewards-card-title">📦 E-Waste Breakdown by Type</h2>
          <div className="rewards-breakdown">
            {Object.entries(typeBreakdown).map(([type, weight]) => {
              const pts = Math.round(weight * 10);
              const pct = totalWeight > 0 ? (weight / totalWeight) * 100 : 0;
              return (
                <div key={type} className="rewards-breakdown-row">
                  <span className="rewards-breakdown-type">{type}</span>
                  <div className="rewards-breakdown-bar-wrap">
                    <div className="rewards-breakdown-bar" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="rewards-breakdown-weight">{weight.toFixed(2)} kg</span>
                  <span className="rewards-breakdown-pts">+{pts} pts</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {items.length === 0 && (
        <div className="rewards-empty">
          <span style={{ fontSize: 56 }}>🌱</span>
          <h3>No eco rewards yet</h3>
          <p>Register your first e-waste item to start earning eco points and tracking your environmental impact!</p>
        </div>
      )}
    </div>
  );
}
