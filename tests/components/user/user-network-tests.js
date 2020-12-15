const test = require('ava');
const superTest = require('supertest');
const express = require('express');
const proxyquire = require('proxyquire').noCallThru();

const userControllerMock = require('../../utils/user-controller-mock');
const handlerError = require('../../../network_helpers/errors');

const userNetwork = proxyquire('../../../api/components/user/network', {
  './index': userControllerMock,
});

const app = express();

// config responses
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(userNetwork);
app.use(handlerError);

const request = superTest(app);

test.serial('GET /getusers', async (t) => {
  const response = await request.get('/getusers');
  const expected = await userControllerMock.list();

  t.is(response.status, 200, 'should response 200 satus code');
  t.deepEqual(response.body.body, expected);
});

test.serial('GET /getusersById/{userId}', async (t) => {
  const response = await request.get('/getusersById/1');
  const expected = await userControllerMock.get(1);

  t.is(response.status, 200, 'should be response 200 status code');
  t.deepEqual(response.body.body, expected);
});

test.serial('GET /getusersById/{userId} worng id', async (t) => {
  const response = await request.get('/getusersById/30');

  t.is(response.status, 401, 'should response 401 status code');
  t.is(response.body.body, 'User not found');
});

test.serial('POST /createUsers', async (t) => {
  const user = {
    name: 'test',
    email: 'test@test.com',
    birthDate: '02-01-1994',
    address: {
      street: 'av test',
      state: 'state test',
      city: 'city test',
      country: 'country test',
      zip: 'zip test',
    },
  };
  const response = await request.post('/createUsers').send(user);
  const expectedUser = await userControllerMock.get(response.body.body.id);

  t.is(response.status, 201, 'should response 201 status code');
  t.deepEqual(response.body.body, expectedUser, 'should be iquals');
});

test.serial('PUT /updateUsersById/{userId}', async (t) => {
  const user = {
    name: 'testj',
    birthDate: '02-01-1994',
    address: {
      state: 'state test',
      city: 'city test',
      country: 'country test',
      zip: 'zip test',
    },
  };

  const response = await request.put('/updateUsersById/2').send(user);

  const expectedUser = await userControllerMock.get(response.body.body.id);

  t.is(response.status, 200, 'should be response 200 status code');
  t.deepEqual(response.body.body, expectedUser, 'should be the same');
});

test.serial('PUT /updateUsersById/{userId} worng id', async (t) => {
  const user = {
    name: 'testj',
    birthDate: '02-01-1994',
    address: {
      state: 'state test',
      city: 'city test',
      country: 'country test',
      zip: 'zip test',
    },
  };

  const response = await request.put('/updateUsersById/20').send(user);

  t.is(response.status, 401, 'should response 401 status code');
  t.is(response.body.body, 'User not found');
});
