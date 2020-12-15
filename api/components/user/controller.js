const err = require('../../../utils/error');

const Adress = require('../address');

const TABLE = 'user';

module.exports = function (injectedStore) {
  function getAddressWithoutUserId(address) {
    if (address) {
      const { userId, ...addressWithouthUserID } = address;
      return addressWithouthUserID;
    }
    return {};
  }

  function list() {
    return injectedStore.list(TABLE, { address: 'userId' }); // how to join tables { table: 'id'}
  }

  async function get(id) {
    const user = await injectedStore.get(TABLE, id).catch(() => {
      throw err('user not found', 404);
    });

    const address = getAddressWithoutUserId(await Adress.getAddressByUserId(id));

    return { ...user, address };
  }

  async function create(data) {
    // separates the address and user information
    const { address, ...user } = data;

    // creating user
    const createdUser = await injectedStore.create(TABLE, user).catch(() => {
      throw err('invalid input', 405);
    });

    // creating address
    const { userId, ...createdAdress } = await Adress.createAddress(
      createdUser.id,
      address
    ).catch(() => {
      throw err('invalid input', 405);
    });
    return { ...createdUser, address: createdAdress };
  }

  async function update(userId, userData) {
    const storedUser = await get(userId);
    const { address, ...user } = userData;
    if (user) injectedStore.update(TABLE, userId, user);
    if (address) Adress.updateAddress(storedUser.address.id, address);
    return get(userId);
  }

  async function remove(userId) {
    await get(userId);
    await injectedStore.remove(TABLE, userId);
    return 'OK';
  }

  return {
    list,
    get,
    create,
    update,
    remove,
  };
};
