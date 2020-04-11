const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrpt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
router.get('/', (req, res, next) => {
      User.find().select('_id email password').exec().then(docs => {
            console.log(docs);
            const response =
            {
                  count: docs.length,
                  user: docs.map(docs => {
                        return {
                              _id: docs._id,
                              email: docs.email,
                              password: docs.password,
                              request:
                              {
                                    type: 'GET',
                                    url: 'http://localhost:3000/user/' + docs._id

                              }
                        }
                  })
            };
            res.status(200).json(response);

      }).catch(err => {
            console.log(err);
            res.status(500).json
            {
                  message: '500 Internal Server Error'

            }
      });
});
router.post('/login', (req, res, next) => {
      User.find({ email: req.body.email })
            .exec()
            .then(user => {
                  if (user.length < 1) {
                        res.status(401).json({
                              message: 'Auth Failed'
                        });
                  }
                  else {
                        bcrpt.compare(req.body.password, user[0].password, (err, result) => {
                              if (err) {
                                    res.status(401).json({
                                          message: 'Auth Failed'
                                    });
                              }
                              if (result) {
                                    const token = jwt.sign({
                                          email: user[0].email,
                                          userId: user[0]._id
                                    }, process.env.JWT_KEY,
                                          {
                                                expiresIn: '1h'
                                          }
                                    );
                                    return res.status(200).json({
                                          message: 'Auth Successfull',
                                          token: token
                                    });
                              }
                              res.status(401).json({
                                    message: 'Auth Failed'
                              });
                        });
                  }
            })
            .catch(err => {
                  console.log(err);
                  res.status(500).json
                  {
                        message: '500 Internal Server Error'

                  };
            });
});

router.post('/signup', (req, res, next) => {
      if (ValidateEmail(req.body.email)) {

            User.find({ email: req.body.email }).exec().then(user => {
                  if (user.length >= 1) {
                        return res.status(409).json({
                              message: "email should be unique"
                        });
                  }
                  else {
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
      }
      else {
            console.log("Email pattern Incorrect")
            res.status(500).json({
                  error: "Email pattern Incorrect"
            });
      }



});
function ValidateEmail(mail) {
      const emailToValidate = mail;
      const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

      if (emailRegexp.test(emailToValidate)) {
            return (true);
      }
      else {
            console.log("Email pattern Incorrect")
            return (false);
      }

}
router.delete('/:userId', (req, res, next) => {
      const id = req.param.id;
      ////Get Solution after searching statOverflow and hit and trial of defined methods
      User.deleteOne(id)
            .exec().then(
                  result => {
                        console.log(result);
                        res.status(200).json({
                              message: "user deleted"
                        });
                  }).catch(err => {
                        console.log(err);
                        res.status(500).json({
                              error: err
                        });

                  });
      // res.status(200).json({
      //     message:'Handling DELETE Request to /productId',


      //     });
});
module.exports = router;
