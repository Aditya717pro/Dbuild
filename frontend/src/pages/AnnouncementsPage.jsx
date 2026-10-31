import { useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useApiData } from '../hooks/useApiData.js';
import { api } from '../services/api.js';
import AnnouncementCard from '../components/AnnouncementCard.jsx';
import { Alert, EmptyState, ErrorState, PageHeader, PageLoader } from '../components/States.jsx';
import { Field, SelectInput, TextArea, TextInput } from '../components/FormControls.jsx';

const MAX_IMAGE_BYTES = 3 * 1024 * 1024;
const MAX_DIMENSION = 1800;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const EMPTY_FORM = {
  title: '',
  body: '',
  audience: 'all',
  department_id: '',
  course_id: '',
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

async function prepareAnnouncementImage(file) {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    throw new Error('Choose a PNG, JPEG, or WebP image');
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
    throw new Error('Image is too large. Choose a smaller image.');
  }

  return blobToDataUrl(blob);
}

function UploadIcon() {
  return (
    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
      <svg
        className="h-6 w-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 16V4m0 0L8 8m4-4 4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
        />
      </svg>
    </span>
  );
}

export default function AnnouncementsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isCdc = Boolean(user?.is_cdc);
  const canManage = isAdmin || isCdc;
  const createFormRef = useRef(null);
  const fileInputRef = useRef(null);

  const announcements = useApiData('/announcements', { enabled: canManage });
  const departments = useApiData('/departments', { enabled: canManage });
  const courses = useApiData('/courses', { enabled: canManage });

  const [form, setForm] = useState({ ...EMPTY_FORM, audience: 'all' });
  const [imageData, setImageData] = useState('');
  const [imageError, setImageError] = useState('');
  const [processingImage, setProcessingImage] = useState(false);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [feedFilter, setFeedFilter] = useState('');

  if (!canManage) {
    return (
      <ErrorState message="Only CDC faculty and administrators can upload announcements. View public notices on the Career Development Centre page." />
    );
  }

  const allRows = announcements.data?.announcements || [];
  const rows = (!isAdmin && isCdc) ? allRows.filter((row) => row.posted_by === user.id || row.audience === 'all') : allRows;
  const departmentOptions = departments.data?.departments || [];
  const courseOptions = courses.data?.courses || [];
  const visible = feedFilter ? rows.filter((row) => row.audience === feedFilter) : rows;

  function focusComposer() {
    createFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.getElementById('announcement-title')?.focus({ preventScroll: true });
  }

  async function handleImageChange(event) {
    const file = event.target.files?.[0];
    setImageError('');
    setImageData('');
    if (!file) return;

    setProcessingImage(true);
    try {
      const dataUrl = await prepareAnnouncementImage(file);
      setImageData(dataUrl);
    } catch (err) {
      setImageError(err.message);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } finally {
      setProcessingImage(false);
    }
  }

  function clearImage() {
    setImageData('');
    setImageError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setFormError('');
    setNotice('');
    try {
      const payload = {
        title: form.title.trim(),
        body: form.body.trim(),
        audience: form.audience,
      };
      if (imageData) payload.image_data = imageData;
      if (form.audience === 'department') payload.department_id = Number(form.department_id);
      if (form.audience === 'course') payload.course_id = Number(form.course_id);

      await api.post('/announcements', payload);
      setForm({ ...EMPTY_FORM, audience: 'all' });
      clearImage();
      setNotice('Announcement posted successfully to Career Development Centre');
      await announcements.reload();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(announcement) {
    if (!window.confirm(`Delete announcement "${announcement.title}"?`)) return;
    try {
      await api.del(`/announcements/${announcement.id}`);
      setNotice('Announcement deleted');
      await announcements.reload();
    } catch (err) {
      window.alert(err.message);
    }
  }

  if (announcements.loading) return <PageLoader />;
  if (announcements.error) return <ErrorState message={announcements.error} onRetry={announcements.reload} />;

  return (
    <div>
      <PageHeader
        title="CDC Announcements"
        subtitle="Upload and manage notices published to the Career Development Centre on the website."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="space-y-4 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-slate-900">
              {isAdmin ? 'All CDC Announcements' : 'My CDC Uploads'}
            </h2>
            <select
              className="input w-auto"
              value={feedFilter}
              onChange={(event) => setFeedFilter(event.target.value)}
              aria-label="Filter announcements by audience"
            >
              <option value="">All audiences</option>
              <option value="all">Career Development Centre (Website / All)</option>
              <option value="department">Department</option>
              <option value="course">Course</option>
            </select>
          </div>

          {notice && <Alert type="success" message={notice} onClose={() => setNotice('')} />}

          {visible.length === 0 ? (
            <div className="card">
              {rows.length === 0 ? (
                <EmptyState
                  icon={<UploadIcon />}
                  title="No uploads yet"
                  message="You haven't uploaded any announcements. Post one to display in the Career Development Centre on the website."
                  action={(
                    <button type="button" className="btn btn-primary" onClick={focusComposer}>
                      Upload announcement
                    </button>
                  )}
                />
              ) : (
                <EmptyState
                  title="No announcements"
                  message="No announcements match this filter."
                />
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {visible.map((announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                  canDelete={isAdmin || announcement.posted_by === user.id}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </section>

        <section ref={createFormRef} className="card h-fit scroll-mt-24 p-5">
          <h2 className="text-lg font-semibold text-slate-900">Upload announcement</h2>
          <p className="mt-1 text-xs text-slate-500">
            Posts are published directly to the Career Development Centre on the website.
          </p>

          <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
            <Alert message={formError} onClose={() => setFormError('')} />

            <Field label="Title" htmlFor="announcement-title">
              <TextInput
                id="announcement-title"
                required
                minLength={3}
                maxLength={200}
                value={form.title}
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                placeholder="Campus Placement Drive or Notice"
              />
            </Field>

            <Field label="Message" htmlFor="announcement-body">
              <TextArea
                id="announcement-body"
                required
                maxLength={5000}
                value={form.body}
                onChange={(event) => setForm((prev) => ({ ...prev, body: event.target.value }))}
                placeholder="Share details, eligibility, schedule, or instructions..."
              />
            </Field>

            <Field
              label="Upload Image (Optional)"
              htmlFor="announcement-image"
              hint="PNG, JPEG, or WebP up to 3MB. Displayed in Career Development Centre."
            >
              <input
                ref={fileInputRef}
                id="announcement-image"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="input file:mr-3 file:rounded-md file:border-0 file:bg-indigo-50 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-indigo-700"
                onChange={handleImageChange}
                disabled={saving || processingImage}
              />
            </Field>

            {processingImage && (
              <p className="text-xs text-indigo-600 font-medium">Processing image...</p>
            )}
            {imageError && (
              <p className="text-xs text-rose-600 font-medium">{imageError}</p>
            )}

            {imageData && (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-700">Image preview</span>
                  <button
                    type="button"
                    className="text-xs font-semibold text-rose-600 hover:text-rose-800"
                    onClick={clearImage}
                  >
                    Remove image
                  </button>
                </div>
                <img
                  src={imageData}
                  alt="Preview"
                  className="max-h-48 w-full rounded object-contain bg-white border border-slate-200"
                />
              </div>
            )}

            <Field label="Audience" htmlFor="announcement-audience">
              <SelectInput
                id="announcement-audience"
                value={form.audience}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    audience: event.target.value,
                    department_id: '',
                    course_id: '',
                  }))
                }
              >
                <option value="all">Career Development Centre (Website / All)</option>
                <option value="department">Department</option>
                <option value="course">Course</option>
              </SelectInput>
            </Field>

            {form.audience === 'department' && (
              <Field label="Department" htmlFor="announcement-department">
                <SelectInput
                  id="announcement-department"
                  required
                  value={form.department_id}
                  onChange={(event) => setForm((prev) => ({ ...prev, department_id: event.target.value }))}
                >
                  <option value="">Select a department</option>
                  {departmentOptions.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.code} · {department.name}
                    </option>
                  ))}
                </SelectInput>
              </Field>
            )}

            {form.audience === 'course' && (
              <Field label="Course" htmlFor="announcement-course">
                <SelectInput
                  id="announcement-course"
                  required
                  value={form.course_id}
                  onChange={(event) => setForm((prev) => ({ ...prev, course_id: event.target.value }))}
                >
                  <option value="">Select a course</option>
                  {courseOptions.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.code} · {course.name}
                    </option>
                  ))}
                </SelectInput>
              </Field>
            )}

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={saving || processingImage}
            >
              {saving ? 'Posting...' : processingImage ? 'Processing image...' : 'Post announcement'}
            </button>
            <p className="text-xs text-slate-500">
              Uploaded announcements with &ldquo;Career Development Centre (Website / All)&rdquo; appear publicly in the website&apos;s Career Development Centre.
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}
