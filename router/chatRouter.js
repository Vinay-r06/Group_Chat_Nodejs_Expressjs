const express =require('express');

const router = express.Router();

const userauthentication=require('../middleware/auth');

const chatController = require('../controllers/chatController');

router.get('/chat', chatController.getchat);

router.post('/chat',userauthentication.authenticate, chatController.postSentMessage)

module.exports=router;