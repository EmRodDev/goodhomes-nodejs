import {Price, Category, Property} from '../models/relations.js';

const home = async (req, res) => {

    const [categories, prices] = await Promise.all([
        Category.findAll({raw: true}),
        Price.findAll({raw: true}),

    ]);


    res.render('home',{
        page: 'Home',
        categories,
        prices
    });
}

const category = (req, res) => {

}

const notFound = (req, res) => {

}

const searcher = (req, res) => {

}




export {home, category, notFound,searcher}