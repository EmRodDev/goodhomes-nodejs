import {validationResult} from "express-validator";
import {unlink} from 'node:fs/promises';
import {Price, Category, Property, Message, User} from "../models/relations.js";
import { isSeller, formatDate } from "../helpers/index.js";

const admin = async (req, res) => {

    // Read QueryString
    const {p : actualPage} = req.query;

    const regularExp = /^[1-9]$/;

    if(!regularExp.test(actualPage)){
        return res.redirect('/my-properties?p=1');
    }

    try{
    const  { id } = req.user;

    //Limits and offset for the pagination
    const limit = 10;

    const offset = ((actualPage * limit) - limit);

    const [properties, totalProperties] = await Promise.all([
        Property.findAll({
            limit,
            offset,
            where: {
                userId: id
            },
            include: [
                {model: Category, as: 'category'},
                {model: Price, as: 'price'},
                {model: Message, as: 'messages'}
            ]
        }),
        Property.count({
            where:{
                userId: id
            }
        })
    ]);

    res.render('properties/admin', {
        page: 'My properties',
        pages: Math.ceil(totalProperties / limit),
        actualPage: parseInt(actualPage),
        totalProperties,
        offset,
        limit,
        properties,
        csrfToken: req.csrfToken()
    });

    }catch(err){
        console.error(err);
    }
};

//Form to create a new property
const create = async (req, res) => {

    // Request Price and Category models
    const [categories,prices] = await Promise.all([
        Category.findAll(),
        Price.findAll()
    ]);

    res.render('properties/create', {
        page: 'Create property',
        csrfToken: req.csrfToken(),
        categories: categories,
        prices: prices,
        data: {}
    });
};

const save = async (req, res) => {

    //Validation
    let result = validationResult(req);

    if(!result.isEmpty()){
        // Request Price and Category models
        const [categories,prices] = await Promise.all([
            Category.findAll(),
            Price.findAll()
        ]);

        res.render('properties/create', {
            page: 'Create property',
            csrfToken: req.csrfToken(),
            categories: categories,
            prices: prices,
            errors: result.array(),
            data: req.body
        });
    }

    //Create a register
    const {
            title,
            description,
            rooms,
            parking_lots,
            bathrooms,
            street,
            lat,
            lng,
            price : priceId,
            category : categoryId

        
        } = req.body;

    const {id: userId} = req.user;

    try{
        const storedProperty = await Property.create({
            title,
            description,
            rooms,
            parking_lots,
            bathrooms,
            street,
            lat,
            lng,
            priceId,
            categoryId,
            userId,
            images: ""
        });
    const {id} = storedProperty;

    res.redirect(`/properties/add-image/${id}`);

    } catch (err){
        console.error(err);
    }

}

const addImage = async (req,res) => {
    
    const {id} = req.params;

    //Validate that the property exists
    const property = await Property.findByPk(id);

    if(!property){
        return res.redirect('/my-properties');
    }

    //Validate that the property is not published
    if(property.published) {
        return res.redirect('/my-properties');
    }

    //Validate that the property belongs to who visits this page
    if(req.user.id.toString() !== property.userId.toString()){
        return res.redirect('/my-properties');
    }

    res.render('properties/add-image', {
        page: `Add Image: ${property.title}`,
        csrfToken: req.csrfToken(),
        property

    });
}

const storeImage = async (req,res,next) => {

    const {id} = req.params;

    //Validate that the property exists
    const property = await Property.findByPk(id);

    if(!property){
        return res.redirect('/my-properties');
    }

    //Validate that the property is not published
    if(property.published) {
        return res.redirect('/my-properties');
    }

    //Validate that the property belongs to who visits this page
    if(req.user.id.toString() !== property.userId.toString()){
        return res.redirect('/my-properties');
    }

    try {
        console.log(req.file);
        //Store the image and publish the property
        property.images = req.file.filename;

        property.published = 1;

        await property.save();

        next();

    } catch (err){
        console.log(err);
    }

}

const edit = async (req,res) => {

    const {id} = req.params;

    //Validate if the property exists

    const property = await Property.findByPk(id);

    if(!property){
        return res.redirect('/my-properties');
    }

    //Check if the user who visits the URL is who created the property

    if(property.userId.toString() !== req.user.id.toString()){
        return res.redirect('/my-properties');
    }

    // Request Price and Category models
    const [categories,prices] = await Promise.all([
        Category.findAll(),
        Price.findAll()
    ]);

    res.render('properties/edit', {
        page: `Edit property: ${property.title}`,
        csrfToken: req.csrfToken(),
        categories,
        prices,
        data: property    
    });
}

