import './ItemTable.css';

const TYPE_COLORS = {
  Phone: { bg: '#eff6ff', color: '#2563eb' },
  SmartPhone: { bg: '#f0fdf4', color: '#16a34a' },
  Laptop: { bg: '#faf5ff', color: '#7c3aed' },
  Battery: { bg: '#fff7ed', color: '#ea580c' },
};

export default function ItemTable({ items = [], loading = false, emptyMessage = 'No items found.' }) {
  if (loading) {
    return (
      <div className="item-table-wrap">
        <table className="item-table">
          <thead>
            <tr>
              {['Item ID', 'Type', 'Category', 'Brand / Model', 'Weight', 'Registered'].map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 4 }).map((_, i) => (
              <tr key={i}>
                {Array.from({ length: 6 }).map((__, j) => (
                  <td key={j}><div className="item-table-skeleton" /></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="item-table-empty">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="item-table-wrap">
      <table className="item-table">
        <thead>
          <tr>
            <th>Item ID</th>
            <th>Type</th>
            <th>Category</th>
            <th>Brand / Model</th>
            <th>Weight</th>
            <th>Registered</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const tc = TYPE_COLORS[item.type] || { bg: '#f3f4f6', color: '#6b7280' };
            return (
              <tr key={item._id}>
                <td><span className="item-table-code">{item.itemCode}</span></td>
                <td>
                  <span className="item-table-badge" style={{ background: tc.bg, color: tc.color }}>
                    {item.type}
                  </span>
                </td>
                <td>{item.category}</td>
                <td>
                  {item.brand || item.model
                    ? `${item.brand || ''}${item.brand && item.model ? ' ' : ''}${item.model || ''}`
                    : '—'}
                </td>
                <td><strong>{item.weight} kg</strong></td>
                <td>{new Date(item.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
