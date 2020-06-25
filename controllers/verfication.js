const User = require('../models/user');
const Email = require('../models/email');
const nodemailer = require('nodemailer')
const nodeTransport = require('nodemailer-sendgrid-transport')
const bcrypt = require('bcryptjs');
var CodeGenerator = require('node-code-generator');
var generator = new CodeGenerator();
const jwt = require('jsonwebtoken');
require('dotenv').config()
const cloud = require('../cloud_config');
const fs = require('fs');
const Oraganization = require('../models/oraganization');
const {validationResult}=require('express-validator/check')


exports.otpSend = async (req, res, next) => {
    try {
        const error=validationResult(req)
        if(!error.isEmpty()){
            return res.status(422).json({
                message:error.array()[0].msg
            })
        }
        const rule = req.body.rule
        const email = req.body.email;
        const existed = await Email.findOne({ email })
        if (existed) {
            return res.status(400).json({
                message: 'email used before'
            })
        }
        const token = generator.generateCodes("#+#+#", 100)[0];
        console.log(token)
        const transporter = nodemailer.createTransport(nodeTransport({
            auth: { api_key: process.env.email_key }
        }))
        transporter.sendMail({
            to: email,
            from: 'mohamed.osama.kamel11111@gmail.com',
            subject: 'hello',
            html: `<h1>  registered successfully </h1>
                <h4> the verfy code is  ${token}  </h4> `
        })

        const email1 = new Email({
            email,
            verify_code: token,
            rule
        })
        await email1.save()
        res.status(201).json({
            result: "check your email for verification code",
            email: email
        })
    }
    catch (error) {
        res.status(500).json({ error })
    }
}


exports.otpVerify = async (req, res, next) => {
    try {
        const error=validationResult(req)
        if(!error.isEmpty()){
            return res.status(422).json({
                message:error.array()[0].msg
            })
        }
        const verify_code = req.body.verify_code;
        const email = req.body.email;
        const email1 = await Email.findOne({ email, verify_code })
        if (!email1) {
            return res.status(404).json({
                message: "not founded "
            })
        }
        email1.confirmed = true
        await email1.save()
        res.status(200).json({
            message: "the email confirmed successfully",
            rule: email1.rule
        })
    }
    catch (err) {
        res.status(500).json({ err })
    }
}


exports.signUp = async (req, res, next) => {
    try {

        const error=validationResult(req)
        if(!error.isEmpty()){
            console.log(error)
            return res.status(422).json({
                message:error.array()[0].msg
            })
        }

        const email = req.body.email;
        const nameAr = req.body.nameAr;
        const nameEn = req.body.nameEn;
        const password = req.body.password;
        const address = req.body.address;
        const overview = req.body.overview;
        const city = req.body.city;
        const email1 = await Email.findOne({ email, confirmed: true });
        if (!email1) {
            return res.status(400).json({
                message: "the email hasn't confirmed yet pleasse confirm"
            })
        }
        let user;
        let organization
        const existed = await User.findOne({ email })
        if (existed) {
            res.status(401).json({
                message: "already existed"
            })
        }

        const existedOraganization = await Oraganization.findOne({ email })
        if (existedOraganization) {
            res.status(401).json({
                message: "already existed"
            })
        }
      //  console.log(req.files[1])

      /*  if (req.files[1]){
           return res.status(400).json({
                message: "must input one image at max "
            })
        }*/
         console.log('hereaaa')

        const hashed = await bcrypt.hash(password, 12)
        if (!req.files && email1.rule === 'organization') {
            organization = new Oraganization({
                email,
                nameAr,
                nameEn,
                password: hashed,
                address,
                city,
                overview
            })
            await organization.save();
        }
        else if (email1.rule === 'organization') {
            const path = req.files[0].destination + '/' + req.files[0].originalname
            const result = await cloud.uploads(path)
            organization = new Oraganization({
                email,
                nameAr,
                nameEn,
                password: hashed,
                address,
                city,
                overview,
                image: result.url
            })
            await organization.save();
            fs.unlinkSync(path)
        }
        else if (!req.files) {
            console.log('here')
            user = new User({
                email,
                nameAr,
                nameEn,
                password: hashed,
            })
            await user.save();
        }
        else {
            const path = req.files[0].destination + '/' + req.files[0].originalname
            const result = await cloud.uploads(path)
            user = new User({
                email,
                nameAr,
                nameEn,
                password: hashed,
                image: result.url
            })
            await user.save();
            fs.unlinkSync(path)
        }
        let accessToken;
        if (email1.rule === 'user') {
            accessToken = jwt.sign({
                sub: user._id,
            }, process.env.keyy, { expiresIn: '3h' })
        } else {
            accessToken = jwt.sign({
                sub: organization._id,
            }, process.env.keyy, { expiresIn: '3h' })
        }

        res.status(201).json({
            token: accessToken,
            message: `${email1.rule} is created `
        })
    }

    catch (error) {
        res.status(500).json({ error })
    }
}



