import { query } from '../../db/pool.js';
import { writeAudit } from '../../utils/audit.js';
import { httpError } from '../../utils/httpError.js';
import {
  assertHttpUrl,
  isAdmin,
  parsePositiveId,
} from './common.js';

const RESEARCH_SELECT = `
  SELECT r.id, r.title, r.abstract, r.type, r.owner_id, r.department_id, r.guide_id,
         r.status, r.funding_amount, r.funding_agency, r.collaboration_partner,
         DATE_FORMAT(r.published_on, '%Y-%m-%d') AS published_on,
         r.paper_url, r.progress, r.created_at, r.updated_at,
         owner.name AS owner_name, owner.email AS owner_email,
         guide.name AS guide_name,
         d.name AS department_name, d.code AS department_code
  FROM innovation_research_records r
  JOIN users owner ON owner.id = r.owner_id
  LEFT JOIN users guide ON guide.id = r.guide_id
  LEFT JOIN departments d ON d.id = r.department_id`;

const PATENT_SELECT = `
  SELECT p.id, p.title, p.patent_number, p.status, p.inventors, p.owner_id,
         p.department_id, DATE_FORMAT(p.filing_date, '%Y-%m-%d') AS filing_date,
         DATE_FORMAT(p.grant_date, '%Y-%m-%d') AS grant_date,
         p.description, p.document_url, p.created_at, p.updated_at,
         owner.name AS owner_name, owner.email AS owner_email,
         d.name AS department_name, d.code AS department_code
  FROM innovation_patents p
  JOIN users owner ON owner.id = p.owner_id
  LEFT JOIN departments d ON d.id = p.department_id`;

export async function listResearch(_req, res) {
  const { rows } = await query(
    `${RESEARCH_SELECT}
     ORDER BY FIELD(r.status, 'ongoing', 'completed', 'published', 'patented'),
              r.updated_at DESC
     LIMIT 300`,
  );
  return res.json({ research: rows });
}

export async function createResearch(req, res) {
  const {
    title, abstract, type, department_id: departmentId, guide_id: guideId,
    status = 'ongoing', funding_amount: fundingAmount, funding_agency: fundingAgency,
    collaboration_partner: collaborationPartner, published_on: publishedOn,
    paper_url: paperUrl, progress = 0,
  } = req.body;

  const url = assertHttpUrl(paperUrl, 'Paper URL');
  const { insertId } = await query(
    `INSERT INTO innovation_research_records
       (title, abstract, type, owner_id, department_id, guide_id, status,
        funding_amount, funding_agency, collaboration_partner, published_on,
        paper_url, progress)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      title,
      abstract,
      type,
      req.user.id,
      departmentId ?? null,
      guideId ?? null,
      status,
      fundingAmount ?? null,
      fundingAgency || null,
      collaborationPartner || null,
      publishedOn || null,
      url,
      progress,
    ],
  );

  await writeAudit(null, req.user.id, 'innovation_research.create', 'innovation_research_records', insertId);
  const { rows } = await query(`${RESEARCH_SELECT} WHERE r.id = ?`, [insertId]);
  return res.status(201).json({ research: rows[0] });
}

export async function updateResearch(req, res) {
  const id = parsePositiveId(req.params.id, 'research record id');
  const existing = await query(
    'SELECT id, owner_id FROM innovation_research_records WHERE id = ?',
    [id],
  );
  const record = existing.rows[0];
  if (!record) throw httpError(404, 'Research record not found');
  if (!isAdmin(req.user) && record.owner_id !== req.user.id) {
    throw httpError(403, 'You can only edit your own research records');
  }

  const {
    title, abstract, type, department_id: departmentId, guide_id: guideId,
    status, funding_amount: fundingAmount, funding_agency: fundingAgency,
    collaboration_partner: collaborationPartner, published_on: publishedOn,
    paper_url: paperUrl, progress,
  } = req.body;

  const url = assertHttpUrl(paperUrl, 'Paper URL');
  await query(
    `UPDATE innovation_research_records
     SET title = ?, abstract = ?, type = ?, department_id = ?, guide_id = ?,
         status = ?, funding_amount = ?, funding_agency = ?, collaboration_partner = ?,
         published_on = ?, paper_url = ?, progress = ?
     WHERE id = ?`,
    [
      title,
      abstract,
      type,
      departmentId ?? null,
      guideId ?? null,
      status,
      fundingAmount ?? null,
      fundingAgency || null,
      collaborationPartner || null,
      publishedOn || null,
      url,
      progress,
      id,
    ],
  );

  await writeAudit(null, req.user.id, 'innovation_research.update', 'innovation_research_records', id);
  const { rows } = await query(`${RESEARCH_SELECT} WHERE r.id = ?`, [id]);
  return res.json({ research: rows[0] });
}

export async function deleteResearch(req, res) {
  const id = parsePositiveId(req.params.id, 'research record id');
  const { rows } = await query(
    'SELECT owner_id FROM innovation_research_records WHERE id = ?',
    [id],
  );
  if (!rows[0]) throw httpError(404, 'Research record not found');
  if (!isAdmin(req.user) && rows[0].owner_id !== req.user.id) {
    throw httpError(403, 'You can only delete your own research records');
  }

  await query('DELETE FROM innovation_research_records WHERE id = ?', [id]);
  await writeAudit(null, req.user.id, 'innovation_research.delete', 'innovation_research_records', id);
  return res.json({ message: 'Research record deleted' });
}

export async function listPatents(_req, res) {
  const { rows } = await query(
    `${PATENT_SELECT}
     ORDER BY FIELD(p.status, 'filed', 'published', 'granted', 'draft', 'rejected'),
              p.created_at DESC
     LIMIT 300`,
  );
  return res.json({ patents: rows });
}

export async function createPatent(req, res) {
  const {
    title, patent_number: patentNumber, status = 'draft', inventors,
    department_id: departmentId, filing_date: filingDate, grant_date: grantDate,
    description, document_url: documentUrl,
  } = req.body;

  const url = assertHttpUrl(documentUrl, 'Document URL');
  const { insertId } = await query(
    `INSERT INTO innovation_patents
       (title, patent_number, status, inventors, owner_id, department_id,
        filing_date, grant_date, description, document_url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      title,
      patentNumber || null,
      status,
      inventors,
      req.user.id,
      departmentId ?? null,
      filingDate || null,
      grantDate || null,
      description || null,
      url,
    ],
  );

  await writeAudit(null, req.user.id, 'innovation_patent.create', 'innovation_patents', insertId);
  const { rows } = await query(`${PATENT_SELECT} WHERE p.id = ?`, [insertId]);
  return res.status(201).json({ patent: rows[0] });
}

