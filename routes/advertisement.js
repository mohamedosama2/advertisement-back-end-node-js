const express=require('express');
const controllers=require('../controllers/advertisement')
const passStr=require('../passport');
const passport=require('passport')
multer=require('../multer')

const router=express.Router();

router.get('/getIndex',controllers.getIndex)
router.get('/displayCategory',controllers.displayCategory)
router.get('/displayCity',controllers.displayCity)
router.get('/advertisement/:id',passport.authenticate('jwt',{session:false}),controllers.advertisement)



module.exports=router