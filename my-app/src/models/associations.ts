import User from './User';
import Profile from './Profile';
import Post from './Post';
import Comment from './Comment';
import Tag from './Tag';
import PostTags from './PostTags';




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



User.hasOne(Profile, { 
  foreignKey: 'userId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});



Profile.belongsTo(User, { 
  foreignKey: 'userId'
});



Post.belongsTo(User, { 
  foreignKey: 'userId'
});



Post.hasMany(Comment, { 
  foreignKey: 'postId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});



Post.belongsToMany(Tag, { 
  through: 'PostTags',
  foreignKey: 'postId',
  otherKey: 'tagId'
});



Comment.belongsTo(Post, { 
  foreignKey: 'postId'
});



Comment.belongsTo(User, { 
  foreignKey: 'userId'
});



Tag.belongsToMany(Post, { 
  through: 'PostTags',
  foreignKey: 'tagId',
  otherKey: 'postId'
});



PostTags.belongsTo(Post, { 
  foreignKey: 'postId'
});



PostTags.belongsTo(Tag, { 
  foreignKey: 'tagId'
});



export {

  User,

  Profile,

  Post,

  Comment,

  Tag,

  PostTags

};

