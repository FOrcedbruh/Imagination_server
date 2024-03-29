const express = require('express');
const router = express.Router();
const authController = require('./authController');



router.post('/registration', authController.registration);
router.post('/login', authController.login);
router.post('/getNotes', authController.getNotes);
router.post('/createNote', authController.createNote);
router.post('/decodeToken', authController.decodeToken);
router.post('/createAvatar', authController.createAvatar);
router.post('/deleteImagination', authController.deleteImagination);

module.exports = router;


