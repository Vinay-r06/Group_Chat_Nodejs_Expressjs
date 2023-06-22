const express =require('express');

const router = express.Router();

const userauthentication=require('../middleware/auth');

const grpController = require('../controllers/groupController');

router.post('/group/creategrp', userauthentication.authenticate, grpController.createGroup);

router.get('/users/getgroupname',userauthentication.authenticate, grpController.getgroupname)

module.exports=router;