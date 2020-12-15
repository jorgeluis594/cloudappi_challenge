const express = require('express');

const response = require('../../../network_helpers/response');
const validation = require('../../../network_helpers/validations');

const { createUserScheema, updateUserScheema } = require('../../../utils/schemas/user');

const Controller = require('./index');

const router = express.Router();

router.get('/getusers', listUsers);
router.get('/getusersById/:userId', getUser);
router.post('/createUsers', validation(createUserScheema), createUser);
router.put('/updateUsersById/:userId', validation(updateUserScheema), updateUser);
router.delete('/deleteUsersById/:userId', deleteUser);

function listUsers(req, res, next) {
  Controller.list()
    .then((users) => {
      response.success(res, users, 200);
    })
    .catch(next);
}

function getUser(req, res, next) {
  const { userId } = req.params;
  Controller.get(userId)
    .then((user) => {
      response.success(res, user, 200);
    })
    .catch(next);
}

function updateUser(req, res, next) {
  const { userId } = req.params;
  const userData = req.body;

  Controller.update(userId, userData)
    .then((updatedUser) => {
      response.success(res, updatedUser, 200);
    })
    .catch(next);
}

function createUser(req, res, next) {
  const user = req.body;
  Controller.create(user)
    .then((createdUser) => {
      response.success(res, createdUser, 201);
    })
    .catch(next);
}

function deleteUser(req, res, next) {
  const { userId } = req.params;

  Controller.remove(userId)
    .then(() => {
      response.success(res, 'ok', 200);
    })
    .catch(next);
}
module.exports = router;
