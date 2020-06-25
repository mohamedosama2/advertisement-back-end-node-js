const passport=require('passport');
const jwtStrategy=require('passport-jwt').Strategy;
const{ExtractJwt}=require('passport-jwt')
const User=require('./models/user')
const Email=require('./models/email')
const Orgamization=require('./models/oraganization')

passport.use(new jwtStrategy({
    jwtFromRequest:ExtractJwt.fromHeader('authenticate'),
    secretOrKey:'secret'
},async(payload,done)=>{
    try{
            
    const user=await User.findById(payload.sub)
    const organization=await Orgamization.findById(payload.sub);


    let x=0
    let y=0
    if(user){
        x=1
    }
    if(organization){
        y=1
    }
    if(x===0&&y===0){
        done(null,false)
    }


    if(user){
        done(null,user)

    }else{
    done(null,organization)
    }

    }catch(err){
        throw(err,false)
    }

}))