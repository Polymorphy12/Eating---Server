// api/user.js

var express  = require('express');
var router   = express.Router();
var util     = require('./util');
var bcrypt = require('bcryptjs');

const { Pool, Client } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'postgres',
    port: 5432
});


// index
router.get('/', /*util.isLoggedin,*/ function(req,res,next){

  pool.query("select * from haktalUser where user_name = '" + req.query.username + "'", (err, myRes) =>{
      console.log(myRes.rows);
      if(!myRes.rows.length){
		pool.query("insert into haktalUser (user_name, e_mail, password) values ('"+req.query.username+"', 'tempmail', 'tempPasswd');", (err, insertRes) => {
              if(!err)
                res.json("successful");
              });
      }
      else {
          res.json(myRes.rows); 
      }
  });


/*  User.find({})
  .sort({username:1})
  .exec(function(err,users){
    res.json(err||!users? util.successFalse(err): util.successTrue(users));
  });*/
});

// create
router.post('/', function(req,res,next){


if(req.body.params.password != req.body.params.passwordCheck){
    res.json("비밀번호 확인이 일치하지 않습니다.");
    return;
}

userName = req.body.params.username;
 pool.query("select * from haktalUser where user_name = '" + userName+ "'", (err, myRes) =>{
      console.log(myRes.rows);
      if(!myRes.rows.length){
          hashedPasswd = bcrypt.hashSync(req.body.params.password);
        pool.query("insert into haktalUser (user_name, e_mail, password) values ('"+userName+"', 'tempmail', '"+ hashedPasswd+"');", (err, insertRes) => {
              if(!err)
                res.json("successful");
              });
      }
      else {
          res.json(myRes.rows);
      }
  }); 

  
  /*var newUser = new User(req.body);
  newUser.save(function(err,user){
    res.json(err||!user? util.successFalse(err): util.successTrue(user));
  });*/
});

// show
router.get('/:username', util.isLoggedin, function(req,res,next){
//  User.findOne({username:req.params.username})
  //.exec(function(err,user){
    //res.json(err||!user? util.successFalse(err): util.successTrue(user));
  //});
});

// update
router.put('/:username', util.isLoggedin, checkPermission, function(req,res,next){
/*  User.findOne({username:req.params.username})
  .select({password:1})
  .exec(function(err,user){
    if(err||!user) return res.json(util.successFalse(err));

    // update user object
    user.originalPassword = user.password;
    user.password = req.body.newPassword? req.body.newPassword: user.password;
    for(var p in req.body){
      user[p] = req.body[p];
    }

    // save updated user
    user.save(function(err,user){
      if(err||!user) return res.json(util.successFalse(err));
      else {
        user.password = undefined;
        res.json(util.successTrue(user));
      }
    });
  });*/
});

// destroy
router.delete('/:username', util.isLoggedin, checkPermission, function(req,res,next){
 /* User.findOneAndRemove({username:req.params.username})
  .exec(function(err,user){
    res.json(err||!user? util.successFalse(err): util.successTrue(user));
  });*/
});

module.exports = router;

// private functions
function checkPermission(req,res,next){ //*
  /*User.findOne({username:req.params.username}, function(err,user){
    if(err||!user) return res.json(util.successFalse(err));
    else if(!req.decoded || user._id != req.decoded._id) 
      return res.json(util.successFalse(null,'You don\'t have permission'));
    else next();
  });*/
}
