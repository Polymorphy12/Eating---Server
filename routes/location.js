const { Pool, Client } = require('pg');

const pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'postgres',
        password: 'postgres',
        port: 5432
});

var express = require('express');
var router = express.Router();



/* GET home page. */
router.get('/', function(req, res, next) {

    if(!req.query.username)
    {
        res.json("시스템에 문제가 생겼습니다. 고객센터에 문의해주세요.");
        return;
    }


    pool.query("select * from deliv_location", (err, myRes) => {
        //console.log("@@@@", myRes.rows)
        res.json(myRes.rows)
    });
    //console.log('!!!! res : ' , res.rows);
    //res.json({message: 'Hello Haktal!'});
});

router.put('/', function(req, res, next){

    if(!req.body.username || !req.body.purchase_location)
    {
        res.json("시스템에 문제가 생겼습니다. 고객센터에 문의해주세요.");
        return;
    }
    var username = req.body.username;
    var purchase_location = req.body.purchase_location;
    pool.query("update haktaluser set purchase_location = '" 
    + purchase_location + "' where user_name = '" + username +"'", (err, myRes) => {
        res.json(myRes.rows)
    });
});

module.exports = router;


