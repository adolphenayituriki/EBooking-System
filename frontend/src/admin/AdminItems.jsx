import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaSpinner, FaTrash, FaTimes, FaEdit } from 'react-icons/fa';
import { getRooms, getServices, getHalls, adminCreateItem, adminUpdateItem, adminDeleteItem } from '../services/api';
import { formatPrice } from '../utils/format';

const configs = {
  rooms: {
    title: 'Rooms',
    listApi: getRooms,
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'type', label: 'Type' },
      { key: 'price', label: 'Price', render: (r) => formatPrice(r.price) },
      { key: 'capacity', label: 'Capacity' },
      { key: 'floor', label: 'Floor' },
    ],
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'type', label: 'Type', type: 'select', options: ['Single', 'Double', 'Suite', 'Deluxe', 'Presidential'], required: true },
      { name: 'price', label: 'Price (thousands RWF)', type: 'number', required: true },
      { name: 'capacity', label: 'Capacity', type: 'number' },
      { name: 'floor', label: 'Floor', type: 'number' },
      { name: 'amenities', label: 'Amenities (comma separated)', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
    ],
  },
  services: {
    title: 'Services',
    listApi: getServices,
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'category', label: 'Category' },
      { key: 'price', label: 'Price', render: (s) => formatPrice(s.price) },
      { key: 'duration', label: 'Duration' },
    ],
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'select', options: ['Massage', 'Spa', 'Dining', 'Fitness', 'Swimming', 'Laundry', 'Transport', 'Other'], required: true },
      { name: 'price', label: 'Price (thousands RWF)', type: 'number', required: true },
      { name: 'duration', label: 'Duration', type: 'text' },
      { name: 'image', label: 'Image URL (e.g. https://images.unsplash.com/photo-...)', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
    ],
  },
  halls: {
    title: 'Halls',
    listApi: getHalls,
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'type', label: 'Type' },
      { key: 'capacity', label: 'Capacity' },
      { key: 'price', label: 'Price', render: (h) => formatPrice(h.price) },
    ],
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'type', label: 'Type', type: 'select', options: ['Conference', 'Wedding', 'Banquet', 'Meeting', 'Garden'], required: true },
      { name: 'capacity', label: 'Capacity', type: 'number', required: true },
      { name: 'price', label: 'Price (thousands RWF)', type: 'number', required: true },
      { name: 'images', label: 'Image URL (one, or comma-separated)', type: 'text' },
      { name: 'amenities', label: 'Amenities (comma separated)', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
    ],
  },
};

