const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrpt = require('bcrypt');

const User = require('../models/user');
router.post('/signup', (req, res, next) => {
      User.find({email:req.body.email}).exec().then(user=>{
            if(user.length>=1){
                  return res.status(409).json({
                message:"email should be unique"
                  });
            }
            else{
                  bcrpt.hash(req.body.password, 10, (err, hash) => {
                        if (err) {
                              return res.status(500).json({
                                    error: err
                              });
                        }
                        else {
            
                              const user = new User({
                                    _id: new mongoose.Types.ObjectId(),
                                    email: req.body.email,
                                    password: hash
            
                              });
                              user.save().then(result => {
                                    console.log(result);
                                    res.status(201).json({
                                          message: 'User Created Successfully'
                                    }).catch(err => {
                                          console.log(err);
                                          res.status(500).json({
                                                error: err
                                          });
                                    });
                              });
                        }
            
                  });
            }
      });
      

});
router.delete('/:userId',(req,res,next)=>{
      const id=req.param.id;
      ////Get Solution after searching statOverflow and hit and trial of defined methods
          User.deleteOne(id)
          .exec().then(
              result=>{
              console.log(result); 
              res.status(200).json({
                    message:"user deleted"
              });
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


module.exports = router;
