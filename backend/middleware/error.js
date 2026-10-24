const PG_ERRORS = {
  '23505': { status: 409, message: 'A record with those unique values already exists' },
  '23503': { status: 400, message: 'A referenced record does not exist or is still in use' },
  '23514': { status: 400, message: 'A value violates a database constraint' },
  '23502': { status: 400, message: 'A required value is missing' },
  '22P02': { status: 400, message: 'A value has an invalid format' },
  '22007': { status: 400, message: 'A date value is invalid' },
  '22003': { status: 400, message: 'A numeric value is out of range' },
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

  const pgMapped = PG_ERRORS[err.code];
  if (pgMapped) {
    return res.status(pgMapped.status).json({ error: pgMapped.message });
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
