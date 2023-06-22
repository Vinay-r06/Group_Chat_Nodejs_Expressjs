const express =require('express');

const router = express.Router();

const userController= require('../controllers/userControllers');

router.post('/signup', userController.postSignup);

router.post('/login', userController.postlogin);

router.get('/signup', userController.getusers);


module.exports=router;