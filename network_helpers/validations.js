const err = require('../utils/error');

function validate(data, Schema) {
  const { error } = Schema.validate(data);
  return error;
}

function validation(Schema, check = 'body') {
  return (req, res, next) => {
    const error = validate(req[check], Schema);
    if (error) next(err('invalid input', 405));
    next();
  };
}

module.exports = validation;
