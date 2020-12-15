const { extendObject } = require('./tools');
const addresFixture = require('./addres-fixture');

const user = (id) => {
  const { userId, ...address } = addresFixture.findByUserId(id);

  return {
    id,
    name: 'test',
    birthDate: '10-2-1994',
    address,
  };
};

const users = [
  user(1),
  extendObject(user(2), { name: 'test 2' }),
  extendObject(user(3), { name: 'test 3', birthDate: '20-2-1994' }),
];

module.exports = {
  single: user(1),
  all: users,
  findById: (id) => users.find((item) => item.id === id),
};
