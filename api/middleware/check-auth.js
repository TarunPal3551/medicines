const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
      try {
            const token=req.headers.authorization.split(" ")[1];
            console.log(token);
            
            const decode = jwt.decode(token, process.env.JWT_KEY);
            console.log(decode);
            if(decode)
            {
                  req.userData = decode;
                  next();
            }
            else{
                  return res.status(401).json({
                        message: 'Auth Failed'
                  });
            }
           
            

      } catch (error) {
            return res.status(401).json({
                  message: 'Auth Failed'
            });
      }

};