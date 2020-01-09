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
var dirname = 'public/images/drawable-hdpi'


/* GET home page. */
router.get('/', function(req, res, next) {

    console.log(req.query.restaurant_name);

	pool.query("select * from menu where restaurant_name = '" + req.query.restaurant_name+ "' and menu_type='메인 메뉴'" , (err, myRes) => {
		console.log(myRes.rows);
		res.json(myRes.rows);
	});
});

module.exports = router;
