const { extendObject } = require('./tools');

const addres = {
  id: 1,
  userId: 1,
  street: 'av test',
  state: 'state test',
  city: 'city test',
  country: 'country test',
  zip: 'zip test',
};

const addresses = [
  addres,
  extendObject(addres, { id: 2, userId: 2 }),
  extendObject(addres, { id: 3, userId: 3, street: 'av test 3' }),
];

module.exports = {
  single: addres,
  all: addresses,
  findById: (id) => addresses.find((item) => item.id === id),
  findByUserId: (userId) => addresses.find((item) => item.userId === userId),
};
