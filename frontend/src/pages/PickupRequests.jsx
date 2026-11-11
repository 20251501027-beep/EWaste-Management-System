import { useState, useEffect, useCallback } from 'react';
import { getRequests, createRequest } from '../services/api';
import RequestTable from '../components/RequestTable';
import './PickupRequests.css';

const EMPTY_FORM = { address: '', date: '', time: '', status: 'Pending' };

// Time slot options
const TIME_SLOTS = [
  '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
  '04:00 PM', '05:00 PM', '06:00 PM',
];

export default function PickupRequests() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getRequests();
      setRequests(res.requests || []);
    } catch (err) {
      showToast('error', err.message || 'Failed to load pickup requests.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!form.address.trim()) return 'Please enter a pickup address.';
    if (!form.date) return 'Please select a pickup date.';
    if (!form.time) return 'Please select a pickup time.';
    const selectedDate = new Date(form.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) return 'Pickup date cannot be in the past.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { showToast('error', err); return; }

    setSubmitting(true);
    try {
      await createRequest({
        address: form.address.trim(),
        date: form.date,
        time: form.time,
        status: 'Pending',
      });
      showToast('success', '🚛 Pickup request submitted successfully!');
      setForm(EMPTY_FORM);
      fetchRequests();
    } catch (err) {
      showToast('error', err.message || 'Failed to submit pickup request.');
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="pickups">
      {toast && (
        <div className={`pickups-toast pickups-toast--${toast.type}`}>
          {toast.type === 'success' ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          )}
          {toast.message}
        </div>
      )}

      {/* Summary Chips */}
      <div className="pickups-summary">
        {[
          { label: 'Total', value: requests.length, color: 'blue' },
          { label: 'Pending', value: requests.filter((r) => r.status === 'Pending').length, color: 'orange' },
          { label: 'Scheduled', value: requests.filter((r) => r.status === 'Scheduled').length, color: 'blue' },
          { label: 'Completed', value: requests.filter((r) => r.status === 'Completed').length, color: 'green' },
          { label: 'Cancelled', value: requests.filter((r) => r.status === 'Cancelled').length, color: 'red' },
        ].map((s) => (
          <div key={s.label} className={`pickups-chip pickups-chip--${s.color}`}>
            <strong>{loading ? '…' : s.value}</strong> {s.label}
          </div>
        ))}
      </div>

      {/* Form Card */}
      <div className="pickups-card">
        <div className="pickups-card-header">
          <h2>Schedule a New Pickup</h2>
          <p>Fill in your address, date, and preferred time slot for e-waste collection.</p>
        </div>

        <form onSubmit={handleSubmit} className="pickups-form" noValidate>
          <div className="pickups-row">
            <div className="pickups-field pickups-field--wide">
              <label htmlFor="address">Pickup Address <span className="pickups-required">*</span></label>
              <input id="address" name="address" value={form.address} onChange={handleChange}
                placeholder="e.g. 123, Sardar Patel Road, Ahmedabad, Gujarat" />
            </div>
            <div className="pickups-field">
              <label htmlFor="date">Pickup Date <span className="pickups-required">*</span></label>
              <input id="date" name="date" type="date" value={form.date}
                min={today} onChange={handleChange} />
            </div>
            <div className="pickups-field">
              <label htmlFor="time">Pickup Time <span className="pickups-required">*</span></label>
              <select id="time" name="time" value={form.time} onChange={handleChange}>
                <option value="">— Select time slot —</option>
                {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="pickups-actions">
            <button type="button" className="pickups-btn pickups-btn--reset"
              onClick={() => setForm(EMPTY_FORM)} disabled={submitting}>
              Clear
            </button>
            <button type="submit" className="pickups-btn pickups-btn--submit" disabled={submitting}>
              {submitting ? (
                <><span className="pickups-spinner" /> Submitting…</>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                  Schedule Pickup
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Requests Table */}
      <div className="pickups-table-section">
        <div className="pickups-table-header">
          <h2>All Pickup Requests</h2>
          <span className="pickups-count">
            {loading ? '…' : `${requests.length} request${requests.length !== 1 ? 's' : ''}`}
          </span>
        </div>
        <RequestTable requests={requests} loading={loading} onRefresh={fetchRequests} />
      </div>
    </div>
  );
}
