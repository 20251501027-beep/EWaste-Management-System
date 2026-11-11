import { useState } from 'react';
import { updateRequestStatus, deleteRequest } from '../services/api';
import './RequestTable.css';

const STATUS_CONFIG = {
  Pending: { bg: '#fff7ed', color: '#ea580c', border: '#fed7aa' },
  Scheduled: { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
  Completed: { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
  Cancelled: { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
};

const STATUSES = ['Pending', 'Scheduled', 'Completed', 'Cancelled'];

export default function RequestTable({ requests = [], loading = false, onRefresh }) {
  const [updating, setUpdating] = useState(null);
  const [deleting, setDeleting] = useState(null);

  async function handleStatusChange(id, status) {
    setUpdating(id);
    try {
      await updateRequestStatus(id, status);
      onRefresh?.();
    } catch (err) {
      alert(err.message || 'Failed to update status');
    } finally {
      setUpdating(null);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this pickup request?')) return;
    setDeleting(id);
    try {
      await deleteRequest(id);
      onRefresh?.();
    } catch (err) {
      alert(err.message || 'Failed to delete request');
    } finally {
      setDeleting(null);
    }
  }

  if (loading) {
    return (
      <div className="req-table-wrap">
        <table className="req-table">
          <thead>
            <tr>
              {['Address', 'Date', 'Time', 'Status', 'Actions'].map((h) => <th key={h}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 3 }).map((_, i) => (
              <tr key={i}>
                {Array.from({ length: 5 }).map((__, j) => (
                  <td key={j}><div className="req-table-skeleton" /></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!requests.length) {
    return (
      <div className="req-table-empty">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5">
          <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
          <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
        <p>No pickup requests yet. Submit your first request above!</p>
      </div>
    );
  }

  return (
    <div className="req-table-wrap">
      <table className="req-table">
        <thead>
          <tr>
            <th>Address</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Change Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => {
            const sc = STATUS_CONFIG[req.status] || STATUS_CONFIG.Pending;
            return (
              <tr key={req._id}>
                <td className="req-table-address">{req.address}</td>
                <td>{req.date}</td>
                <td>{req.time}</td>
                <td>
                  <span
                    className="req-table-badge"
                    style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}
                  >
                    {req.status}
                  </span>
                </td>
                <td>
                  <select
                    className="req-table-select"
                    value={req.status}
                    disabled={updating === req._id}
                    onChange={(e) => handleStatusChange(req._id, e.target.value)}
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td>
                  <button
                    className="req-table-delete"
                    disabled={deleting === req._id}
                    onClick={() => handleDelete(req._id)}
                    aria-label="Delete request"
                  >
                    {deleting === req._id ? (
                      <span className="req-spinner" />
                    ) : (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14H6L5 6" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M9 6V4h6v2" />
                      </svg>
                    )}
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
