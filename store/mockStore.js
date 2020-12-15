const { nanoid } = require('nanoid');

const userId = nanoid(4);
const db = {
  user: [
    {
      id: userId,
      name: 'Jorge',
      birthDate: '10-20-1994',
    },
  ],
  address: [
    {
      id: nanoid(4),
      userId,
      street: 'av test',
      state: 'State test',
      city: 'Lima',
      country: 'Peru',
      zip: 'Lima 01',
    },
  ],
};

async function list(table) {
  return db[table];
}

async function get(table, id) {
  const collection = await list(table);
  const tupla = collection.find((item) => item.id === id);
  if (!tupla) throw new Error('Id not found');
  return tupla;
}

async function remove(table, id) {
  const tupla = await get(table, id);
  db[table] = db[table].filter((item) => item.id !== id);
  return tupla;
}

async function create(table, data) {
  console.log(table);
  // create a tupla with id
  const newUser = { id: nanoid(4), ...data };
  db[table].push(newUser);
  return newUser;
}

async function update(table, id, data) {
  const tuplaIndex = db[table].findIndex((item) => item.id === id);
  if (tuplaIndex === -1) throw new Error('Id not found');

  // overwriting attributtes
  const updatedItem = { ...db[table][tuplaIndex], ...data };

  // upddating tupla
  db[table][tuplaIndex] = updatedItem;
  return updatedItem;
}

// params have the way { 'attribute': 'value' }
async function findByParams(table, params) {
  const collection = await list(table);
  const key = Object.keys(params)[0];
  return collection.find((item) => item[key] === params[key]);
}

module.exports = {
  list,
  get,
  remove,
  create,
  update,
  findByParams,
};
