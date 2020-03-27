const express= require('express');
const router= express.Router();
const mongoose=require('mongoose');
const multer=require('multer');
const storages=multer.diskStorage({
 destination:function(req,file,cb){
     cb(null,'./uploads/');

 },filename:function(req,file,cb){
cb(null,Date.now()+file.originalname);
 }   
});
const filter=(req,file,cb)=>{
    if(file.mimetype=='image/jpeg'||file.mimetype=='image/png')
    {
cb(null,true);
    }
    else{
        cb(null,false);
    }
    //for reject
    cb(null,false);

    //for accept
    cb(null,true)
};
const upload=multer({storage: storages,limits:{
   fileSize:1024*1024*5
},fileFilter:filter});

const Product=require('../models/product');

router.get('/',(req,res,next)=>{
    Product.find().select('name price _id productImage').exec().then(docs=>{
console.log(docs);
const response={
    count:docs.length,
    products:docs.map(docs=>{
        return{
        name:docs.name,
        price: docs.price,
        _id: docs._id,
        productImage:docs.productImage,
        request:{
type:'GET',
url:'http://localhost:3000/products/'+docs._id

        }
        }
    })
};
res.status(200).json(response);

    }).catch(err=>{
        console.log(err);
        res.status(500).json
        {
            message:'500 Internal Server Error'

        }
    })


});
router.post('/',upload.single('productImage'),(req,res,next)=>{
    console.log(req.file);
    const product=new Product({
        _id:new mongoose.Types.ObjectId(),
        name:req.body.name,
        price:req.body.price,
        productImage:req.file.path

    });
    product.save().then(result=>{
        console.log(result);
        res.status(201).json({
    
            message:'Handling POST Request to /products',
            createdProduct:result
            
            });
    }).catch(err=>{console.log(err); 
    res.status(500).json({
        error:err
    })});

    
    
    });
router.get('/:productId',(req,res,next)=>{
        const id=req.params.productId;
        Product.findById(id).select('name price _id productImage').exec().then(
            doc=>{
                console.log("From Database",doc);
                if(doc){
                    res.status(200).json(doc);
                }
                else{
                    res.status(404).json({
                        message:'Not Valid Entry Found',
                        status:404
                    });
                }
                
            }
        ).catch(err=>{console.log(err);
        res.status(500).json({
            error:err
        })
    
    });


        // if(id==='t'){
        //     res.status(201).json({
        //         message:'Handling POST Request to /productId',
        //         id: id
                
        //         });
        // }
        // else
        // {
        //     res.status(201).json({
        //         message:'Handling ID',
        //         id: id
                
        //         });
        // }
});
router.delete('/:productId',(req,res,next)=>{
const id=req.param.productId;
////Get Solution after searching statOverflow and hit and trial of defined methods
    Product.deleteOne(id)
    .exec().then(
        result=>{
        console.log(result); 
        res.status(200).json(result);
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
           error:err
        });

    });
                // res.status(200).json({
                //     message:'Handling DELETE Request to /productId',
                
                    
                //     });
 });

//  router.patch('/:productId',function(req,res){
//     const id=req.param.productId;


//     Product.findByIdAndUpdate({_id:"5e6be8acf9ac1a42105931e9"},{"name":"100000000"}, function(err, result){

//         if(err){
//             res.send(err)
//         }
//         else{
//             res.send(result)
//         }

//     });
// });
router.patch("/:productId",(req,res,next)=>{

const id=req.param.productId;
const updateOne={};
for(const ops of req.body){
    updateOne[ops.propName]=ops.value;
}
// Product.update({_id:id},{$set:updateOne})
// .exec()
// .then(result=>{
//     console.log(result);
//     res.status(200).json(result);
// })
/////After Trying lot of thinks ....i start after 4 days ...then i put some efforts in this...
Product.updateOne({id},{$set:updateOne})
.exec()
.then(result=>{
    console.log(result);
    res.status(200).json(result);
})
});
module.exports=router;