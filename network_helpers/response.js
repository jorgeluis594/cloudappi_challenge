// Give consistency to the responses

function success(res, message, status = 200) {
  res.status(status).send({
    error: false,
    status,
    body: message,
  });
}

function error(res, message, status = 500) {
  res.status(status).send({
    error: true,
    status,
    body: message,
  });
}

module.exports = {
  success,
  error,
};
