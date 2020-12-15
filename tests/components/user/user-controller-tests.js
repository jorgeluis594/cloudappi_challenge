/* eslint-disable comma-dangle */
const test = require('ava');
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();

const userFixture = require('../../utils/user-fixture');
const addressFixture = require('../../utils/addres-fixture');

const id = 2;
const TABLE = 'user';

const address = {
  id,
  street: 'av test',
  state: 'state test',
  city: 'city test',
  country: 'country test',
  zip: 'zip test',
};

const user = {
  name: 'test 1',
  birthDate: '20-01-1994',
};

const userWithAddress = {
  ...user,
  address,
};

const sandbox = sinon.createSandbox();

let userStoreStub = null;
let userController = null;

let addressControllerStub = null;

test.beforeEach(() => {
  // config userStoreStub
  userStoreStub = {
    list: sandbox.stub(),
    get: sandbox.stub(),
    create: sandbox.stub(),
    update: sandbox.stub(),
    remove: sandbox.stub(),
  };

  userStoreStub.list.withArgs(TABLE).returns(userFixture.all);

  userStoreStub.get
    .withArgs(TABLE, id)
    .returns(Promise.resolve(userFixture.findById(id)));

  userStoreStub.create
    .withArgs(TABLE, sinon.match(user))
    .returns(Promise.resolve({ id, ...user }));

  userStoreStub.update
    .withArgs(TABLE, id, sinon.match(user))
    .returns(Promise.resolve({ id, ...user }));

  // config AddressStub
  addressControllerStub = {
    getAddressByUserId: sandbox.stub(),
    createAddress: sandbox.stub(),
    updateAddress: sandbox.stub(),
  };

  addressControllerStub.getAddressByUserId
    .withArgs(id)
    .returns(Promise.resolve(addressFixture.findByUserId(id)));

  addressControllerStub.createAddress
    .withArgs(id, sinon.match(address))
    .returns(Promise.resolve(address));

  addressControllerStub.updateAddress
    .withArgs(id, sinon.match(address))
    .returns(Promise.resolve(address));

  // inject addressController dependency
  const setupUserController = proxyquire('../../../api/components/user/controller', {
    '../address': addressControllerStub,
  });

  userController = setupUserController(userStoreStub);
});

test.afterEach(() => {
  sandbox.restore();
});

test.serial('UserController#list', (t) => {
  const expected = userController.list();

  // checks if the controller called the proper services
  t.true(userStoreStub.list.called, 'list should be called');
  t.true(userStoreStub.list.calledOnce, 'list should be called once');

  t.deepEqual(userFixture.all, expected);
});

test.serial('UserController#get', async (t) => {
  const expected = await userController.get(id);

  // checks if the controller called the proper services
  t.true(userStoreStub.get.called, 'get should be called');
  t.true(userStoreStub.get.calledOnce, 'get should be called Once');
  t.true(
    userStoreStub.get.calledWith(TABLE, id),
    'get should be called with correct arguments'
  );

  t.true(
    addressControllerStub.getAddressByUserId.called,
    '[Adrdess Controller] getAddressByUserId should be called'
  );
  t.true(
    addressControllerStub.getAddressByUserId.calledOnce,
    '[Address Controller] getAddressByUserId should be called once'
  );

  t.deepEqual(userFixture.findById(id), expected);
});

test.serial('UserController#create', async (t) => {
  const expected = await userController.create(userWithAddress);

  // checks if the controller called the proper services
  t.true(userStoreStub.create.called, 'create should be called');
  t.true(userStoreStub.create.calledOnce, 'create should be called once');
  t.true(
    userStoreStub.create.calledWith(TABLE, sinon.match(user)),
    'create should be called with args'
  );

  // checks if address controller was called correctly
  t.true(addressControllerStub.createAddress.called, 'createAddress should be called');
  t.true(
    addressControllerStub.createAddress.calledOnce,
    'createAddress should be called once'
  );
  t.true(
    addressControllerStub.createAddress.calledWith(id, sinon.match(address)),
    'createAddress shoyld be called with args'
  );

  t.deepEqual({ id, ...user, address }, expected);
});

test.serial('UserController#update', async (t) => {
  userStoreStub.get
    .withArgs(TABLE, id)
    .returns(Promise.resolve({ id, ...userWithAddress }));

  const expected = await userController.update(id, userWithAddress);

  // checks if the controller called the proper services
  t.true(userStoreStub.update.called, 'update should be called');
  t.true(userStoreStub.update.calledOnce, 'update should be called once');
  t.true(
    userStoreStub.update.calledWith(TABLE, id, sinon.match(user)),
    'update should be called with args'
  );

  // checks if address controller was called correctly
  t.true(addressControllerStub.updateAddress.called, 'updateAddress should be called');
  t.true(
    addressControllerStub.updateAddress.calledOnce,
    'updateAddress should be called once'
  );
  t.true(
    addressControllerStub.updateAddress.calledWith(id, sinon.match(address)),
    'updateAddress should be called with correct args'
  );

  t.deepEqual({ id, ...userWithAddress }, expected);
});

test.serial('UserController#Remove', async (t) => {
  await userController.remove(id);

  // checks if the controller called the proper services
  t.true(userStoreStub.remove.called, 'remove should be called');
  t.true(userStoreStub.remove.calledOnce, 'remove should be called Once');
  t.true(
    userStoreStub.remove.calledWith(TABLE, id),
    'remove should be called with correct arguments'
  );
});
