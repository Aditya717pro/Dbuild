import { query } from '../db/pool.js';

const END_SEMESTER_EXAM = 'End Semester Examination';

function gradeFor(percentage) {
  if (percentage === null) return null;
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C';
  if (percentage >= 40) return 'D';
  return 'F';
}

function roundPercentage(obtained, maximum) {
  if (!maximum) return null;
  return Math.round((obtained / maximum) * 1000) / 10;
}

export async function marksheets(req, res) {
  const { rows } = await query(
    `SELECT m.id, m.semester, m.exam_type,
            CAST(m.marks_obtained AS DECIMAL(6,2)) AS marks_obtained,
            CAST(m.max_marks AS DECIMAL(6,2)) AS max_marks,
            DATE_FORMAT(m.published_on, '%Y-%m-%d') AS published_on,
            c.code AS course_code, c.name AS course_name
     FROM marksheets m
     JOIN courses c ON c.id = m.course_id
     WHERE m.student_id = ?
       AND m.exam_type = ?
     ORDER BY m.semester, c.code`,
    [req.user.id, END_SEMESTER_EXAM],
  );

  const bySemester = new Map();
  for (const row of rows) {
    if (!bySemester.has(row.semester)) {
      bySemester.set(row.semester, []);
    }
    bySemester.get(row.semester).push(row);
  }

  const semesters = [...bySemester.entries()]
    .sort(([left], [right]) => left - right)
    .map(([semester, semesterRows]) => {
      let marksObtained = 0;
      let maxMarks = 0;
      const subjects = semesterRows.map((row) => {
        const subjectMarks = Number(row.marks_obtained);
        const subjectMaxMarks = Number(row.max_marks);
        const percentage = roundPercentage(subjectMarks, subjectMaxMarks);
        marksObtained += subjectMarks;
        maxMarks += subjectMaxMarks;

        return {
          id: row.id,
          semester: row.semester,
          exam_type: row.exam_type,
          published_on: row.published_on,
          course_code: row.course_code,
          course_name: row.course_name,
          grade: gradeFor(percentage),
          result: percentage !== null && percentage >= 40 ? 'Pass' : 'Fail',
        };
      });

      const percentage = roundPercentage(marksObtained, maxMarks);

      return {
        semester,
        exam_type: END_SEMESTER_EXAM,
        published_on: subjects[0]?.published_on ?? null,
        subjects,
        summary: {
          semester,
          exam_type: END_SEMESTER_EXAM,
          published_on: subjects[0]?.published_on ?? null,
          total_subjects: subjects.length,
          grade: gradeFor(percentage),
          result: subjects.length === 0 ? null : percentage >= 40 ? 'Passed' : 'Failed',
        },
      };
    });

  return res.json({ semesters });
}

export async function fees(req, res) {
  const { rows } = await query(
    `SELECT id, fee_type,
            CAST(amount AS DECIMAL(10,2)) AS amount,
            CAST(paid_amount AS DECIMAL(10,2)) AS paid_amount,
            DATE_FORMAT(due_date, '%Y-%m-%d') AS due_date,
            DATE_FORMAT(paid_on, '%Y-%m-%d') AS paid_on,
            receipt_no
     FROM fees
     WHERE student_id = ?
     ORDER BY due_date, fee_type`,
    [req.user.id],
  );

  const today = new Date().toISOString().slice(0, 10);
  const feeRows = rows.map((row) => {
    const amount = Number(row.amount);
    const paidAmount = Number(row.paid_amount);
    const balance = Math.round((amount - paidAmount) * 100) / 100;
    let status = 'pending';
    if (balance <= 0) {
      status = 'paid';
    } else if (row.due_date < today) {
      status = 'overdue';
    } else if (paidAmount > 0) {
      status = 'partial';
    }
    return { ...row, amount, paid_amount: paidAmount, balance, status };
  });

  const totalAmount = feeRows.reduce((sum, row) => sum + row.amount, 0);
  const totalPaid = feeRows.reduce((sum, row) => sum + row.paid_amount, 0);

  return res.json({
    fees: feeRows,
    summary: {
      total: Math.round(totalAmount * 100) / 100,
      paid: Math.round(totalPaid * 100) / 100,
      outstanding: Math.round((totalAmount - totalPaid) * 100) / 100,
    },
  });
}
