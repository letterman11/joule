/*--------------------------------------/
|  file: express_ping_msg_server.js 
|  author: Angus Brooks
|
---------------------------------------*/

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

function genTimeStamp(newStamp) {

  //2020-2-20 13:13:58
  var ts = newStamp || new Date();
  var time_str = ts.toTimeString().substr(0,9);
  var year = ts.getFullYear();
  var month = ts.getUTCMonth()+1;
  var day = ts.getDate();
  var timeStamp = year +"-"+month+"-"+day+" "+time_str;
  return timeStamp;

}


router.get('/', function(req, res, next) {
  console.log("Get express ping msg server Successful Route");
  res.send('Get Ping MSG  Route AA CC DD');

});

/* -- message sent back to client for each client logged into a given chat room --
	{
    "messages" : [ 
                       { 
                          "user_id" :  "jenjen", 
  					     "room_id" :  "basketball", 
                          "msg_text" : "the bee", 
                          "msg_q_id" : "75", 
                          "time_stamp" : "2020-02-21 11:33:52" 
                      }  
					] , 
   "msg_user_ids" : [ "jenjen"  , "jonjon" ]   
   }
*/

function genJSonMsg(res_msg_array, results_user_id) {

   var json_obj;
   var messages_str;
   var users_str;

   console.log("function result set ", res_msg_array);
   if (res_msg_array && res_msg_array.length > 0) {
   messages_str =  " "  +
      "\"messages\" : [ " +
      "   {  " +
    "\n \"user_id\" : \"" +  res_msg_array[0].USER_ID + "\"" +
    ",\n \"room_id\" : \"" + res_msg_array[0].ROOM_ID + "\"" +
    ",\n \"msg_text\" : \"" + res_msg_array[0].CHAT_TEXT + "\"" +
    ",\n \"msg_q_id\" : " + res_msg_array[0].CR_QUEUE_ID +
    ",\n \"time_stamp\" : \"" + genTimeStamp(res_msg_array[0].INSERT_TS) + "\"" +
     "      }  " +
     "   ] , ";  
   }

   users_str = "\n\"msg_user_ids\" : [ ";
   var i = 0;
   for(; i< results_user_id.length-1; i++) {
       users_str += "\"" + results_user_id[i].user_id+"\", ";
   } 
   users_str += "\"" + results_user_id[i].user_id + "\" ] ";
 
   var json_obj = " {\n ";

   if(messages_str) json_obj += messages_str; 

   json_obj += users_str; 
   json_obj += "\n }";
  
  return json_obj;
  
}

const select_sqlstr1_user_cr = "select * from user_cr where user_id = ? ";
const select_sqlstr2_user_cr = "select user_id from user_cr where room_id = ? ";
const select_sqlstr3_chat_room_q = "select * from chat_room_queue  where msg_user_id = ? and insert_ts >= ? order by cr_queue_id desc limit 2 ";
const delete_sqlstr4_chat_room_q  = "delete from chat_room_queue where cr_queue_id = ? ";
/*
const delete_sqlstr4a_chat_room_q  = "delete from chat_room_queue where cr_queue_id in (?,?) ";
 */

/*----------------------------------------------------
the dequeue process for for the chat room queue table
----------------------------------------------------*/
router.post('/', function(req, res, next) {
  console.log("Post express ping msg server Successful Route");



  const q_user_id = req.body.userID;
  const q_room_id = req.body.roomID;
  var g_room_results;

  var conn_1 = createConnectDB();
  var conn_2 = createConnectDB();
  var conn_3 = createConnectDB();
  var conn_4  = createConnectDB();

  conn_1.query(select_sqlstr1_user_cr,[q_user_id], function (error, results_u_cr, fields) {
	     if (error) throw error;

			console.log();
  			conn_2.query(select_sqlstr2_user_cr,[q_room_id], function (error, results_user_id, fields) {
				if (error) throw error;

					var q_time_stamp = results_u_cr[0].DATE_TS;	
					q_msg_user_id = results_u_cr[0].USER_ID;

					console.log("results from link table ", results_u_cr, results_u_cr[0].USER_ID);
  					conn_3.query(select_sqlstr3_chat_room_q,[q_user_id, q_time_stamp], function (error, results_msg_array, fields) {
						if (error) throw error;
					           	
 						q_msg_q_id = null;
                        if ((results_msg_array) && results_msg_array.length > 0 ) {
						console.log("message array  has been created ",results_msg_array[0].CR_QUEUE_ID);
					    q_msg_q_id = results_msg_array[0].CR_QUEUE_ID;

                        }
						console.log("message array ",results_msg_array);
  						conn_4.query(delete_sqlstr4_chat_room_q,[q_msg_q_id], function (error, results_del, fields) {
							if (error) throw error;
							  console.log("Rows affected by deletion ", results_del.affectedRows);	
							var jsonObj = genJSonMsg(results_msg_array, results_user_id);
 							console.log("JSON object sent back to client ", jsonObj);
							//res.json(jsonObj);
							res.send(jsonObj);
						});	
						conn_4.end();
				   });	
				conn_3.end();
			});
		conn_2.end();
  });
	conn_1.end();
  
 //res.send('OK');

});


module.exports = router;
