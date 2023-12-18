import users from "./users.js";
import prices from "./prices.js";
import categories from "./categories.js";
import db from "../config/db.js";

import {Category, Price, User} from '../models/relations.js';

const importData = async () => {
    try {
        //Authenticate
        await db.authenticate();
        
        //Generate the columns
        await db.sync();
        
        //Insert data
        await Promise.all([
            Category.bulkCreate(categories),
            Price.bulkCreate(prices),
            User.bulkCreate(users)
        ]);


        console.log('Data imported successfully');
        process.exit();

    } catch (err){
        console.error(err);
        process.exit(1);
    }
}

const deleteData = async () => {
    try{
        await Promise.all([
            Category.destroy({where: {}, truncate: {cascade: true} }),
            Price.destroy({where: {}, truncate: {cascade: true} }),
            User.destroy({where: {}, truncate: {cascade: true} })
        ]);
        console.log('Data deleted successfully');
        process.exit();
    }catch(err){
        console.error(err);
        process.exit(1);
    }
}

if(process.argv[2] === "-import"){
    importData();
}

if(process.argv[2] === "-delete"){
    deleteData();
}