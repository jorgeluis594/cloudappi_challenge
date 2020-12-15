const err = require('../../utils/error');

let users = [
  {
    id: 1,
    name: 'test',
    birthDate: '10-2-1994',
    address: {
      id: 1,
      userId: 1,
      street: 'av test',
      state: 'state test',
      city: 'city test',
      country: 'country test',
      zip: 'zip test',
    },
  },
  {
    id: 2,
    name: 'test',
    birthDate: '10-2-1994',
    address: {
      id: 2,
      userId: 2,
      street: 'av test',
      state: 'state test',
      city: 'city test',
      country: 'country test',
      zip: 'zip test',
    },
  },
  {
    id: 3,
    name: 'test',
    birthDate: '10-2-1994',
    address: {
      id: 3,
      userId: 1,
      street: 'av test',
      state: 'state test',
      city: 'city test',
      country: 'country test',
      zip: 'zip test',
    },
  },
];

async function create(data) {
  const { address, ...user } = data;
  const newUser = { id: 5, ...user, address: { ...address, id: 5, userId: 5 } };
  users.push(newUser);
  return newUser;
}

async function get(id) {
  const user = users.find((item) => item.id === Number(id));
  if (!user) throw err('User not found', 401);
  return user;
}

async function update(userId, data) {
  const user = await get(userId).catch((e) => {
    throw e;
  });
  const { address, ...userData } = data;
  const updatedUser = { ...user, ...userData, address: { ...user.address, ...address } };
  users = users.map((item) => {
    if (item.id === Number(userId)) return updatedUser;
    return item;
  });

  return updatedUser;
}

module.exports = {
  list: () => Promise.resolve(users),
  get,
  create,
  update,
  remove: Promise.resolve('ok'),
};
