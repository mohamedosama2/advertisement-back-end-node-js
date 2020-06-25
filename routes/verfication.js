const express=require('express');
const controllers=require('../controllers/verfication')
const passStr=require('../passport');
const passport=require('passport')
const {body, check}=require('express-validator/check')
multer=require('../multer')
const router=express.Router();



router.post('/otp/send',
    body('email').isEmail()
,controllers.otpSend);
router.post('/otp/verify',[
    body('email').isEmail(),
    body('verify_code').isNumeric()
],controllers.otpVerify);


router.post('/signup',multer,[
    body('email').isEmail(),
    check('nameEn').isString(),
    check('nameAr').isString(),
    check('password').isString()
],controllers.signUp);


router.post('/signin', [
    body('email').isEmail().trim(),
    body('password').isString()
],controllers.signIn);


router.post('/forget-password/send',body('email').isEmail().trim(),controllers.forgetSend);
router.post('/forget-password/verify',[
    body('email').isEmail().trim(),
    body('verify_code').isNumeric(),
    body('password').isString()
],controllers.forgetVerify);
router.post('/change-password',passport.authenticate('jwt',{session:false}),[
    body('email').isEmail().trim(),
    body('newPawword').isString(),
    body('password').isString()
],controllers.changePassword);


module.exports=router