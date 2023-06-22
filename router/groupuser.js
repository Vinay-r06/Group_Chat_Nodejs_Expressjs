const express =require('express');

const router = express.Router();

const userauthentication=require('../middleware/auth');

const grpUserController = require('../controllers/groupchatContl');

router.get('/grpusers/getname', grpUserController.getgrpUsers);

router.post('/group/removemember',userauthentication.authenticate, grpUserController.removeAdmin)

router.post('/group/makeadmin',userauthentication.authenticate, grpUserController.makeAdmin)


module.exports=router;