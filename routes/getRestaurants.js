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

	pool.query('select * from restaurant', (err, myRes) => {
		//console.log("@@@@", myRes.rows)
		res.json(myRes.rows)
	});
	//console.log('!!!! res : ' , res.rows);
	//res.json({message: 'Hello Haktal!'});
});

module.exports = router;
