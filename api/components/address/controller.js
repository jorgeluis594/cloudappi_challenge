const err = require('../../../utils/error');

const TABLE = 'address';

module.exports = function (injectedStore) {
  function getAddressByUserId(userId) {
    return injectedStore.findByParams(TABLE, { userId });
  }

  function createAddress(userId, addressData) {
    return injectedStore.create(TABLE, { userId, ...addressData });
  }

  async function updateAddress(id, addressData) {
    return injectedStore.update(TABLE, id, addressData);
  }

  return {
    getAddressByUserId,
    createAddress,
    updateAddress,
  };
};
