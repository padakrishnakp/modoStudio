const express = require('express');
const { getUsers, addUser } = require('../controllers/userController');
const router = express.Router();

router.get('/all-users', getUsers);

router.post('/users', addUser);  

module.exports = router;
