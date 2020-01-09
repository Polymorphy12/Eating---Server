var express  = require('express');
var router   = express.Router();
//var User     = require('../models/User');
var util     = require('./util');
var jwt      = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const { Pool, Client } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'postgres',
    port: 5432
});


router.post('/login',function(req,res,next){
	var isValid = true;
	var validationError = {
            name:'ValidationError',
            errors:{}
        };

        console.log(req.body.params);

      if(!req.body.params.username){
            isValid = false;
            validationError.errors.username = {message:'Username is required!'};
      }
      if(!req.body.params.password){
	            isValid = false;
	            validationError.errors.password = {message:'Password is required!'};
      }
	
	if(!isValid) return res.json(util.successFalse(validationError));	
	else next();

    console.log('done?' + isValid);
	
},
	  
	function(req,res,next){

  pool.query("select * from haktalUser where user_name = '" + req.body.params.username + "'", (err, myRes) =>{
      console.log(myRes.rows);
      if(!myRes.rows.length){
        res.json("아이디 또는 비밀번호가 잘못되었습니다.");
      }
      else {
          a = bcrypt.compareSync(req.body.params.password, myRes.rows[0].password);
          return_message = a ? "로그인에 성공하였습니다." : "아이디 또는 비밀번호가 잘못되었습니다.";
          res.json(return_message);
      }
  });


	}
);





router.get('/me', util.isLoggedin,  
	function(req,res,next) {
	User.findById(req.decoded._id)
	.exec(function(err,user){
		if(err||!user) return res.json(util.successFalse(err));	
		res.json(util.successTrue(user));
	});
	}
);



router.get('/refresh', util.isLoggedin,	  
	function(req,res,next) {
		User.findById(req.decoded._id)
		.exec(function(err,user){	
			if(err||!user) return res.json(util.successFalse(err));
			else {
				var payload = {					
					_id : user._id,					
					username: user.username			
				};	
				var secretOrPrivateKey = process.env.JWT_SECRET;		
				var options = {expiresIn: 60*60*24};	
				jwt.sign(payload, secretOrPrivateKey, options, function(err, token){	
					if(err) return res.json(util.successFalse(err));	
					res.json(util.successTrue(token));		
				});		
			}
		});    
	}
);

module.exports = router;
