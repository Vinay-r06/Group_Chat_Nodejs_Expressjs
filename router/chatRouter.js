const express =require('express');

const router = express.Router();

const userauthentication=require('../middleware/auth');

const chatController = require('../controllers/chatController');

router.get('/', userauthentication.authenticate, chatController.getChats);

router.post('/sendMessage',userauthentication.authenticate, chatController.postSentMessage)

module.exports=router;