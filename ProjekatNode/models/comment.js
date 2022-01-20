'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Post, User}) {
      // define association here
      this.belongsTo(Post, {foreignKey: 'postId', as: 'post'});
      this.belongsTo(User, {foreignKey: 'userId', as: 'author'});
    }
  }
  Comment.init({
    content: {
      type: Sequelize.STRING,      
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};