import { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useApiData } from '../../hooks/useApiData.js';
import { api } from '../../services/api.js';
import Modal from '../../components/Modal.jsx';
import { Field, SelectInput, TextArea, TextInput } from '../../components/FormControls.jsx';
import { Alert, EmptyState, ErrorState, PageHeader, PageLoader } from '../../components/States.jsx';
import { formatDate, todayISO } from '../../utils/format.js';
import { StatusBadge, prettyLabel } from './helpers.jsx';

const EMPTY_BOOKING = {
  equipment_id: '',
  facility: '',
  purpose: '',
  requested_date: todayISO(),
  start_time: '09:00',
  end_time: '11:00',
  team_size: 1,
};

const EMPTY_EQUIPMENT = {
  name: '',
  category: '',
  description: '',
  quantity: 1,
  status: 'available',
};

function BookingReview({ booking, onClose, onChanged }) {
  const [status, setStatus] = useState('approved');
  const [note, setNote] = useState(booking.admin_note || '');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    setError('');
    try {
      await api.put(`/innovation/lab/bookings/${booking.id}`, { status, admin_note: note || null });
      await onChanged();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      title="Review lab booking"
      size="lg"
      footer={(
        <div className="flex justify-end gap-2">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="button" className="btn btn-primary" onClick={save} disabled={busy}>
            {busy ? 'Saving...' : 'Save decision'}
          </button>
        </div>
      )}
    >
      <div className="space-y-4">
        <Alert type="error" message={error} onClose={() => setError('')} />
        <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
          <p className="font-semibold">{booking.user_name}</p>
          <p className="mt-1">{booking.equipment_name || booking.facility || 'IDEA Lab facility'}</p>
          <p className="mt-1">{formatDate(booking.requested_date)} · {booking.start_time}–{booking.end_time} · {booking.team_size} person(s)</p>
          <p className="mt-2 whitespace-pre-wrap text-slate-600">{booking.purpose}</p>
        </div>
        <Field label="Decision">
          <SelectInput value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="approved">Approve</option>
            <option value="rejected">Reject</option>
            <option value="completed">Mark completed</option>
          </SelectInput>
        </Field>
        <Field label="Admin note">
          <TextArea rows={3} value={note} onChange={(event) => setNote(event.target.value)} />
        </Field>
      </div>
    </Modal>
  );
}

