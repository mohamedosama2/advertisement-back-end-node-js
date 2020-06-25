const express=require('express');
const controllers=require('../controllers/users')
const passStr=require('../passport');
const passport=require('passport')
multer=require('../multer')

const router=express.Router();



router.post('/addLike/:advertisementId',passport.authenticate('jwt',{session:false}),controllers.addLike)
router.delete('/deleteLike/:advertisementId',passport.authenticate('jwt',{session:false}),controllers.deleteLike)
router.post('/addFollow/:id',passport.authenticate('jwt',{session:false}),controllers.addFollow)
router.delete('/deleteFollow/:id',passport.authenticate('jwt',{session:false}),controllers.deleteFollow)




module.exports=router