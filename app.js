const express=require('express');
const morgan=require('morgan');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const app=express();
const productRoutes=require('./api/routes/products');
const orderRoutes=require('./api/routes/orders');
const userRoutes=require('./api/routes/users');
mongoose.connect('mongodb+srv://admin:'+ process.env.MONGO_ATLAS_PW+'@firstnode-ijo0j.mongodb.net/test?retryWrites=true&w=majority',({

useNewUrlParser:true,
useUnifiedTopology: true,
useFindAndModify:false,
useCreateIndex:true
}));
mongoose.Promise=global.Promise;
app.use(morgan('dev'));
app.use('/uploads',express.static('uploads')); '/uploads',
app.use(bodyParser.urlencoded({ extended:false}));
app.use(bodyParser.json());


app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*"); 
    res.header("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept,Authorization");
    if(req.method=='OPTIONS'){
      res.header("Access-Control-Allow-Methods","PUT,POST,PATCH,DELETE,GET");
      return res.status(200).json({});

    }   
next();
});
///Routes which should handle requests 
app.set("view engine","ejs");
app.route("/").get((req,res)=>{
    res.render('home.ejs');
    res.send("Working Successfully ");
})
app.use('/products',productRoutes);
app.use('/orders',orderRoutes);
app.use('/users',userRoutes);

app.use((req,res,next)=>{
const error =new Error('Not Found');
error.status=404;
next(error);
});
app.use((error,req,res,next)=>{
    res.status(error.status||500);
    res.json({
        error:{
            message:error.message
        }


    });
    });
module.exports=app;
