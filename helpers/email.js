import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const emailRegistration = async (data) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const {email, name, token} = data;

    //Send email
    await transport.sendMail({
        from: 'goodhomes@dev.com',
        to: email,
        subject: 'Confirm your account',
        text: '',
        html: `
        <p>Hi there, ${name}</p>
        <p>Your account at GoodHomes was created successfully, but it requires to be activated in order to use it.</p>
        <p>Please enter the following link to do that: 
        <a href="${process.env.EMAIL_APP_URL}/auth/confirm/${token}">Confirm account</a>
        </p>

        <p>If you didn't create this account, you can ignore this message.</p>
        `
    })
}

const emailForgotPassword = async (data) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const {email, name, token} = data;

    //Send email
    await transport.sendMail({
        from: 'goodhomes@dev.com',
        to: email,
        subject: "Recover your account's password",
        text: '',
        html: `
        <p>Hi there, ${name}</p>
        <p>We sent you this email because you have forgotten your account's password</p>
        <p>Please enter the following link to generate a new password: 
        <a href="${process.env.EMAIL_APP_URL}/auth/forgot-password/${token}">Reset your password</a>
        </p>

        <p>If you didn't request this change, you can ignore this message.</p>
        `
    })
}


export { emailRegistration, emailForgotPassword }

