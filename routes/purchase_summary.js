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

var order_no = 0;



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

router.get('/plan_summary', function(req,res,next) {
    
	if(!req.query.username)
    {
        res.json("1시스템에 문제가 생겼습니다. 고객센터에 문의해주세요.");
        return;
    }

    var username = req.query.username;

    /*
    이런 json 데이터를 넘겨줘야 한다.
    총 금액 정보:
    결제 수단(고정), 주문 금액(가져오기), 할인 금액(고정), 결제 금액

    배달 정보:
    주문번호(생성), 담당자(고정), 배달시간(고정,TBD), 배달장소(가져오기)

    2019-11-06 현재, 
    결제수단은 고정되어 있고 할인 수단은 따로 없음. 디폴트 0으로 두었음.
    주문금액은 shopping cart에서 가져와 총합처리를 해야할 것
    주문번호는 여기서 생성해야 할 것
    담당자, 배달시간은 고정시켜둘 것 
    (좀 이따 점심, 저녁을 구분할 때 예외처리 할 것)
    
    배달장소의 경우 유저 테이블에서 가져올 수 있음
    주문금액은 장바구니 테이블에서 가져올 수 있음. 쿼리 두 개 날려야됨.
    */

    var deliv_location = '';
    var total_price = 0;

    //배달장소 가져오기
    pool.query("select * from haktaluser where user_name ='" + username + "'", (err, myRes) =>{
        
            if(!myRes.rows.length){
                res.json("2시스템에 문제가 발생하였습니다. 고객센터에 문의해주세요.");
                return;
            }
            else{
                deliv_location = myRes.rows[0].purchase_location;
                console.log(deliv_location, total_price);
            }

            //주문 금액 가져오기
			pool.query("select * from shopping_cart where user_name ='" + username + "'", (err, cartRes) =>{

					if(!cartRes.rows.length){
						res.json("3시스템에 문제가 발생하였습니다. 고객센터에 문의해주세요.");
						return;
					}
					else{
						for(var i = 0; i < cartRes.rows.length; i++)
						{
							total_price +=
							cartRes.rows[i].menu_price * cartRes.rows[i].amount;
						}
						console.log('2' +deliv_location, total_price);
						if(deliv_location == '' || total_price <= 0)
						{
							res.json(`4시스템에 문제가 발생하였습니다. ${deliv_location} ${total_price}  고객센터에 문의해주세요.`);
							return;
						}
						else
						{
							res.json(
								{
                                    "menu_info" : cartRes.rows,
									"price_info" :
											{
												"total_price" : total_price,
												"discount" : 0,
												"payment_method" : "무통장입금"
											},
									"deliv_info" :
											{
												"deliv_location": deliv_location,
												"deliv_time" : "12 : 30",
												"manager" : "이신형",
												"order_no" : ++ order_no
											}
								}
							);
						}
					}
			});
    });
    

 
});
module.exports = router;
