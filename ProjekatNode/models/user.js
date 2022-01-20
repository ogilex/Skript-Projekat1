'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Post, Comment}) {
      // define association here
      this.hasMany(Post, {foreignKey: 'userId', as: 'posts', onDelete: 'cascade', hooks: true});
      this.hasMany(Comment, {foreignKey: 'userId', as: 'comments', onDelete: 'cascade', hooks: true});
    }
  }
  User.init({
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.STRING,      
      allowNull: false
    },
    role: {
      type: Sequelize.STRING,      
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};