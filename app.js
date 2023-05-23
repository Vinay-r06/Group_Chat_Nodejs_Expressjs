const express= require("express");

const app = express();

const bodyParser=require("body-parser");

const cors =require('cors');
app.use(cors());

const dotenv=require('dotenv');
dotenv.config();


const sequelize = require('./util/database');

app.use(bodyParser.urlencoded({extended:false}));     // with this we can get output in vs terminal key: value format.. 
app.use(bodyParser.json());


const userRouter= require ("./router/userRouter");


app.use('/user', userRouter);


app.use((req,res,next)=>{
    res.status(404).send("<h1>page not found</h1>");
});

sequelize
        .sync()
        .then((result)=>{

    app.listen(3000);
})
.catch((err)=>console.log(err));