const saveChanges = async (req,res) => {

    //Verify the validation
    let result = validationResult(req);

    if(!result.isEmpty()){
        // Request Price and Category models
        const [categories,prices] = await Promise.all([
            Category.findAll(),
            Price.findAll()
        ]);

        res.render('properties/edit', {
            page: `Edit property`,
            csrfToken: req.csrfToken(),
            categories,
            prices,
            data: req.body,
            errors: result.array()
        });
    }

    const {id} = req.params;

    //Validate if the property exists

    const property = await Property.findByPk(id);

    if(!property){
        return res.redirect('/my-properties');
    }

    //Check if the user who visits the URL is who created the property

    if(property.userId.toString() !== req.user.id.toString()){
        return res.redirect('/my-properties');
    }

    //Rewrite the object and update it

    try{
        console.log(property)

        const {title,description,rooms,parking_lots,bathrooms,street,lat,lng,price : priceId,category : categoryId} = req.body;

        property.set({
            title,
            description,
            rooms,
            parking_lots,
            bathrooms,
            street,
            lat,
            lng,
            priceId,
            categoryId
        });

        await property.save();

        res.redirect('/my-properties')
    }catch(err){
        console.log(err);
    }
}

const deleteProperty = async (req, res) => {

    const {id} = req.params;

    //Validate if the property exists

    const property = await Property.findByPk(id);

    if(!property){
        return res.redirect('/my-properties');
    }

    //Check if the user who visits the URL is who created the property

    if(property.userId.toString() !== req.user.id.toString()){
        return res.redirect('/my-properties');
    }

    //Delete the image
    if(property.images){
        await unlink(`public/uploads/${property.images}`);
    }
    

    //Delete the property

    await property.destroy();


    return res.redirect('/my-properties');
}

//Modifies the state of the property 
const changeState = async (req,res) => {

    const {id} = req.params;

    //Validate if the property exists

    const property = await Property.findByPk(id);

    if(!property){
        return res.redirect('/my-properties');
    }

    //Check if the user who visits the URL is who created the property

    if(property.userId.toString() !== req.user.id.toString()){
        return res.redirect('/my-properties');
    }

    //Update
    property.published = !property.published;

    await property.save();

    res.json({
        result: 'OK'
    });
}

//Shows a property

const showProperty = async(req,res) => {

    const {id} = req.params;

    //Validate if the property exists
    const property = await Property.findByPk(id,{
        include: [
            {model: Category, as: 'category'},
            {model: Price, as: 'price'}
        ]
    });

    if(!property || !property.published){
        return res.redirect('/404');
    }


    res.render('properties/show',{
        property,
        page: property.title,
        csrfToken: req.csrfToken(),
        user: req.user,
        isSeller: isSeller(req.user?.id, property.userId),
        isLogged: req.cookies?._token
    });
}

const sendMessage = async(req,res) => {
    const {id} = req.params;

    //Validate if the property exists
    const property = await Property.findByPk(id,{
        include: [
            {model: Category, as: 'category'},
            {model: Price, as: 'price'}
        ]
    });

    if(!property){
        return res.redirect('/404');
    }

    if(property.published == 0){
        if(isSeller(req.user?.id, property.userId)){
            return res.redirect(`/properties/add-image/${id}`);
        }
        else{
            return res.redirect('/404');
        }
    }
    
    //Render the errors

    //Validation
    let result = validationResult(req);

    if(!result.isEmpty()){
        return res.render('properties/show',{
            property,
            page: property.title,
            csrfToken: req.csrfToken(),
            user: req.user,
            isSeller: isSeller(req.user?.id, property.userId),
            errors: result.array(),
            isLogged: req.cookies?._token
        });
    }

    const {message} = req.body;
    const {id: propertyId} = req.params;
    const {id: userId} = req.user;

    //Store the message
    await Message.create({
        message,
        propertyId,
        userId,
    });

    return res.render('properties/show',{
        property,
        page: property.title,
        csrfToken: req.csrfToken(),
        user: req.user,
        isSeller: isSeller(req.user?.id, property.userId),
        sent: true,
        isLogged: req.cookies?._token
    });


}

//Read received messages

const seeMessages = async (req,res) => {

    const {id} = req.params;

    //Validate if the property exists

    const property = await Property.findByPk(id,{
        include: [
            {model: Message, as: 'messages', include: [
                {
                    model: User.scope('deletePassword'), as: 'user'
                }
            ]
        },
        ]
    });

    if(!property){
        return res.redirect('/my-properties');
    }

    //Check if the user who visits the URL is who created the property

    if(property.userId.toString() !== req.user.id.toString()){
        return res.redirect('/my-properties');
    }
    
    res.render('properties/messages',{
        page: 'Messages',
        messages: property.messages,
        formatDate,
        isLogged: req.cookies?._token
    });
}

export {admin, create, save, addImage, storeImage, edit, saveChanges, deleteProperty, changeState, showProperty, sendMessage, seeMessages}