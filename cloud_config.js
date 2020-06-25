const cloudinary=require('cloudinary');
require('dotenv').config()

cloudinary.config({
    cloud_name:process.env.cloud_name,
    api_key:process.env.api_key,
    api_secret:process.env.api_secret
})

exports.uploads=(file)=>{
    return new Promise (resolve=>{
        cloudinary.uploader.upload(file,(result)=>{
            resolve({url:result.url})
        },{resource_type:'auto'})
    })
}