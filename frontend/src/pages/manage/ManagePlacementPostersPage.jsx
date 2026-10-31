import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useApiData } from '../../hooks/useApiData.js';
import { api, API_BASE } from '../../services/api.js';
import DataTable from '../../components/DataTable.jsx';
import Modal from '../../components/Modal.jsx';
import { Alert, ErrorState, PageHeader, PageLoader } from '../../components/States.jsx';
import { Field, SelectInput, TextArea, TextInput } from '../../components/FormControls.jsx';
import { formatDate, todayISO } from '../../utils/format.js';

const MAX_IMAGE_BYTES = 3 * 1024 * 1024;
const MAX_DIMENSION = 1800;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const EMPTY_FORM = {
  title: '',
  company: '',
  drive_date: '',
  venue: '',
  eligibility: '',
  registration_deadline: '',
  description: '',
  apply_url: '',
  department_id: '',
};

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Could not process the selected image'))),
      type,
      quality,
    );
  });
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not read the selected image'));
    };
    image.src = url;
  });
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Could not read the selected image'));
    reader.readAsDataURL(blob);
  });
}

async function preparePosterImage(file) {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    throw new Error('Choose a PNG, JPEG, or WebP poster image');
  }

  const image = await loadImage(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);

  let quality = 0.9;
  let blob = await canvasToBlob(canvas, 'image/jpeg', quality);
  while (blob.size > MAX_IMAGE_BYTES && quality > 0.45) {
    quality -= 0.1;
    blob = await canvasToBlob(canvas, 'image/jpeg', quality);
  }

  if (blob.size > MAX_IMAGE_BYTES) {
    throw new Error('Poster image is too large. Use a smaller image.');
  }

  return blobToDataUrl(blob);
}

