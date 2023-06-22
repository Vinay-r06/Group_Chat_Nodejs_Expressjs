const express= require("express");
const path= require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'frontend')));

const bodyParser=require("body-parser");

const cors =require('cors');
app.use(cors());


const io = require('socket.io')(8000,{
    cors:{
        origin:'*',
    }
});

io.on('connection', socket=>{
    socket.on('send-message', room=>{
        console.log(room);
        io.emit('receive-message', room);
    });
})


const dotenv=require('dotenv');
dotenv.config();


const sequelize = require('./util/database');

app.use(bodyParser.urlencoded({extended:false}));     // with this we can get output in vs terminal key: value format.. 
app.use(bodyParser.json());


const userRouter= require ("./router/userRouter");
const chatRouter= require ("./router/chatRouter");
const createGroup=require('./router/createGroup');
const groupuser=require('./router/groupuser')



app.use('/user', userRouter);
app.use('/user', chatRouter);
app.use(createGroup);
app.use(groupuser);



app.use((req,res,next)=>{
    res.status(404).send("<h1>page not found</h1>");
});

const User=require('./models/userModel');
const Chat=require('./models/chatModel')
const Group=require('./models/group');
const UserGroup=require('./models/groupuser')

User.hasMany(Chat);
Chat.belongsTo(User);

User.belongsToMany(Group, {through: 'usergroup', foreignKey:'userId'})
Group.belongsToMany(User, {through: 'usergroup', foreignKey:'groupId'})


Group.hasMany(Chat);
Chat.belongsTo(Group)

sequelize
   .sync({alter:true})
  // .sync({force:true}) 
        .then((result)=>{

    app.listen(3000);
})
.catch((err)=>console.log(err));



 




