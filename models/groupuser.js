const Sequelize=require('sequelize');

const sequelize= require('../util/database');

const user=require('./userModel')

const UserGroup = sequelize.define('usergroup', {
    groupName: {
        type: Sequelize.STRING,
        allowNull:false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    admin:Sequelize.BOOLEAN
});

module.exports=UserGroup;