export default function InnovationLabPage() {
  const { user } = useAuth();
  const equipmentQuery = useApiData('/innovation/lab/equipment');
  const bookingsQuery = useApiData('/innovation/lab/bookings');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState(EMPTY_BOOKING);
  const [equipmentOpen, setEquipmentOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [equipmentForm, setEquipmentForm] = useState(EMPTY_EQUIPMENT);
  const [reviewing, setReviewing] = useState(null);
  const [busy, setBusy] = useState(false);

  const equipment = useMemo(() => equipmentQuery.data?.equipment || [], [equipmentQuery.data]);
  const bookings = useMemo(() => bookingsQuery.data?.bookings || [], [bookingsQuery.data]);
  const isAdmin = user.role === 'admin';
  const availableEquipment = useMemo(
    () => equipment.filter((item) => item.status === 'available'),
    [equipment],
  );

  async function submitBooking(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api.post('/innovation/lab/bookings', {
        ...bookingForm,
        equipment_id: bookingForm.equipment_id ? Number(bookingForm.equipment_id) : null,
        facility: bookingForm.facility || null,
        team_size: Number(bookingForm.team_size),
      });
      setBookingOpen(false);
      setNotice('Lab booking request submitted for review.');
      await bookingsQuery.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function cancelBooking(booking) {
    if (!window.confirm('Cancel this lab booking?')) return;
    setBusy(true);
    setError('');
    try {
      await api.post(`/innovation/lab/bookings/${booking.id}/cancel`);
      await bookingsQuery.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  function openEquipmentCreate() {
    setEditingEquipment(null);
    setEquipmentForm(EMPTY_EQUIPMENT);
    setEquipmentOpen(true);
  }

  function openEquipmentEdit(item) {
    setEditingEquipment(item);
    setEquipmentForm({
      name: item.name || '',
      category: item.category || '',
      description: item.description || '',
      quantity: item.quantity || 1,
      status: item.status || 'available',
    });
    setEquipmentOpen(true);
  }

  async function saveEquipment(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const payload = { ...equipmentForm, quantity: Number(equipmentForm.quantity) };
      if (editingEquipment) {
        await api.put(`/innovation/lab/equipment/${editingEquipment.id}`, payload);
      } else {
        await api.post('/innovation/lab/equipment', payload);
      }
      setEquipmentOpen(false);
      await equipmentQuery.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function deleteEquipment(item) {
    if (!window.confirm(`Remove "${item.name}" from the equipment inventory?`)) return;
    setBusy(true);
    setError('');
    try {
      await api.del(`/innovation/lab/equipment/${item.id}`);
      await equipmentQuery.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (equipmentQuery.loading || bookingsQuery.loading) return <PageLoader label="Loading IDEA Lab..." />;
  if (equipmentQuery.error) return <ErrorState message={equipmentQuery.error} onRetry={equipmentQuery.reload} />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="AICTE IDEA Lab"
        subtitle="Discover fabrication equipment, request lab time, and track approvals."
        action={(
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn-primary" onClick={() => setBookingOpen(true)}>Book lab slot</button>
            {isAdmin && <button type="button" className="btn btn-secondary" onClick={openEquipmentCreate}>Add equipment</button>}
          </div>
        )}
      />

      <div className="space-y-3">
        <Alert type="error" message={error} onClose={() => setError('')} />
        <Alert type="success" message={notice} onClose={() => setNotice('')} />
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-900">Equipment inventory</h2>
        {equipment.length === 0 ? (
          <div className="card">
            <EmptyState
              title="No equipment listed"
              message="The IDEA Lab inventory will appear here."
              action={isAdmin ? <button type="button" className="btn btn-primary" onClick={openEquipmentCreate}>Add equipment</button> : null}
            />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {equipment.map((item) => (
              <article key={item.id} className="card flex flex-col p-5">
                <div className="flex items-start justify-between gap-2">
                  <span className="badge bg-slate-100 text-slate-600">{item.category}</span>
                  <StatusBadge value={item.status} />
                </div>
                <h3 className="mt-3 font-semibold text-slate-900">{item.name}</h3>
                <p className="mt-1 flex-1 text-sm leading-6 text-slate-600">{item.description || 'No description.'}</p>
                <p className="mt-2 text-xs text-slate-500">Quantity: {item.quantity}</p>
                {isAdmin && (
                  <div className="mt-3 flex gap-2 border-t border-slate-100 pt-3">
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => openEquipmentEdit(item)}>Edit</button>
                    <button type="button" className="btn btn-danger btn-sm" onClick={() => deleteEquipment(item)} disabled={busy}>Remove</button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="card overflow-hidden">
        <div className="border-b border-slate-200 p-5">
          <h2 className="text-lg font-semibold text-slate-900">{isAdmin ? 'All lab bookings' : 'My lab bookings'}</h2>
          <p className="text-sm text-slate-500">Approve, reject, complete, or cancel lab time requests.</p>
        </div>
        {bookings.length === 0 ? (
          <EmptyState title="No lab bookings" message="Book equipment or a lab facility to get started." />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="th">Requester</th>
                  <th className="th">Resource</th>
                  <th className="th">Schedule</th>
                  <th className="th">Purpose</th>
                  <th className="th">Status</th>
                  <th className="th text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="td">
                      <p className="font-medium text-slate-900">{booking.user_name}</p>
                      <p className="text-xs text-slate-500">{booking.team_size} person(s)</p>
                    </td>
                    <td className="td">
                      <p>{booking.equipment_name || booking.facility || 'IDEA Lab'}</p>
                      {booking.equipment_category && <p className="text-xs text-slate-500">{booking.equipment_category}</p>}
                    </td>
                    <td className="td text-sm">
                      <p>{formatDate(booking.requested_date)}</p>
                      <p className="text-xs text-slate-500">{booking.start_time}–{booking.end_time}</p>
                    </td>
                    <td className="td max-w-xs">
                      <p className="line-clamp-2 text-sm text-slate-600">{booking.purpose}</p>
                      {booking.admin_note && <p className="mt-1 text-xs text-amber-700">{booking.admin_note}</p>}
                    </td>
                    <td className="td"><StatusBadge value={booking.status} /></td>
                    <td className="td text-right">
                      <div className="flex justify-end gap-1.5">
                        {isAdmin && booking.status === 'pending' && (
                          <button type="button" className="btn btn-primary btn-sm" onClick={() => setReviewing(booking)}>Review</button>
                        )}
                        {isAdmin && booking.status === 'approved' && (
                          <button type="button" className="btn btn-secondary btn-sm" onClick={() => setReviewing(booking)}>Update</button>
                        )}
                        {!['completed', 'cancelled', 'rejected'].includes(booking.status)
                          && (isAdmin || booking.user_id === user.id) && (
                          <button type="button" className="btn btn-danger btn-sm" onClick={() => cancelBooking(booking)} disabled={busy}>
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <Modal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        title="Book IDEA Lab time"
        size="lg"
        footer={(
          <div className="flex justify-end gap-2">
            <button type="button" className="btn btn-secondary" onClick={() => setBookingOpen(false)}>Cancel</button>
            <button type="button" className="btn btn-primary" onClick={submitBooking} disabled={busy}>
              {busy ? 'Submitting...' : 'Submit request'}
            </button>
          </div>
        )}
      >
        <form className="space-y-4" onSubmit={submitBooking}>
          <Alert type="error" message={error} onClose={() => setError('')} />
          <Field label="Equipment" hint="Leave blank to request a general lab facility.">
            <SelectInput
              value={bookingForm.equipment_id}
              onChange={(event) => setBookingForm({ ...bookingForm, equipment_id: event.target.value })}
            >
              <option value="">General lab facility</option>
              {availableEquipment.map((item) => (
                <option key={item.id} value={item.id}>{item.name} — {item.category}</option>
              ))}
            </SelectInput>
          </Field>
          <Field label="Facility / workbench" hint="Required if no equipment is selected.">
            <TextInput
              value={bookingForm.facility}
              onChange={(event) => setBookingForm({ ...bookingForm, facility: event.target.value })}
              placeholder="3D printing bay, electronics bench..."
              maxLength={160}
              required={!bookingForm.equipment_id}
            />
          </Field>
          <Field label="Purpose">
            <TextArea
              rows={3}
              value={bookingForm.purpose}
              onChange={(event) => setBookingForm({ ...bookingForm, purpose: event.target.value })}
              required
              minLength={10}
              maxLength={3000}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Date">
              <TextInput
                type="date"
                min={todayISO()}
                value={bookingForm.requested_date}
                onChange={(event) => setBookingForm({ ...bookingForm, requested_date: event.target.value })}
                required
              />
            </Field>
            <Field label="Start time">
              <TextInput
                type="time"
                value={bookingForm.start_time}
                onChange={(event) => setBookingForm({ ...bookingForm, start_time: event.target.value })}
                required
              />
            </Field>
            <Field label="End time">
              <TextInput
                type="time"
                value={bookingForm.end_time}
                onChange={(event) => setBookingForm({ ...bookingForm, end_time: event.target.value })}
                required
              />
            </Field>
          </div>
          <Field label="Team size">
            <TextInput
              type="number"
              min="1"
              max="100"
              value={bookingForm.team_size}
              onChange={(event) => setBookingForm({ ...bookingForm, team_size: event.target.value })}
            />
          </Field>
        </form>
      </Modal>

      <Modal
        open={equipmentOpen}
        onClose={() => setEquipmentOpen(false)}
        title={editingEquipment ? 'Edit equipment' : 'Add IDEA Lab equipment'}
        size="lg"
        footer={(
          <div className="flex justify-end gap-2">
            <button type="button" className="btn btn-secondary" onClick={() => setEquipmentOpen(false)}>Cancel</button>
            <button type="button" className="btn btn-primary" onClick={saveEquipment} disabled={busy}>
              {busy ? 'Saving...' : 'Save equipment'}
            </button>
          </div>
        )}
      >
        <form className="space-y-4" onSubmit={saveEquipment}>
          <Alert type="error" message={error} onClose={() => setError('')} />
          <Field label="Equipment name">
            <TextInput value={equipmentForm.name} onChange={(event) => setEquipmentForm({ ...equipmentForm, name: event.target.value })} required maxLength={160} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category">
              <TextInput value={equipmentForm.category} onChange={(event) => setEquipmentForm({ ...equipmentForm, category: event.target.value })} required maxLength={80} />
            </Field>
            <Field label="Quantity">
              <TextInput
                type="number"
                min="1"
                value={equipmentForm.quantity}
                onChange={(event) => setEquipmentForm({ ...equipmentForm, quantity: event.target.value })}
              />
            </Field>
          </div>
          <Field label="Description">
            <TextArea rows={3} value={equipmentForm.description} onChange={(event) => setEquipmentForm({ ...equipmentForm, description: event.target.value })} maxLength={3000} />
          </Field>
          <Field label="Status">
            <SelectInput value={equipmentForm.status} onChange={(event) => setEquipmentForm({ ...equipmentForm, status: event.target.value })}>
              {['available', 'maintenance', 'retired'].map((status) => (
                <option key={status} value={status}>{prettyLabel(status)}</option>
              ))}
            </SelectInput>
          </Field>
        </form>
      </Modal>

      {reviewing && (
        <BookingReview
          booking={reviewing}
          onClose={() => setReviewing(null)}
          onChanged={bookingsQuery.reload}
        />
      )}
    </div>
  );
}
