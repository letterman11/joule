const express = require('express');
const router = express.Router();
const DbConfig = require('../db_connect_factory');


function form_validate(request_body) {

  return  true;
}

var insert_sqlstr_reg = "insert into user (user_name,user_passwd,user_id,email_address) values (?,?,?,?)";

router.get('/', function(req, res, next) {
  console.log("Get registration server Successful Route");
  res.send('Get registration  Route AA CC DD');

});

router.post('/', function(req, res, next) {
  console.log("Post registration server Successful Route");

  var q_user_name = req.body.userName;
  var q_email_address = req.body.email;
  var q_passwd = req.body.password;

  var conn = DbConfig.createConnectDB();

  conn.query(insert_sqlstr_reg, [q_user_name, q_passwd, q_user_name, q_email_address ], function (error, results, fields) {

         if (error) {
            if(error.sqlMessage.match(/Duplicate/)) res.send(q_user_name +  " User already exists");
			else
				throw error;
            console.log('Error message: ', error.sqlMessage);
      
         } else {
            console.log('Rows affected for insert: ', results.affectedRows);
  			res.send(q_user_name +  " Registration Successful");
		} 
  });

});

module.exports = router;
