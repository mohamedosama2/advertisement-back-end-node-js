const Organization = require('../models/oraganization');
const Advertisement = require('../models/advirtisement')
require('dotenv').config()
const cloud = require('../cloud_config');
const fs = require('fs');
const {validationResult}=require('express-validator/check')
const io=require('../socket')

exports.addPost = async (req, res, next) => {
    try {
        const error=validationResult(req)
        if(!error.isEmpty()){
            console.log(error)
            return res.status(422).json({
                message:error.array()[0].msg
            })
        }
        const title = req.body.title;
        const category = req.body.category;
        const number = req.body.number;
        const address = req.body.address;
        const city = req.body.city;
        const description = req.body.description;

        let path;
        let result;
        const img = [];

        for (let i = 0; i < req.files.length; i++) {
            path = req.files[i].destination + '/' + req.files[i].originalname
            result = await cloud.uploads(path)
            img.push(result.url)
            fs.unlinkSync(path)
        }
        const organization = await Organization.findById(req.user.id)
        if (!organization) {
            return res.status(404).json({ message: "not found" })
        }
        const advirtisement = new Advertisement({
            title,
            category,
            number,
            address,
            city,
            description,
            image: img,
            orgId: organization.id
        })
        await advirtisement.save();
      //  io.getIO().emit('advertisements',{action:'create',advertisement});
        res.status(201).json({
            message: "advertisement added",
            advirtisement
        })
    }
    catch (error) {
        res.status(500).json({
            error
        })
    }
}

exports.getLikers = async (req, res, next) => {
    try {
        console.log(req.user.id)
        let advertisements = await Advertisement.find({orgId:req.user.id}).populate('orgId').populate('likes.user')
        console.log(advertisements)
        if (!advertisements) {
            return res.status(404).json({
                message: "not found"
            })
        }
        let users = []
        advertisements.forEach(advertisement => {
            advertisement.likes.forEach(like => {
                if (like.user) {
                    console.log('k')
                    users.push(like.user.email)
                }
            });
        });
        res.status(200).json({
            message: "sucess",
            users
        })
    }
    catch (error) {
        res.status(500).json({ error })
    }
}


exports.userActivity = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const existed = await Organization.findById(req.user.id);
        if (!existed) {
            res.status(404).json({
                message: "not found"
            })
        }
        let x = 0
        existed.followers.forEach(follow => {
            if (follow.toString() === userId.toString()) {
                x = 1
            }
        });
        if (x === 0) {
            return res.status(400).json({
                message: "can't know his activities "
            })
        }
        let orgName = [];
        const advertisements = await Advertisement.find({ "likes.user": userId })
        let organizations = await Organization.find()
        organizations.forEach(organization => {
            organization.followers.forEach(follow => {

                if (follow.toString() === userId.toString()) {
                    orgName.push(organization.nameEn)
                }
            });
        });
        res.status(200).json({
            message: "sucess",
            "advertisements that he likes": advertisements,
            "organizations that he follows": orgName
        })
    }
    catch (error) {
        res.status(500).json({ error })
    }
}


exports.deleteAdvertisement = async (req, res, next) => {
    try{
    const id = req.params.id;
    const advertisement = await Advertisement.findById(id)
    if (!advertisement) {
        return res.status(404).json({
            message: "not founs"
        })
    }
    await Advertisement.findByIdAndRemove(id)
    res.status(200).json({
        message:"deleted sucessfully"
    })
}
catch(error){
    res.status(500).json({error})
}
}

exports.organization=async(req,res,next)=>{
    try{
    const id=req.params.id;
    const organization=await Organization.findById(id);
    if(!organization){
        return res.status(404).json({
            message:"not found"
        })
    }
    res.status(200).json({
        message:"fetched sucessfully",
        organization
    });
}
catch(error){
    res.status(500).json({error})
}}


exports.addInfo=async(req,res,next)=>{
    try{
    const number=req.body.number;
    const city=req.body.city;
    const address=req.body.address;
    const organization=await Organization.findById(req.user.id);
    if(!organization){
        return res.status(404).json({
            message:"not found"
        })
    }
    if(number){
        organization.number.push(number)
    }
    if(city){
        organization.city.push(city)
    }
    if(address){
        organization.address.push(address)
    }
    console.log(organization)
   await organization.save()
   res.status(200).json({
       message:"sucessfully updated",
       organization
   })
}
catch(error){
    res.status(500).json({error})
}
}



exports.organizations=async(req,res,next)=>{
    try{
    const organizations=await Organization.find()
    if(!organizations){
        return res.status(404).json({
            message:"not found"
        })
    }
    res.status(200).json({
        message:"fetched sucessfully",
        organizations
    });
}
catch(error){
    res.status(500).json({error})
}}

exports.organizationCity=async(req,res,next)=>{
    try{
    const city=req.body.city;
    const currentPage=req.query.page||1;
    const perPage=2
    const organizations=await Organization.find({city}).skip((currentPage-1)*perPage).limit(perPage);

    res.status(200).json({
        message:"fetched Sucsessfully",
        organizations
})
    }
    catch(err){
        res.status(500).json({err})
    }
}