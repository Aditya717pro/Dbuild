const DUPLICATE = { status: 409, message: 'A record with those unique values already exists' };
const MISSING_REFERENCE = { status: 400, message: 'A referenced record does not exist' };
const REFERENCE_IN_USE = { status: 400, message: 'A referenced record is still in use' };
const CONSTRAINT_VIOLATION = { status: 400, message: 'A value violates a database constraint' };
const MISSING_VALUE = { status: 400, message: 'A required value is missing' };
const INVALID_FORMAT = { status: 400, message: 'A value has an invalid format' };
const VALUE_TOO_LONG = { status: 400, message: 'A value is too long' };
const OUT_OF_RANGE = { status: 400, message: 'A numeric value is out of range' };

const MYSQL_ERRORS = {
  ER_DUP_ENTRY: DUPLICATE,
  ER_NO_REFERENCED_ROW: MISSING_REFERENCE,
  ER_NO_REFERENCED_ROW_2: MISSING_REFERENCE,
  ER_ROW_IS_REFERENCED: REFERENCE_IN_USE,
  ER_ROW_IS_REFERENCED_2: REFERENCE_IN_USE,
  ER_CHECK_CONSTRAINT_VIOLATED: CONSTRAINT_VIOLATION,
  ER_BAD_NULL_ERROR: MISSING_VALUE,
  ER_NO_DEFAULT_FOR_FIELD: MISSING_VALUE,
  ER_TRUNCATED_WRONG_VALUE: INVALID_FORMAT,
  ER_TRUNCATED_WRONG_VALUE_FOR_FIELD: INVALID_FORMAT,
  ER_WRONG_VALUE: INVALID_FORMAT,
  ER_DATA_TOO_LONG: VALUE_TOO_LONG,
  ER_WARN_DATA_OUT_OF_RANGE: OUT_OF_RANGE,
  1062: DUPLICATE,
  1216: MISSING_REFERENCE,
  1452: MISSING_REFERENCE,
  1217: REFERENCE_IN_USE,
  1451: REFERENCE_IN_USE,
  3819: CONSTRAINT_VIOLATION,
  1048: MISSING_VALUE,
  1364: MISSING_VALUE,
  1292: INVALID_FORMAT,
  1366: INVALID_FORMAT,
  1406: VALUE_TOO_LONG,
  1264: OUT_OF_RANGE,
};

export function notFound(req, res) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const isProduction = process.env.NODE_ENV === 'production';

  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: (err.issues || []).map((issue) => ({
        path: (issue.path || []).join('.'),
        message: issue.message,
      })),
    });
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Request body is not valid JSON' });
  }

  const mysqlMapped = MYSQL_ERRORS[err.code] || MYSQL_ERRORS[String(err.errno)];
  if (mysqlMapped) {
    return res.status(mysqlMapped.status).json({ error: mysqlMapped.message });
  }

  const status = err.status || 500;
  if (status >= 500) {
    console.error('[error]', req.method, req.originalUrl, err);
  }

  const body = {
    error: status >= 500 && isProduction ? 'Internal server error' : err.message,
  };
  if (err.details !== undefined) {
    body.details = err.details;
  }
  if (!isProduction && status >= 500 && err.stack) {
    body.stack = err.stack;
  }

  return res.status(status).json(body);
}