export async function updatePatent(req, res) {
  const id = parsePositiveId(req.params.id, 'patent id');
  const existing = await query('SELECT owner_id FROM innovation_patents WHERE id = ?', [id]);
  if (!existing.rows[0]) throw httpError(404, 'Patent not found');
  if (!isAdmin(req.user) && existing.rows[0].owner_id !== req.user.id) {
    throw httpError(403, 'You can only edit your own patent records');
  }

  const {
    title, patent_number: patentNumber, status, inventors,
    department_id: departmentId, filing_date: filingDate, grant_date: grantDate,
    description, document_url: documentUrl,
  } = req.body;

  const url = assertHttpUrl(documentUrl, 'Document URL');
  await query(
    `UPDATE innovation_patents
     SET title = ?, patent_number = ?, status = ?, inventors = ?, department_id = ?,
         filing_date = ?, grant_date = ?, description = ?, document_url = ?
     WHERE id = ?`,
    [
      title,
      patentNumber || null,
      status,
      inventors,
      departmentId ?? null,
      filingDate || null,
      grantDate || null,
      description || null,
      url,
      id,
    ],
  );

  await writeAudit(null, req.user.id, 'innovation_patent.update', 'innovation_patents', id);
  const { rows } = await query(`${PATENT_SELECT} WHERE p.id = ?`, [id]);
  return res.json({ patent: rows[0] });
}

export async function deletePatent(req, res) {
  const id = parsePositiveId(req.params.id, 'patent id');
  const existing = await query('SELECT owner_id FROM innovation_patents WHERE id = ?', [id]);
  if (!existing.rows[0]) throw httpError(404, 'Patent not found');
  if (!isAdmin(req.user) && existing.rows[0].owner_id !== req.user.id) {
    throw httpError(403, 'You can only delete your own patent records');
  }

  await query('DELETE FROM innovation_patents WHERE id = ?', [id]);
  await writeAudit(null, req.user.id, 'innovation_patent.delete', 'innovation_patents', id);
  return res.json({ message: 'Patent record deleted' });
}