export default function ManagePlacementPostersPage() {
  const { user } = useAuth();
  const posters = useApiData('/placement-posters');
  const departments = useApiData('/departments');

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageData, setImageData] = useState('');
  const [processingImage, setProcessingImage] = useState(false);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');

  const canManage = user?.role === 'admin' || (user?.role === 'faculty' && user?.is_cdc);
  const rows = posters.data?.posters || [];
  const today = todayISO();
  const departmentOptions = (departments.data?.departments || []).map((department) => ({
    value: department.id,
    label: `${department.code} · ${department.name}`,
  }));

  if (!canManage) {
    return (
      <ErrorState message="Only CDC faculty and administrators can manage placement posters." />
    );
  }
  if (posters.loading) return <PageLoader />;
  if (posters.error) return <ErrorState message={posters.error} onRetry={posters.reload} />;

  function openCreate() {
    setForm(EMPTY_FORM);
    setImageData('');
    setFormError('');
    setModalOpen(true);
  }

  function closeModal() {
    if (saving || processingImage) return;
    setModalOpen(false);
  }

  async function handleImageChange(event) {
    const file = event.target.files?.[0];
    setFormError('');
    setImageData('');
    if (!file) return;

    setProcessingImage(true);
    try {
      setImageData(await preparePosterImage(file));
    } catch (err) {
      setFormError(err.message);
      event.target.value = '';
    } finally {
      setProcessingImage(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!imageData) {
      setFormError('Upload the placement poster image');
      return;
    }

    setSaving(true);
    setFormError('');
    try {
      await api.post('/placement-posters', {
        title: form.title.trim(),
        company: form.company.trim(),
        drive_date: form.drive_date,
        venue: form.venue.trim(),
        eligibility: form.eligibility.trim(),
        registration_deadline: form.registration_deadline || null,
        description: form.description.trim() || null,
        apply_url: form.apply_url.trim() || null,
        department_id: form.department_id ? Number(form.department_id) : null,
        image_data: imageData,
      });
      setNotice('Placement poster published');
      setModalOpen(false);
      await posters.reload();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(row) {
    if (!window.confirm(`Remove the placement poster for "${row.company}"?`)) return;
    try {
      await api.del(`/placement-posters/${row.id}`);
      setNotice('Placement poster removed');
      await posters.reload();
    } catch (err) {
      window.alert(err.message);
    }
  }

  return (
    <div>
      <PageHeader
        title="Placement Posters"
        subtitle="Publish official CDC posters for upcoming placement pool drives. Only administrators and CDC faculty can post."
        action={<button type="button" className="btn btn-primary" onClick={openCreate}>Add poster</button>}
      />

      {notice && (
        <div className="mb-4">
          <Alert type="success" message={notice} onClose={() => setNotice('')} />
        </div>
      )}

      <DataTable
        rows={rows}
        searchKeys={['title', 'company', 'venue', 'posted_by_name']}
        searchPlaceholder="Search posters..."
        emptyTitle="No placement posters yet"
        emptyMessage="Upload the first official placement drive poster to publish it on the placement page."
        columns={[
          {
            key: 'poster',
            label: 'Poster',
            render: (row) => (
              <img
                src={`${API_BASE}/public/placement-posters/${row.id}/image`}
                alt={`${row.company} placement poster`}
                className="h-20 w-16 rounded border border-slate-200 bg-slate-100 object-cover"
                loading="lazy"
              />
            ),
          },
          {
            key: 'title',
            label: 'Drive',
            render: (row) => (
              <div>
                <p className="font-medium text-slate-900">{row.title}</p>
                <p className="text-xs text-slate-500">{row.company}</p>
              </div>
            ),
          },
          { key: 'drive_date', label: 'Drive date', render: (row) => formatDate(row.drive_date) },
          { key: 'venue', label: 'Venue' },
          {
            key: 'registration_deadline',
            label: 'Apply by',
            render: (row) => (row.registration_deadline ? formatDate(row.registration_deadline) : '—'),
          },
          { key: 'department_name', label: 'Department', render: (row) => row.department_name || 'All departments' },
          { key: 'posted_by_name', label: 'Posted by', render: (row) => row.posted_by_name || '—' },
          {
            key: 'status',
            label: 'Status',
            render: (row) => (
              <span className={`badge ${row.drive_date >= today ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                {row.drive_date >= today ? 'Upcoming' : 'Past'}
              </span>
            ),
          },
        ]}
        actions={(row) => (
          (user?.role === 'admin' || row.posted_by === user?.id) ? (
            <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDelete(row)}>
              Delete
            </button>
          ) : null
        )}
      />

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title="Publish placement poster"
        size="lg"
        footer={
          <div className="flex justify-end gap-2">
            <button type="button" className="btn btn-secondary" onClick={closeModal} disabled={saving}>
              Cancel
            </button>
            <button
              type="submit"
              form="placement-poster-form"
              className="btn btn-primary"
              disabled={saving || processingImage}
            >
              {saving ? 'Publishing...' : processingImage ? 'Processing image...' : 'Publish poster'}
            </button>
          </div>
        }
      >
        <form id="placement-poster-form" className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
          <div className="sm:col-span-2">
            <Alert message={formError} onClose={() => setFormError('')} />
          </div>

          <Field label="Poster image" htmlFor="poster-image" hint="PNG, JPEG, or WebP. It will be resized for the web.">
            <input
              id="poster-image"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              required
              className="input file:mr-3 file:rounded-md file:border-0 file:bg-indigo-50 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-indigo-700"
              onChange={handleImageChange}
            />
          </Field>

          <div className="flex items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3">
            {imageData ? (
              <img src={imageData} alt="Poster preview" className="max-h-40 rounded object-contain" />
            ) : (
              <p className="text-xs text-slate-500">
                {processingImage ? 'Processing image...' : 'Poster preview'}
              </p>
            )}
          </div>

          <Field label="Drive title" htmlFor="poster-title">
            <TextInput
              id="poster-title"
              required
              minLength={3}
              maxLength={200}
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="Campus Placement Drive 2026"
            />
          </Field>

          <Field label="Company" htmlFor="poster-company">
            <TextInput
              id="poster-company"
              required
              maxLength={160}
              value={form.company}
              onChange={(event) => setForm((prev) => ({ ...prev, company: event.target.value }))}
              placeholder="Company name"
            />
          </Field>

          <Field label="Drive date" htmlFor="poster-drive-date">
            <TextInput
              id="poster-drive-date"
              type="date"
              required
              min={today}
              value={form.drive_date}
              onChange={(event) => setForm((prev) => ({ ...prev, drive_date: event.target.value }))}
            />
          </Field>

          <Field label="Registration deadline" htmlFor="poster-deadline" hint="Optional.">
            <TextInput
              id="poster-deadline"
              type="date"
              min={today}
              max={form.drive_date || undefined}
              value={form.registration_deadline}
              onChange={(event) => setForm((prev) => ({ ...prev, registration_deadline: event.target.value }))}
            />
          </Field>

          <Field label="Venue" htmlFor="poster-venue">
            <TextInput
              id="poster-venue"
              required
              maxLength={200}
              value={form.venue}
              onChange={(event) => setForm((prev) => ({ ...prev, venue: event.target.value }))}
              placeholder="Seminar Hall A"
            />
          </Field>

          <Field label="Department" htmlFor="poster-department" hint="Leave blank for all departments.">
            <SelectInput
              id="poster-department"
              value={form.department_id}
              onChange={(event) => setForm((prev) => ({ ...prev, department_id: event.target.value }))}
            >
              <option value="">All departments</option>
              {departmentOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </SelectInput>
          </Field>

          <div className="sm:col-span-2">
            <Field label="Eligibility" htmlFor="poster-eligibility">
              <TextArea
                id="poster-eligibility"
                required
                rows={2}
                maxLength={500}
                value={form.eligibility}
                onChange={(event) => setForm((prev) => ({ ...prev, eligibility: event.target.value }))}
                placeholder="Eligible branches, batch, minimum CGPA, backlogs, etc."
              />
            </Field>
          </div>

          <div className="sm:col-span-2">
            <Field label="Description" htmlFor="poster-description" hint="Optional details about the pool drive.">
              <TextArea
                id="poster-description"
                rows={3}
                maxLength={3000}
                value={form.description}
                onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                placeholder="Roles, package, selection process, documents to carry..."
              />
            </Field>
          </div>

          <div className="sm:col-span-2">
            <Field label="Apply / registration link" htmlFor="poster-apply-url" hint="Optional. Must start with http:// or https://.">
              <TextInput
                id="poster-apply-url"
                type="url"
                maxLength={500}
                value={form.apply_url}
                onChange={(event) => setForm((prev) => ({ ...prev, apply_url: event.target.value }))}
                placeholder="https://..."
              />
            </Field>
          </div>
        </form>
      </Modal>
    </div>
  );
}
