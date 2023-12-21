import {Price, Category, Property} from '../models/relations.js';

const home = async (req, res) => {

    const [categories, prices, houses, departments] = await Promise.all([
        Category.findAll({raw: true}),
        Price.findAll({raw: true}),
        Property.findAll({
            limit: 3,
            where: {
                categoryId: 1
            },
            include: [
                {
                    model: Price,
                    as: 'price'
                }
            ],
            order: [['createdAt','DESC']]
        }),
        Property.findAll({
            limit: 3,
            where: {
                categoryId: 2
            },
            include: [
                {
                    model: Price,
                    as: 'price'
                }
            ],
            order: [['createdAt','DESC']]
        })

    ]);


    res.render('home',{
        page: 'Home',
        categories,
        prices,
        houses,
        departments
    });
}

const category = (req, res) => {

}

const notFound = (req, res) => {

}

const searcher = (req, res) => {

}




export {home, category, notFound,searcher}