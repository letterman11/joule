/*------------------------------------------/
| file: express_authenticate.js
| author: Angus Brooks
-------------------------------------------*/

const express = require('express');
const router = express.Router();
const mysql = require('mysql');


function createConnectDB() {

	var connection = mysql.createConnection({
	  host     : 'localhost',
	  user     : 'dococt',
	  password : 'dococt',
	  database : 'dcoda_acme'
	});
  
    return connection;
}

sqlstr_sel_auth = "select USER_ID, USER_NAME, USER_PASSWD from dcoda_acme.user  where USER_NAME = ? and  USER_PASSWD = ? ";

router.get('/', function(req, res, next) {
  console.log("Successful Route");
  res.send('Get Authentication Route AA CC DD');

});


router.post('/', function(req, res) {
   console.log("Post Successful Route " + req.body.userName + " " + req.body.userPass);
  
   var connection =  createConnectDB(); 

   q_user_name = req.body.userName;
   q_user_pass = req.body.userPass;

   connection.query(sqlstr_sel_auth, [q_user_name,q_user_pass], function (error, results, fields) {

      if (error) 
      {
		  //throw error
          console.log("Error " + error.stack );
      } 
      else 
      {
         if (results[0] != undefined) 
         {
			console.log("SQL out ", results);
            res.cookie("chatSessionID",req.session.id, { path: "/chatterBox" }); 
		    res.cookie("chatUserID",results[0].USER_NAME, { path: "/chatterBox" });
            res.send("Application Success");
         }
         else
         {
            res.statusCode = 401;
            res.send(" Invalid UserID/Password Entry");
         } 
      }

  });


});




module.exports = router;

