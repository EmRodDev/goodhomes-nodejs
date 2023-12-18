import jwt from 'jsonwebtoken';

import {User} from '../models/relations.js';

const protectRoute = async (req, res, next) => {
    
    //Verify if there is any token
    const {_token} = req.cookies;

    if(!_token){
        return res.redirect('auth/login');
    }

    //Check the token
    try {

        const decoded = jwt.verify(_token,process.env.JWT_SECRET);
        const user = await User.scope('deletePassword').findByPk(decoded.id);

        //Store the user to the request

        if(user) {
            req.user = user;
        } else {
            return res.redirect('auth/login');
        }
        
        return next();

    } catch(err){
        return res.clearCookie('_token').redirect('auth/login');

    }
}

export default protectRoute;