export default function AdminItems({ type }) {
  const config = configs[type];
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    config.listApi()
      .then(setItems)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [config]);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => {
    const form = {};
    config.fields.forEach((f) => { form[f.name] = f.type === 'number' ? '' : ''; });
    setModal({ id: null, form });
  };

  const openEdit = (item) => {
    const form = {};
    config.fields.forEach((f) => {
      let value = item[f.name];
      if ((f.name === 'amenities' || f.name === 'images') && Array.isArray(value)) value = value.join(', ');
      form[f.name] = value ?? '';
    });
    setModal({ id: item._id, form });
  };

  const save = () => {
    setBusy(true);
    const payload = { ...modal.form };
    config.fields.forEach((f) => {
      if (f.name === 'amenities') payload.amenities = String(payload.amenities || '').split(',').map((s) => s.trim()).filter(Boolean);
      if (f.name === 'images') payload.images = String(payload.images || '').split(',').map((s) => s.trim()).filter(Boolean);
      if (f.type === 'number') payload[f.name] = payload[f.name] === '' ? undefined : Number(payload[f.name]);
    });
    const request = modal.id
      ? adminUpdateItem(type, modal.id, payload)
      : adminCreateItem(type, payload);
    request
      .then(() => {
        toast.success(modal.id ? `${config.title.slice(0, -1)} updated` : `${config.title.slice(0, -1)} created`);
        setModal(null);
        load();
      })
      .catch((e) => toast.error(e.message))
      .finally(() => setBusy(false));
  };

  const remove = () => {
    setBusy(true);
    adminDeleteItem(type, confirmDelete._id)
      .then(() => { toast.success('Item deleted'); setConfirmDelete(null); load(); })
      .catch((e) => toast.error(e.message))
      .finally(() => setBusy(false));
  };

  const setField = (name, value) => setModal((m) => ({ ...m, form: { ...m.form, [name]: value } }));

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">{config.title}</h1>
          <p className="text-gray-500 text-sm mt-1">Manage the {config.title.toLowerCase()} displayed on the site.</p>
        </div>
        <button onClick={openAdd} className="btn-primary !py-2.5 !px-4 text-sm">
          <FaPlus className="text-xs" /> Add {config.title.slice(0, -1)}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><FaSpinner className="animate-spin text-gray-400 text-2xl" /></div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-card">
          <p className="font-semibold text-gray-600">No {config.title.toLowerCase()} yet</p>
          <p className="text-gray-400 text-sm mt-1">Click "Add {config.title.slice(0, -1)}" to create one.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                  {config.columns.map((c) => <th key={c.key} className="px-5 py-3.5 font-medium">{c.label}</th>)}
                  <th className="px-5 py-3.5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50/60 transition-colors">
                    {config.columns.map((c) => (
                      <td key={c.key} className="px-5 py-3.5">
                        {c.render ? c.render(item) : <span className={c.key === 'name' ? 'font-semibold text-gray-900' : 'text-gray-600'}>{item[c.key] ?? '—'}</span>}
                      </td>
                    ))}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(item)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-black hover:bg-gray-100 transition-colors" aria-label="Edit">
                          <FaEdit className="text-xs" />
                        </button>
                        <button onClick={() => setConfirmDelete(item)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors" aria-label="Delete">
                          <FaTrash className="text-xs" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit modal */}
      {modal && (
        <div className="overlay" onClick={() => setModal(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-modal animate-scale-in flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-display font-bold text-gray-900 text-lg">{modal.id ? 'Edit' : 'Add'} {config.title.slice(0, -1)}</h3>
              <button onClick={() => setModal(null)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100" aria-label="Close">
                <FaTimes className="text-xs" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {config.fields.map((f) => (
                <div key={f.name}>
                  <label className="input-label">{f.label}{f.required ? ' *' : ''}</label>
                  {f.type === 'textarea' ? (
                    <textarea rows={3} value={modal.form[f.name] || ''} onChange={(e) => setField(f.name, e.target.value)} className="input-field" />
                  ) : f.type === 'select' ? (
                    <select value={modal.form[f.name] || ''} onChange={(e) => setField(f.name, e.target.value)} className="input-field cursor-pointer">
                      <option value="">Select...</option>
                      {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input
                      type={f.type === 'number' ? 'number' : 'text'}
                      value={modal.form[f.name] || ''}
                      onChange={(e) => setField(f.name, e.target.value)}
                      className="input-field"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={() => setModal(null)} className="btn-outline flex-1 !py-2.5">Cancel</button>
              <button onClick={save} disabled={busy} className="btn-primary flex-1 !py-2.5">
                {busy ? <FaSpinner className="animate-spin" /> : modal.id ? 'Save changes' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm modal */}
      {confirmDelete && (
        <div className="overlay" onClick={() => setConfirmDelete(null)}>
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-modal animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display font-bold text-gray-900 text-lg mb-3">Delete {confirmDelete.name}?</h3>
            <p className="text-gray-500 text-sm">This will permanently remove this {config.title.slice(0, -1).toLowerCase()} from the site.</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setConfirmDelete(null)} className="btn-outline flex-1 !py-2.5">Cancel</button>
              <button onClick={remove} disabled={busy} className="btn-primary flex-1 !py-2.5 bg-red-500 hover:bg-red-600">
                {busy ? <FaSpinner className="animate-spin" /> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
