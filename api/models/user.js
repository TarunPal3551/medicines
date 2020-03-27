const mongoose=require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
const userSchema=new Schema({
      _id:ObjectId,
      email:{type:String,required:true},
      password:{type:String,required:true}


});
module.exports=mongoose.model('User',userSchema);