import './StatCard.css';

export default function StatCard({ icon, label, value, sub, color = 'green', loading = false }) {
  const colorMap = {
    green: { bg: '#f0fdf4', icon: '#16a34a', border: '#bbf7d0' },
    blue: { bg: '#eff6ff', icon: '#2563eb', border: '#bfdbfe' },
    orange: { bg: '#fff7ed', icon: '#ea580c', border: '#fed7aa' },
    red: { bg: '#fef2f2', icon: '#dc2626', border: '#fecaca' },
    purple: { bg: '#faf5ff', icon: '#7c3aed', border: '#e9d5ff' },
    teal: { bg: '#f0fdfa', icon: '#0d9488', border: '#99f6e4' },
  };
  const c = colorMap[color] || colorMap.green;

  return (
    <div className="stat-card" style={{ '--card-bg': c.bg, '--card-border': c.border }}>
      <div className="stat-card-icon" style={{ background: c.bg, border: `1.5px solid ${c.border}` }}>
        <span style={{ color: c.icon }}>{icon}</span>
      </div>
      <div className="stat-card-body">
        <span className="stat-card-label">{label}</span>
        {loading ? (
          <div className="stat-card-skeleton" />
        ) : (
          <span className="stat-card-value">{value ?? '—'}</span>
        )}
        {sub && <span className="stat-card-sub">{sub}</span>}
      </div>
    </div>
  );
}
