const test = require('ava');
const sinon = require('sinon');

const addressFixture = require('../../utils/addres-fixture');
const setupAddressController = require('../../../api/components/address/controller');

const id = 1;
const userId = 1;
const TABLE = 'address';
const address = {
  street: 'av test',
  state: 'state test',
  city: 'city test',
  conutry: 'country test',
  zip: 'zip test',
};

const sandbox = sinon.createSandbox();

let addressStoreStub = null;
let addressController = null;

test.beforeEach(() => {
  addressStoreStub = {
    findByParams: sandbox.stub(),
    create: sandbox.stub(),
    update: sandbox.stub(),
  };

  addressStoreStub.findByParams
    .withArgs(TABLE, { userId })
    .returns(addressFixture.findByUserId(userId));

  addressStoreStub.create
    .withArgs(TABLE, { userId, ...address })
    .returns({ userId, ...address });

  addressStoreStub.update.withArgs(TABLE, id, address).returns(address);

  addressController = setupAddressController(addressStoreStub);
});

test.afterEach(() => {
  sandbox.restore();
});

test.serial('AddressController#getAddressByUserId', (t) => {
  const result = addressController.getAddressByUserId(userId);

  t.true(addressStoreStub.findByParams.called, 'findByParams should be called');
  t.true(addressStoreStub.findByParams.calledOnce, 'findByParams should be called once');

  t.deepEqual(result, addressFixture.findByUserId(userId));
});

test.serial('AddressController#createAddress', async (t) => {
  const result = await addressController.createAddress(userId, address);

  t.true(addressStoreStub.create.called, 'create should be called');
  t.true(addressStoreStub.create.calledOnce, 'create shoudl be called once');

  t.deepEqual(result, { userId, ...address });
});

test.serial('AdressController#updateAddress', async (t) => {
  const result = await addressController.updateAddress(id, address);

  t.true(addressStoreStub.update.called, 'update should be called');
  t.true(addressStoreStub.update.calledOnce, 'update should be called once');

  t.deepEqual(result, address);
});
