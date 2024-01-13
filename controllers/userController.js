import { check, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import User from "../models/User.js";
import { generateId, generateJWT } from '../helpers/tokens.js';
import { emailRegistration, emailForgotPassword } from '../helpers/email.js';

const loginForm = (req, res) => {
    res.render('auth/login', {
        page: 'Sign in',
        csrfToken: req.csrfToken()
    })
}

const authenticate = async(req, res) => {
    //Validation
    await check('email')
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("That doesn't seems to be an email")
        .run(req);

    await check('passwd')
        .notEmpty().withMessage("Password is required")
        .run(req);

        let result = validationResult(req);


    //Verify that the result is empty
    if (!result.isEmpty()) {
        //Errors
        return res.render('auth/login', {
            page: 'Sign in',
            csrfToken: req.csrfToken(),
            errors: result.array()
        })

    }

    const {email, passwd} = req.body;
    const user = await User.findOne({where: {email}});

    //Check if the user exists
    
    if(!user){
        return res.render('auth/login', {
            page: 'Sign in',
            csrfToken: req.csrfToken(),
            errors: [{msg: 'The user does not exist'}]
        })
    }

    //Check if the user is confirmed
    if(!user.confirmed){
        return res.render('auth/login', {
            page: 'Sign in',
            csrfToken: req.csrfToken(),
            errors: [{msg: 'Your account has not been confirmed yet. Please confirm it first to sign in'}]
        })
    }

    //Check the user's password
    if(!user.verifyPassword(passwd)){
        return res.render('auth/login', {
            page: 'Sign in',
            csrfToken: req.csrfToken(),
            errors: [{msg: 'The password is not correct'}]
        })
    }

    //Authenticate the user
    const token = generateJWT({id: user.id, name: user.name});

    //Store in a cookie
    return res.cookie('_token', token, {
        httpOnly: true,
        //secure: true
    }).redirect('/my-properties');
}

const logOut = (req, res) =>{
    return res.clearCookie('_token').status(200).redirect('/');
}

const registerForm = (req, res) => {
    res.render('auth/register', {
        page: 'Sign up',
        csrfToken: req.csrfToken()
    })
}

const confirm = async (req, res) => {
    const { token } = req.params;

    //Verify if the token is valid

    const user = await User.findOne({ where: { token } });

    if (!user) {
        res.render('auth/confirm-account', {
            page: 'Verification',
            error: true,
            message: 'The token provided is invalid. Please verify that the URL given is valid or contact support.'
        });
    }
    else{
        //Confirm account

        user.token = null;
        user.confirmed = true;

        await user.save();

        res.render('auth/confirm-account', {
            page: 'Verification',
            message: 'The account has been verified successfully'
        })

    }
}

const signUp = async (req, res) => {
    //Validations
    await check('name')
        .notEmpty().withMessage("'Name' field cannot be empty")
        .run(req);

    await check('email')
        .isEmail().withMessage("That doesn't seems to be an email")
        .run(req);

    await check('passwd')
        .notEmpty().withMessage("'Password' field cannot be empty")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
        .run(req);

    await check('repeat_passwd')
        .equals(req.body.passwd).withMessage("The password field values are not equal")
        .run(req);

    let result = validationResult(req);


    //Verify that the result is empty
    if (!result.isEmpty()) {
        //Errors
        return res.render('auth/register', {
            page: 'Sign up',
            csrfToken: req.csrfToken(),
            errors: result.array(),
            user: {
                name: req.body.name,
                email: req.body.email
            }

        })

    }

    //verify that the user is not duplicated
    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
        return res.render('auth/register', {
            page: 'Sign up',
            csrfToken: req.csrfToken(),
            errors: [{ msg: 'The email is already registered' }],
            user: {
                name: req.body.name,
                email: req.body.email
            }

        });

    }

    //Create the user
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.passwd,
        token: generateId()
    })

    //Send confirmation email
    emailRegistration({
        name: user.name,
        email: user.email,
        token: user.token
    });

    return res.render('templates/message', {
        page: 'Account created succesfully',
        message: 'We have sent you a confirmation email to activate your account, please check your inbox'

    });




}

const forgotPasswordForm = (req, res) => {
    res.render('auth/forgot-password', {
        csrfToken: req.csrfToken(),
        page: 'Recover your password'
    })
}

const resetPassword = async(req, res) => {
    await check('email')
        .isEmail().withMessage("That doesn't seems to be an email")
        .run(req);

    let result = validationResult(req);


    //Verify that the result is empty
    if (!result.isEmpty()) {
        //Errors
        return res.render('auth/forgot-password', {
            page: 'Recover your password',
            csrfToken: req.csrfToken(),
            errors: result.array()
        })

    }

    //Search the user
    const user = await User.findOne({ where: { email: req.body.email } });

    if(!user){
        return res.render('auth/forgot-password', {
            page: 'Reset your password',
            csrfToken: req.csrfToken(),
            errors: [{msg: "The email doesn't belong to a registered user"}]
        })
    }

    //Generate a token and send an email
    user.token = generateId();
    await user.save();

    //Send an email
    emailForgotPassword({
        email: user.email,
        name: user.name,
        token: user.token
    });

    //Render a message
    return res.render('templates/message', {
        page: 'Reset your password',
        message: 'We have sent you a confirmation email with the instruccions, please check your inbox'

    });

}

const checkToken = async(req,res) => {

    const {token} = req.params;

    const user = await User.findOne({where: {token}});
    if(!user){
        res.render('auth/confirm-account', {
            page: 'Reset your password',
            error: true,
            message: 'The token provided is invalid. Please verify that the URL given is valid or contact support.'
        });
    }

    //Show a form to modify the password
    res.render('auth/reset-password', {
        page: 'Reset your password',
        csrfToken: req.csrfToken()
    })

}

const newPassword = async(req,res) => {
    //Validate password
    await check('password')
    .notEmpty().withMessage("Password field cannot be empty")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
    .run(req);

    let result = validationResult(req);

    //Verify that the result is empty
    if (!result.isEmpty()) {
        //Errors
        return res.render('auth/reset-password', {
            page: 'Reset your password',
            csrfToken: req.csrfToken(),
            errors: result.array()
        })

    }

    const {token} = req.params;
    const {password} = req.body;

    //Identify who does the change
    const user = await User.findOne({where: {token}});

    //Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.token = null;
    await user.save();

    res.render('auth/confirm-account', {
        page: 'Password changed',
        message: 'The password was changed succesfully'
    })

    
}

export { loginForm, logOut, registerForm, confirm, forgotPasswordForm, signUp, resetPassword, checkToken, newPassword, authenticate }