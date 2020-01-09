//파일 명 : util.js
//이런 거 안적어놓으니까 계속 혼동하더라고.

//jwt token으로 auth를 처리한다.
var jwt = require('jsonwebtoken');
//이 파일에서는 util을 객체로 만들어놓는구나.
//자바로 생각하면 클래스로 만들어서 가져다 쓰기 좋게 만드는 것인가 봄.
var util = {};

// success했다고 알려주는 함수
util.successTrue = function(data){
	return {
		success:true,
		message:null,
		errors:null,
		data:data
	};
};

util.successFalse = function(err, message){

	if(!err&&!message) message = 'data not found';
	return {
		success: false,
		message:message,
		errors:(err)? util.parseError(err): null,
		data:null
	};

};

util.parseError = function(errors){
	var parsed = {};
	if(errors.name == 'Validation Error'){
        //errors.errors 하니까 알아보기 좀 힘든데?
        //예제에서 errors 구조는 이렇게 되어 있다.
        //
        /*
        {
            name: '에러 이름',
            errors: {
                    username : {message: 'Username is required!'},
                    password : {message: 'Password is required!'}
                }
        }

        위 구조에서 errors 부분을 details 라고 표현하는게 더 보기 쉬울 것 같다.
        */
		for(var name in errors.errors){
            var validationError = errors.errors[name];
            parsed[name] = { message: validationError.message};
        }

        //indexOf가 의미하는게 뭐지?
        //String 내에서 특정문자의 index값 (위치값)
        
	} else if(errors.code == '11000' && errors.errmsg.indexOf('username') > 0){
        parsed.username = {message: 'This username already exists!' };
	} else{
        parsed.unhandled = errors;
	}
    return parsed;
};


// 미들웨어들
// 로그인 되어있는지 확인하는 함수.
// 요청헤더에 x-access-token을 확인한다.
// 토큰이 없으면 실패했다는 에러를 json으로 보내준다.
// 토큰이 있으면, jwt.verify를 한다. (얘가 무슨 함수?)
util.isLoggedin = function(req, res, next){
    var token = req.headers['x-access-token'];
    if (!token) return res.json(util.successFalse(null, 'token is required!'));
    else {
        //verify에서 저 콜백함수가 의미하는게 뭐냐?
        // verify함수와 동시에 비동기적으로 진행되는것.
        //verify 함수가 내놓는 'decoded'라는 데이터를 
        jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
            if(err) return res.json(util.successFalse(err));
            else{
                    req.decoded = decoded;
                    next();
            }
        });
   }
};


module.exports = util;
