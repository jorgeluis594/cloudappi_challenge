const response = require('./response');

// middleware to handle errors
function errors(err, req, res, next) {
  const message = err.message || 'Internal error';
  const status = err.statusCode || 500;
  response.error(res, message, status);
}

module.exports = errors;
