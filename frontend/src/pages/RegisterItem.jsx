import { useState } from 'react';
import { createItem } from '../services/api';
import ItemTable from '../components/ItemTable';
import { getItems } from '../services/api';
import { useEffect } from 'react';
import './RegisterItem.css';

const ITEM_TYPES = ['Phone', 'SmartPhone', 'Laptop', 'Battery'];
const CATEGORIES = ['Mobile', 'Computer', 'Battery', 'Accessory'];

// Fields shown per item type
const SHOW_FIELDS = {
  Phone:      ['brand', 'model', 'storage', 'operatingSystem'],
  SmartPhone: ['brand', 'model', 'storage', 'ram', 'operatingSystem'],
  Laptop:     ['brand', 'model', 'storage', 'ram', 'operatingSystem'],
  Battery:    ['batteryType', 'capacity'],
};

const FIELD_LABELS = {
  brand: 'Brand',
  model: 'Model',
  storage: 'Storage (GB)',
  ram: 'RAM (GB)',
  operatingSystem: 'Operating System',
  batteryType: 'Battery Type',
  capacity: 'Capacity (mAh)',
};

const EMPTY_FORM = {
  id: '', type: 'Phone', category: 'Mobile', weight: '',
  brand: '', model: '', storage: '', ram: '',
  operatingSystem: '', batteryType: '', capacity: '', description: '',
};

export default function RegisterItem() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success'|'error', message }
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);

  const fetchItems = async () => {
    setLoadingItems(true);
    try {
      const res = await getItems();
      setItems(res.items || []);
    } catch {
      /* silently fail – the table will show empty */
    } finally {
      setLoadingItems(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4500);
  };

  const visibleFields = SHOW_FIELDS[form.type] || [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Auto-set category based on type
    if (name === 'type') {
      const catMap = { Phone: 'Mobile', SmartPhone: 'Mobile', Laptop: 'Computer', Battery: 'Battery' };
      setForm((prev) => ({ ...prev, type: value, category: catMap[value] || prev.category }));
    }
  };

  const validate = () => {
    if (!form.id.trim()) return 'Item ID is required.';
    if (!form.type) return 'Item Type is required.';
    if (!form.category) return 'Category is required.';
    if (!form.weight || isNaN(Number(form.weight)) || Number(form.weight) <= 0)
      return 'Weight must be a positive number.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { showToast('error', err); return; }

    setSubmitting(true);
    try {
      const payload = {
        id: form.id.trim(),
        type: form.type,
        category: form.category,
        weight: parseFloat(form.weight),
        ...(form.brand && { brand: form.brand.trim() }),
        ...(form.model && { model: form.model.trim() }),
        ...(form.storage && { storage: parseInt(form.storage, 10) }),
        ...(form.ram && { ram: parseInt(form.ram, 10) }),
        ...(form.operatingSystem && { operatingSystem: form.operatingSystem.trim() }),
        ...(form.batteryType && { batteryType: form.batteryType.trim() }),
        ...(form.capacity && { capacity: parseInt(form.capacity, 10) }),
        ...(form.description && { description: form.description.trim() }),
      };
      await createItem(payload);
      showToast('success', `✅ Item "${form.id}" registered successfully!`);
      setForm(EMPTY_FORM);
      fetchItems();
    } catch (err) {
      showToast('error', err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="register">
      {/* Toast */}
      {toast && (
        <div className={`register-toast register-toast--${toast.type}`}>
          {toast.type === 'success' ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          )}
          {toast.message}
        </div>
      )}

      {/* Form Card */}
      <div className="register-card">
        <div className="register-card-header">
          <h2>Register New E-Waste Item</h2>
          <p>Fill in the details below to register an electronic waste item in the system.</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form" noValidate>
          {/* Row: ID + Type */}
          <div className="register-row">
            <div className="register-field">
              <label htmlFor="id">Item ID <span className="register-required">*</span></label>
              <input id="id" name="id" value={form.id} onChange={handleChange}
                placeholder="e.g. E001" required />
            </div>
            <div className="register-field">
              <label htmlFor="type">Item Type <span className="register-required">*</span></label>
              <select id="type" name="type" value={form.type} onChange={handleChange}>
                {ITEM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="register-field">
              <label htmlFor="category">Category <span className="register-required">*</span></label>
              <select id="category" name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="register-field">
              <label htmlFor="weight">Weight (kg) <span className="register-required">*</span></label>
              <input id="weight" name="weight" type="number" step="0.01" min="0.01"
                value={form.weight} onChange={handleChange} placeholder="e.g. 1.5" required />
            </div>
          </div>

          {/* Dynamic fields based on type */}
          {visibleFields.length > 0 && (
            <div className="register-row">
              {visibleFields.map((field) => (
                <div className="register-field" key={field}>
                  <label htmlFor={field}>{FIELD_LABELS[field]}</label>
                  <input
                    id={field}
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                    type={['storage', 'ram', 'capacity'].includes(field) ? 'number' : 'text'}
                    min={['storage', 'ram', 'capacity'].includes(field) ? '1' : undefined}
                    placeholder={`Enter ${FIELD_LABELS[field]}`}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Description */}
          <div className="register-field register-field--full">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" rows={3}
              value={form.description} onChange={handleChange}
              placeholder="Optional: describe the condition or any notes about this item..." />
          </div>

          <div className="register-actions">
            <button type="button" className="register-btn register-btn--reset"
              onClick={() => setForm(EMPTY_FORM)} disabled={submitting}>
              Reset
            </button>
            <button type="submit" className="register-btn register-btn--submit" disabled={submitting}>
              {submitting ? (
                <><span className="register-spinner" /> Registering…</>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Register Item
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* All Items Table */}
      <div className="register-table-section">
        <div className="register-table-header">
          <h2>All Registered E-Waste Items</h2>
          <span className="register-count">{loadingItems ? '…' : `${items.length} item${items.length !== 1 ? 's' : ''}`}</span>
        </div>
        <ItemTable items={items} loading={loadingItems} emptyMessage="No items registered yet. Use the form above to add your first item." />
      </div>
    </div>
  );
}
