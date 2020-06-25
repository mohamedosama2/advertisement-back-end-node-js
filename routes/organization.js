const express=require('express');
const controllers=require('../controllers/organization')
const {body}=require('express-validator/check')
const passStr=require('../passport');
const passport=require('passport')
multer=require('../multer')

const router=express.Router();


router.post('/addPost',passport.authenticate('jwt',{session:false}),multer,[
    body('title').isString(),
    body('category').isString(),
    body('number').isNumeric(),
    body('city').isString(),
    body('description').isString(),
    body('address').isString()
],controllers.addPost)
router.get('/getLikers',passport.authenticate('jwt',{session:false}),controllers.getLikers)
router.get('/userActivity/:id',passport.authenticate('jwt',{session:false}),controllers.userActivity)
router.delete('/deleteAdvertisement/:id',passport.authenticate('jwt',{session:false}),controllers.deleteAdvertisement)
router.get('/organization/:id',passport.authenticate('jwt',{session:false}),controllers.organization)
router.put('/addInfo',passport.authenticate('jwt',{session:false}),controllers.addInfo)
router.get('/organizations',passport.authenticate('jwt',{session:false}),controllers.organizations)
router.get('/organizationCity',passport.authenticate('jwt',{session:false}),controllers.organizationCity)





module.exports=router