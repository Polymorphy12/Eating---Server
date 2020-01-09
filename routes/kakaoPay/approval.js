var express = require('express');
var router = express.Router();
var axios = require('axios');
var qs = require('querystring')


var output;

function setOutput(responseData){

	console.log('I am response Data!', responseData);
	output = responseData;
	console.log('I am output!', output);
}


function getOutput(){

	 var data = {	
		 cid : 'TC0ONETIME',		 
		 partner_order_id : 'partner_order_id',		 
		 partner_user_id : 'partner_user_id',		 
		 item_name : '초코파이',		 
		 quantity : 1,		 
		 total_amount : 2200,		 
		 vat_amount : 200,		  
		 tax_free_amount : 0,		 
		 approval_url : 'http://13.124.193.165:3000',		 
		 fail_url : 'http://13.124.193.165:3000/Oauth/fail',		 
		 cancel_url : 'http://13.124.193.165:3000/Oauth/cancel'		 
	 };

	//console.log(JSON.stringify(data));
	axios.defaults.headers.common['Authorization'] = 'KakaoAK 2cc3d7606061a6cc4cd67f9a83449c8d';	
	axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';


	return axios.post(	
		'https://kapi.kakao.com/v1/payment/ready', qs.stringify(data)		
	).then( response => {	
		console.log('success!' , response.data);

		setOutput(response.data);
	}).catch(error => {	
		console.log('failed', error.config, error.response.data);
		setOutput(error.response.data);
	});

}

/* GET home page. */
router.get('/', function(req, res, next) {

	getOutput().then(() =>{
		console.log("output : ", output);
		//res.json({message: output.next_redirect_app_url});
		res.json({scheme: output.android_app_scheme, redirect: output.next_redirect_app_url});
	});

});

module.exports = router;

