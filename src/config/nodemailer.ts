import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const config = () => {
    return {
        host: process.env.EMAIL_HOST,
        port: +process.env.EMAIL_PORT,
        auth: {},
        secure: false
    }
}

export const transport = nodemailer.createTransport(config());