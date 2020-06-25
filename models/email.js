const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const emailSchema=new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    verify_code:{
        type:Number,
    },
    confirmed:{
        type:Boolean,
        default:false
    },
    rule:{
        type:String,
        default:'user',
        enum:['user','organization']
    }
});
module.exports=mongoose.model('email',emailSchema);