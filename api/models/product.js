const mongoose=require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
    const productSchema=new Schema({
      _id:ObjectId,
      name:{type:String,required:true},
      price:{type:Number,required:true},
      productImage:{type:String,required:true}

});
module.exports=mongoose.model('Product',productSchema);