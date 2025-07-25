import User from './User';
import Profile from './Profile';
import Category from './Category';
import Post from './Post';
import Tag from './Tag';
import PostTag from './PostTag';
import Comment from './Comment';
import Media from './Media';




User.hasOne(Profile, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});



User.hasMany(Post, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});



User.hasMany(Comment, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});



Profile.belongsTo(User, {
  foreignKey: 'userId'
});



Category.hasMany(Post, {
  foreignKey: 'categoryId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});



Post.belongsTo(User, {
  foreignKey: 'authorId'
});



Post.belongsTo(Category, {
  foreignKey: 'categoryId'
});



Post.hasMany(Comment, {
  foreignKey: 'postId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});



Post.belongsToMany(Tag, {
  through: 'PostTag',
  foreignKey: 'postId',
  otherKey: 'tagId'
});



Tag.belongsToMany(Post, {
  through: 'PostTag',
  foreignKey: 'tagId',
  otherKey: 'postId'
});



PostTag.belongsTo(Post, {
  foreignKey: 'postId'
});



PostTag.belongsTo(Tag, {
  foreignKey: 'tagId'
});



Comment.belongsTo(Post, {
  foreignKey: 'postId'
});



Comment.belongsTo(User, {
  foreignKey: 'authorId'
});



Comment.belongsTo(Comment, {
  foreignKey: 'parentId'
});



Comment.hasMany(Comment, {
  foreignKey: 'commentId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});



Media.belongsTo(User, {
  foreignKey: 'uploaderId'
});



export {

  User,

  Profile,

  Category,

  Post,

  Tag,

  PostTag,

  Comment,

  Media

};
