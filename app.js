const express=require('express');
const app=express();
const mongoose=require('mongoose');
const morgan=require('morgan');
const bodyParser=require('body-parser');
const verficationRoutes=require('./routes/verfication')
const organizationRoutes=require('./routes/organization')
const userRoutes=require('./routes/user');
const adviretisementRoutes=require('./routes/advertisement')



app.use('images',express.static('images'));

app.use(bodyParser.json());



app.use(morgan('dev'));
mongoose.Promise=global.Promise;
mongoose.connect( process.env.mongo_uri,()=>{
    console.log('mong connect')
});



app.use(verficationRoutes);
app.use('/organization',organizationRoutes);
app.use('/user',userRoutes);
app.use('/advertisement',adviretisementRoutes)


server=app.listen(process.env.PORT||3000,()=>{
    console.log('running')
})
const io=require('./socket').init(server);
io.on('connection',socket=>{
    console.log('done')
})