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

    pool.query("select * from shopping_cart where user_name = '" + req.query.username + "'", (err, myRes) => {
        //console.log("@@@@", myRes.rows)
        res.json(myRes.rows)
    });
    //console.log('!!!! res : ' , res.rows);
    //res.json({message: 'Hello Haktal!'});
});

router.post('/', function(req, res, next) {

    var username = req.body.params.username;
    var amount = req.body.params.amount;
    var menu_name = req.body.params.menu_name;
    
    console.log("ddddd", username, amount, menu_name);

    if(!req.body.params.username || req.body.params.amount <= 0)
    {
		console.log(req.body.params.username, req.body.params.amount);
        res.json("시스템에 문제가 발생하였습니다. 고객센터에 문의해주세요.");
        return;
    }

    pool.query("select * from menu where menu_name = '" + menu_name + "'", (err, myRes) =>{
        if(!myRes.rows.length){
            res.json("시스템(메뉴)에 문제가 발생하였습니다. 고객센터에 문의해주세요.");
            return;
        }
        else{
            var restaurant_name = myRes.rows[0].restaurant_name;
            var menu_type = myRes.rows[0].menu_type;
            var menu_price = myRes.rows[0].menu_price;
            var menu_image = myRes.rows[0].menu_image;
            console.log("dddddddddddd");

            pool.query("select * from shopping_cart where user_name = '"
            + username + "' and menu_name = '" + menu_name +"'", (err, selectFirstRes) => {

                if(!selectFirstRes.rows.length){
		            pool.query("insert into shopping_cart (user_name, menu_name, restaurant_name, menu_type, menu_price, menu_image, amount) values ('"
        		    + username + "', '" + menu_name + "', '" + restaurant_name + "', '"
       			    + menu_type + "', '" + menu_price + "', '" + menu_image + "', '" +amount
            		+"')" , (err, insertRes) =>{

                		if(!err){
                		}
                		else res.json(err);
            		});

                }
                else{
                    var tempAmount = amount + selectFirstRes.rows[0].amount;

                    pool.query("update shopping_cart SET amount = " +tempAmount +" where user_name = '" 
                    + username +"' and menu_name = '" + menu_name+ "'", (err, updateRes) => {
                        
                        if(!err){
                            console.log(amount + " added");
                        }
                    });
                }

                //  console.log("@@@@", selectFirstRes.rows)
                //  res.json(selectRes.rows);
                //  return;
            });

            //여기 이전까지는 장바구니에 메뉴 추가 처리 과정
            //여기 이후에는 get과 동일한 방식.

			pool.query("select * from shopping_cart where user_name = '"
            + username + "'", (err, selectRes) => {
                  console.log("@@@@", myRes.rows)
                  res.json(selectRes.rows);
                  return;
            });

        }
    
    });
});

module.exports = router;

