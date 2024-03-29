import express from "express";
import {body} from "express-validator";

import {admin, create, save, addImage, storeImage, edit, saveChanges, deleteProperty, changeState, showProperty, sendMessage, seeMessages} from '../controllers/propertyController.js';
import protectRoute from "../middleware/protectRoute.js";
import upload from '../middleware/uploadImage.js';
import {identifyUser} from '../middleware/identifyUser.js';


const router = express.Router();


router.get('/my-properties', protectRoute , admin);
router.get('/properties/create', protectRoute, create);
router.post('/properties/create', protectRoute,
    body('title')
    .notEmpty().withMessage('The title field is required'),
    body('description')
    .notEmpty().withMessage('The description field is required')
    .isLength({max: 2000}).withMessage('The description is too long'),
    body('category')
    .isNumeric().withMessage('Please select a category'),
    body('price')
    .isNumeric().withMessage('Please select a price'),
    body('rooms')
    .isNumeric().withMessage('Please select the number of rooms'),
    body('parking_lots')
    .isNumeric().withMessage('Please select the number of parking lots'),
    body('bathrooms')
    .isNumeric().withMessage('Please select the number of bathrooms'),
    body('lat')
    .notEmpty().withMessage('Please locate the property on the map'),
    save
);

router.get('/properties/add-image/:id', protectRoute , addImage);

router.post('/properties/add-image/:id',protectRoute, upload.single('image'), storeImage);

router.get('/properties/edit/:id', protectRoute, edit);

router.post('/properties/edit/:id', protectRoute,
    body('title')
    .notEmpty().withMessage('The title field is required'),
    body('description')
    .notEmpty().withMessage('The description field is required')
    .isLength({max: 2000}).withMessage('The description is too long'),
    body('category')
    .isNumeric().withMessage('Please select a category'),
    body('price')
    .isNumeric().withMessage('Please select a price'),
    body('rooms')
    .isNumeric().withMessage('Please select the number of rooms'),
    body('parking_lots')
    .isNumeric().withMessage('Please select the number of parking lots'),
    body('bathrooms')
    .isNumeric().withMessage('Please select the number of bathrooms'),
    body('lat')
    .notEmpty().withMessage('Please locate the property on the map'),
    saveChanges
);

router.post('/properties/delete/:id', protectRoute, deleteProperty);

router.put('/properties/:id', 
    protectRoute,
    changeState);

//Public area
router.get('/property/:id', identifyUser ,showProperty);

//Store the message

router.post('/property/:id', 
identifyUser,
body('message').isLength({min: 10}).withMessage('The message cannot be empty or it\'s too short'),
sendMessage);

router.get('/messages/:id', 
protectRoute,
seeMessages);


export default router;