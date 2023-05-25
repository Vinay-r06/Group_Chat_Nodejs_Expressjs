const Sequelize=require('sequelize');

const sequelize= require('../util/database');

const Chat = sequelize.define('chat', {
    id: {
        type:Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey:true
    },
    message: {
        type: Sequelize.STRING,
        allowNull:false
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports=Chat;