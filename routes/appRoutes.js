import express from 'express';
import {home,category,notFound,searcher} from '../controllers/appController.js'

const router = express.Router();

//Home page
router.get('/', home);

//Categories
router.get('/categories/:id', category);

//404 page
router.get('/404', notFound);

//Searcher
router.post('/search', searcher);


export default router;