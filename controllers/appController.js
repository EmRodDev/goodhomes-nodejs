import {Sequelize} from 'sequelize';
import {Price, Category, Property} from '../models/relations.js';

const home = async (req, res) => {

    const [categories, prices, houses, apartments] = await Promise.all([
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
        apartments,
        csrfToken: req.csrfToken(),
        isLogged: req.cookies?._token
    });
}

const category = async (req, res) => {
    const {id} = req.params;

    //Verify that the category exists
    const category = await Category.findByPk(id);

    if(!category){
        return res.redirect('/404');
    }

    //Get the properties of the category
    const properties = await Property.findAll({
        where: {
            categoryId: id
        },
        include : [
            {model: Price, as: 'price'}
        ]
    });

    res.render('category', {
        page: `${category.name}s on Sale`,
        properties,
        csrfToken: req.csrfToken(),
        isLogged: req.cookies?._token
    })
}

const notFound = (req, res) => {
    res.render('404', {
        page: 'Not Found',
        csrfToken: req.csrfToken(),
        isLogged: req.cookies?._token
    })

}

const searcher = async (req, res) => {
    const {term} = req.body;

    //Validate that the term is not empty

    if(!term.trim()){
        return res.redirect('back');
    }

    //Get the properties
    const properties = await Property.findAll({
        where: {
            title: {
                [Sequelize.Op.like] : '%' + term + '%'
            }
        },
        include: [
            {
            model: Price, as: 'price'
            }
        ],
        order: [['createdAt','DESC']]
    });

    res.render('searcher',{
        page: 'Results from the search',
        properties,
        csrfToken: req.csrfToken(),
        isLogged: req.cookies?._token
    })
}




export {home, category, notFound,searcher}