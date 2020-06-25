const multer=require('multer');

const fileStorage=multer.diskStorage({
    destination:'images',
    filename:(req,file,done)=>{
        done(null,file.originalname)
    }
})

const fileFilter=(req,file,done)=>{
    if(
        file.mimetype==='image/png'||
        file.mimetype==='image/jpg'||
        file.mimetype==='image/jpeg'
    )
        done(null,true)
    else{
        done(null,false)
    }
}
module.exports=multer({storage:fileStorage,fileFilter:fileFilter}).array('files',4)