exports.signIn = async (req, res, next) => {
    try {
        const error=validationResult(req)
        if(!error.isEmpty()){
            return res.status(422).json({
                message:error.array()[0].msg
            })
        }
        const email = req.body.email;
        const password = req.body.password;
        const email1 = await Email.findOne({ email, confirmed: true });
        if (!email1) {
            return res.status(404).json({
                message: "the email is not founded"
            })
        }
        let user;
        let organization;
        if (email1.rule === 'user') {
            user = await User.findOne({ email })
            if (!user) {
                return res.status(404).json({
                    message: "not found"
                })
            }
        }
        else {
            organization = await Oraganization.findOne({ email })
            if (!organization) {
                return res.status(404).json({
                    message: "not found"
                })
            }
        }

        let accessToken;
        if (email1.rule === 'user') {
            const doMathch = await bcrypt.compare(password, user.password);
            if (!doMathch) {
                return res.status(400).json({
                    message: "the password not correct"
                })
            }
            accessToken = jwt.sign({
                sub: user.id,
            }, process.env.keyy, { expiresIn: '3h' })
        } else {
            console.log('hnaa')

            const doMathch = await bcrypt.compare(password, organization.password);
            if (!doMathch) {
                return res.status(400).json({
                    message: "the password not correct"
                })
            }
            accessToken = jwt.sign({
                sub: organization.id,
            }, process.env.keyy, { expiresIn: '3h' })
        }

        res.status(200).json({
            message: "sucess",
            token: accessToken
        })
    }
    catch (error) {
        res.status(500).json({ error })
    }
}


exports.forgetSend = async (req, res, next) => {
    try {
        const error=validationResult(req)
        if(!error.isEmpty()){
            return res.status(422).json({
                message:error.array()[0].msg
            })
        }
        const email = req.body.email;
        const email1 = await Email.findOne({ email });
        if (!email1) {
            return res.status(404).json({
                message: "the email is not founded"
            })
        }
        const token = generator.generateCodes("#+#+#", 100)[0];

        const transporter = nodemailer.createTransport(nodeTransport({
            auth: { api_key: process.env.email_key }
        }))
        transporter.sendMail({
            to: email,
            from: 'mohamed.osama.kamel11111@gmail.com',
            subject: 'hello',
            html: `<h1>  registered successfully </h1>
                <h4> the verfy code is  ${token}  </h4> `
        })
        email1.confirmed = false;
        email1.verify_code = token;
        email1.save()
        res.status(200).json({
            message: "check your mail for the verfy code"
        })
    }
    catch (error) {
        res.status(500).json({ error })
    }
}


exports.forgetVerify = async (req, res, next) => {
    try {
        const error=validationResult(req)
        if(!error.isEmpty()){
            return res.status(422).json({
                message:error.array()[0].msg
            })
        }
        const email = req.body.email;
        const verify_code = req.body.verify_code;
        const password = req.body.password;
        const email1 = await Email.findOne({ email, verify_code, confirmed: false })
        if (!email1) {
            return res.status(404).json({
                message: "the email is not founded"
            })
        }
        let hashed;
        if (email1.rule === 'user') {
            const user = await User.findOne({ email })
            if (!user) {
                return res.status(404).json({
                    message: "not found"
                })
            }
            hashed = await bcrypt.hash(password, 12)
            user.password = hashed;
            await user.save();
        }
        else {
            const organization = await Oraganization.findOne({ email })
            if (!organization) {
                return res.status(404).json({
                    message: "not found"
                })
            }
            hashed = await bcrypt.hash(password, 12)
            organization.password = hashed;
            await organization.save();
        }
        email1.confirmed = true;
        await email1.save();
        res.status(200).json({
            message: "sucees the password has reset",
            rule: email1.rule
        })
    }
    catch (error) {
        res.status(500).json({ error })
    }
}



exports.changePassword = async (req, res, next) => {
    try {
        const error=validationResult(req)
        if(!error.isEmpty()){
            return res.status(422).json({
                message:error.array()[0].msg
            })
        }
        const email = req.body.email;
        const password = req.body.password;
        const newPassword = req.body.newPassword;
        const email1 = await Email.findOne({ email })
        if (!email1) {
            return res.status(404).json({
                message: "the email is not founded"
            })
        }
        let user;
        let organization;
        if (email1.rule === 'user') {
            user = await User.findOne({ email })
            if (!user) {
                return res.status(404).json({
                    message: "not found"
                })
            }
        }
        else {
            organization = await Oraganization.findOne({ email })
            if (!organization) {
                return res.status(404).json({
                    message: "not found"
                })
            }
        }

        if (email1.rule === 'user') {
            const doMathch = await bcrypt.compare(password, user.password);
            if (!doMathch) {
                return res.status(400).json({
                    message: "the password not correct"
                })
            }
            const hashed = await bcrypt.hash(newPassword, 12)
            user.password = hashed;
            await user.save();
        } else {
            const doMathch = await bcrypt.compare(password, organization.password);
            if (!doMathch) {
                return res.status(400).json({
                    message: "the password not correct"
                })
            }
            const hashed = await bcrypt.hash(newPassword, 12)
            organization.password = hashed;
            await organization.save();
        }

        res.status(200).json({
            message: "password has changed successfully"
        });
    }
    catch (error) {
        res.status(500).json({ error })
    }
}




