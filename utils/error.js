// Create a custom error
function err(message, statusCode) {
  const e = new Error(message);
  if (statusCode) e.statusCode = statusCode;

  return e;
}

module.exports = err;
