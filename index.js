import express from 'express';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import userRoutes from './routes/userRoutes.js';
import propertiesRoutes from './routes/propertiesRoutes.js';
import appRoutes from './routes/appRoutes.js';
import apiRoutes from './routes/apiRoutes.js';

import db from './config/db.js';


dotenv.config({ path: '.env' });


//Create app
const app = express();

//Enable form data reading

app.use(express.urlencoded({extended: true}));

//Enable Cookie Parser
app.use( cookieParser());

//Enable CSRF

app.use(csrf({cookie: true}));

//Connection to the database
try{
    await db.authenticate();
    //Create tables if it doesn't exist
    db.sync();
    console.log('Successfully connected to the database')
} catch (e){
    console.log(e);
}

//Enable Pug
app.set('view engine','pug');
app.set('views','./views');

//Public folder
app.use(express.static('public'));


//Routing
app.use('/',appRoutes);
app.use('/auth',userRoutes);
app.use('/',propertiesRoutes);
app.use('/api',apiRoutes);



const port = process.env.BACKEND_PORT || 3000;
app.listen(port, () =>{
    console.log(`The server is running on port ${port}`)
});