export function notFound(req, res) {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
}

export function errorHandler(error, req, res, next) {
  console.error(error);

  if (error.code === 'ER_NO_SUCH_TABLE') {
    return res.status(500).json({
      message: 'Database table is missing. Run database/schema.sql and database/seed.sql.'
    });
  }

  if (error.code === 'ECONNREFUSED') {
    return res.status(500).json({
      message: 'Cannot connect to MySQL. Check your database credentials and make sure MySQL is running.'
    });
  }

  res.status(error.status || 500).json({
    message: error.message || 'Internal server error.'
  });
}
