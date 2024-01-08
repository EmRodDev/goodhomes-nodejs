import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import url from 'url';

const identifyUser = async (req, res, next) => {
    //Identify if there is a token
    const {_token} = req.cookies;

    if(!_token){
        req.user = null;
        return next();
    }

    //Check the token
    try {
        const decoded = jwt.verify(_token,process.env.JWT_SECRET);
        const user = await User.scope('deletePassword').findByPk(decoded.id);

        //Store the user to the request

        if(user){
            req.user = user;
        }
        return next();

    }catch (e) {
        return res.clearCookie('_token').redirect('/auth/login');
    }
}

export {identifyUser};