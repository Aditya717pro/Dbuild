import { API_BASE } from '../../services/api.js';

const STATUS_TONES = {
  draft: 'bg-slate-100 text-slate-600',
  submitted: 'bg-sky-100 text-sky-700',
  under_review: 'bg-amber-100 text-amber-700',
  approved: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-rose-100 text-rose-700',
  prototype_development: 'bg-violet-100 text-violet-700',
  completed: 'bg-emerald-100 text-emerald-700',
  planning: 'bg-slate-100 text-slate-600',
  in_development: 'bg-sky-100 text-sky-700',
  prototype: 'bg-violet-100 text-violet-700',
  testing: 'bg-amber-100 text-amber-700',
  on_hold: 'bg-rose-100 text-rose-700',
  pending: 'bg-amber-100 text-amber-700',
  accepted: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-slate-100 text-slate-600',
  registered: 'bg-sky-100 text-sky-700',
  waitlisted: 'bg-amber-100 text-amber-700',
  attended: 'bg-emerald-100 text-emerald-700',
  available: 'bg-emerald-100 text-emerald-700',
  maintenance: 'bg-amber-100 text-amber-700',
  retired: 'bg-slate-100 text-slate-600',
  upcoming: 'bg-sky-100 text-sky-700',
  ongoing: 'bg-violet-100 text-violet-700',
  idea_generation: 'bg-slate-100 text-slate-600',
  idea_validation: 'bg-sky-100 text-sky-700',
  business_model: 'bg-amber-100 text-amber-700',
  market_validation: 'bg-amber-100 text-amber-700',
  incubation: 'bg-violet-100 text-violet-700',
  launched: 'bg-emerald-100 text-emerald-700',
  filed: 'bg-sky-100 text-sky-700',
  published: 'bg-violet-100 text-violet-700',
  granted: 'bg-emerald-100 text-emerald-700',
  ongoing_project: 'bg-sky-100 text-sky-700',
  patented: 'bg-emerald-100 text-emerald-700',
};

export function prettyLabel(value) {
  if (!value) return '—';
  return String(value)
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function StatusBadge({ value, className = '' }) {
  return (
    <span className={`badge ${STATUS_TONES[value] || STATUS_TONES.draft} ${className}`}>
      {prettyLabel(value)}
    </span>
  );
}

export function ProgressBar({ value, label }) {
  const progress = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
        <span>{label || 'Progress'}</span>
        <span>{progress}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-full rounded-full ${progress >= 75 ? 'bg-emerald-500' : progress >= 40 ? 'bg-indigo-500' : 'bg-amber-500'}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export function InnovationStat({ label, value, hint, tone = 'indigo' }) {
  const tones = {
    indigo: 'from-indigo-600 to-violet-600',
    emerald: 'from-emerald-600 to-teal-600',
    amber: 'from-amber-500 to-orange-600',
    rose: 'from-rose-500 to-pink-600',
    sky: 'from-sky-500 to-blue-600',
  };
  return (
    <div className="card overflow-hidden p-0">
      <div className="flex items-start justify-between gap-3 p-5">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value ?? '—'}</p>
          {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
        </div>
        <span className={`h-11 w-1.5 rounded-full bg-gradient-to-b ${tones[tone] || tones.indigo}`} />
      </div>
    </div>
  );
}

export function InlineStat({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-0.5 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}

export function mediaUrl(kind, id) {
  return `${API_BASE}/innovation/media/${kind}/${id}`;
}

export function formatCurrency(value) {
  if (value === null || value === undefined || value === '') return 'Not specified';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value));
}

function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Could not read the selected file'));
    reader.readAsDataURL(file);
  });
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Could not process the image'))),
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

export async function prepareImage(file, { maxDimension = 1600, maxBytes = 1.4 * 1024 * 1024 } = {}) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    throw new Error('Choose a PNG, JPEG, or WebP image');
  }

  const image = await loadImage(file);
  const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
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
  while (blob.size > maxBytes && quality > 0.45) {
    quality -= 0.1;
    blob = await canvasToBlob(canvas, 'image/jpeg', quality);
  }
  if (blob.size > maxBytes) throw new Error('Image is too large even after compression');

  return {
    file_name: file.name.replace(/\.[^.]+$/, '') + '.jpg',
    mime: 'image/jpeg',
    data: await readAsDataUrl(blob),
  };
}

export async function prepareDocument(file) {
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    throw new Error('Supporting documents must be PDF files');
  }
  if (file.size > 3 * 1024 * 1024) {
    throw new Error('Supporting documents must be smaller than 3 MB');
  }
  return {
    file_name: file.name,
    mime: 'application/pdf',
    data: await readAsDataUrl(file),
  };
}

export const INNOVATION_CATEGORIES = [
  'Software & Apps',
  'AI & Machine Learning',
  'IoT & Embedded Systems',
  'Healthcare',
  'Sustainability',
  'Social Impact',
  'Robotics',
  'Other',
];

export const IDEA_YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate'];

export const PROJECT_STATUS_OPTIONS = [
  'planning',
  'in_development',
  'prototype',
  'testing',
  'completed',
  'on_hold',
];

export const STARTUP_STAGES = [
  'idea_generation',
  'idea_validation',
  'business_model',
  'prototype',
  'market_validation',
  'incubation',
  'launched',
];

export const EVENT_TYPES = [
  'hackathon',
  'ideathon',
  'competition',
  'workshop',
  'seminar',
  'entrepreneurship',
  'challenge',
];
