'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User, Comment, Tag}) {
      // define association here
      this.belongsTo(User, {foreignKey: 'userId', as: 'author'});
      this.hasMany(Comment, {foreignKey: 'postId', as:'comments', onDelete:'cascade', hooks: true});
      this.hasMany(Tag, {foreignKey: 'postId', as: 'tags', onDelete: 'cascade', hooks: true});
    }
  }
  Post.init({
    title: {
      type: Sequelize.STRING,      
      allowNull: false
    },
    content: {
      type: Sequelize.STRING,      
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};