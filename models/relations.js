import Property from './Property.js';
import Price from './Price.js';
import Category from './Category.js';
import User from './User.js';
import Message from './Message.js';

Property.belongsTo(Price, {foreignKey: 'priceId', as: 'price'});
Property.belongsTo(Category, {foreignKey: 'categoryId', as: 'category'});
Property.belongsTo(User, {foreignKey: 'userId', as: 'user'});
Property.hasMany(Message, {foreignKey: 'propertyId', as: 'messages'});

Message.belongsTo(Property, {foreignKey: 'propertyId'});
Message.belongsTo(User, {foreignKey: 'userId', as: 'user'});


export {
    Property,
    Price,
    Category,
    User,
    Message
}