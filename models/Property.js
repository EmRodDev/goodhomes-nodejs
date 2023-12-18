import {DataTypes} from 'sequelize';
import db from '../config/db.js';

const Property = db.define('Property', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    rooms:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    parking_lots:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    bathrooms:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    street:{
        type: DataTypes.STRING(60),
        allowNull: false
    },
    lat:{
        type: DataTypes.STRING,
        allowNull: false
    },
    lng:{
        type: DataTypes.STRING,
        allowNull: false
    },
    images: {
        type: DataTypes.STRING,
        allowNull: false
    },
    published: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }
});

export default Property; 