const Advertisement=require('../models/advirtisement');


exports.displayCategory=async(req,res,next)=>{
    try{
    const currentPage=req.query.page||1;
    const perPage=2
    const category=req.body.category;
    let advertisements=await Advertisement.find({category}).skip((currentPage-1)*perPage).limit(perPage);
    if(!advertisements){
        return res.status(404).json({message:"not found"})
    }
    res.status(200).json({
        message:"sucess",
        advertisements
    })
    }
    catch(error){
        res.status(500).json({error})
    }
}


exports.displayCity=async(req,res,next)=>{
    try{
    const currentPage=req.query.page||1;
    const perPage=2
    const city=req.body.city;
    let advertisements=await Advertisement.find({city}).skip((currentPage-1)*perPage).limit(perPage);
    if(!advertisements){
        return res.status(404).json({message:"not found"})
    }
    res.status(200).json({
        message:"sucess",
        advertisements
    })
    }
    catch(error){
        res.status(500).json({error})
    }
}


exports.advertisement=async(req,res,next)=>{
    try{
    const id=req.params.id;
    const advertisement=await Advertisement.findById(id);
    if(!advertisement){
        return res.status(404).json({
            message:"not found"
        })
    }
    res.status(200).json({
        message:"fetched sucessfully",
        advertisement
    });
}
catch(error){
    res.status(500).json({error})
}}


exports.getIndex=async(req,res,next)=>{
    try{
    const currentPage=req.query.page||1;
    const perPage=2
    const advertisements=await Advertisement.find().skip((currentPage-1)*perPage).limit(perPage);
    if(!advertisements){
        return res.status(404).json({
            message:"not found"
        })
    }
    res.status(200).json({
        message:"success",
        advertisements
    })
}
catch(error){
    res.status(500).json({error})
}
}