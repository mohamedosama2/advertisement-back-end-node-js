const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const userSchema=new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    nameAr:{
        type:String,
        required:true
    },
    nameEn:{
        type:String,
        required:true
    },
    password:{
        type:String
    },
    image:{
        type:String
    },
    rule:{
        type:String,
        default:'normal'
    }
})
module.exports=mongoose.model('user',userSchema);