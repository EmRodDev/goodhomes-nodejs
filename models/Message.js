import {DataTypes} from 'sequelize';
import db from '../config/db.js';

const Message = db.define('Messages', {
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    }

});

export default Message;