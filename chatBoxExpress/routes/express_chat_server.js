/*------------------------------------------/
| file: express_chat_server.js
| author: Angus Brooks
-------------------------------------------*/
const express = require('express');
const router = express.Router();
const DbConfig = require('../db_connect_factory');


console.log("chat server test ", DbConfig.host);

function genTimeStamp() {

  //2020-2-20 13:13:58
  var ts = new Date()
  var time_str = ts.toTimeString().substr(0,9);
  var year = ts.getFullYear();
  var month = ts.getUTCMonth()+1;
  var day = ts.getDate();
  var timeStamp = year +"-"+month+"-"+day+" "+time_str;
  return timeStamp; 
 
}

/* ------------------------------------------------------------------
| roomIDs              (1)
| load room names
| the default state of application for a logged in user
|-------------------------------------------------------------------*/

const sqlstr_sel_chatroom = "select room_id from dcoda_acme.chat_room";
router.get('/', function(req, res) {

  var conn = DbConfig.createConnectDB();
  var roomIDArray = [];

  console.log("Get chat server Successful Route");
  if(req.query.req == "roomIDs") 
  {

    conn.query(sqlstr_sel_chatroom, function (error, room_results, fields) {
		 console.log("Logger ",room_results);
	     if (error) throw error; // 
  	     console.log('The room IDs: ',  room_results.length);
	      room_results.forEach(function(elem) {
          roomIDArray.push(elem.room_id);
          //console.log(roomIdArray);
         });

       res.json(roomIDArray);
    });

  }

  conn.end();

});

/* ---------------------------------------------------------------
| roomLogin         (2)
|
| insert of client into link table +user_cr+ to associate client 
| with a chat room. when a message comes in every entry in link table
| creates an entry  in the chatroom queue  to be later dequeue
|-----------------------------------------------------------------*/

const insert_sqlstr1_user_cr = "insert into user_cr values (?, ?, ?, ?)";
const update_sqlstr1_user_cr = "update user_cr set user_id = ?, room_id = ?, date_ts = ?, room_name = ? where user_id = ?";

router.post('/roomLogin', function(req, res) {
  console.log("Post RoomLogin chat server Successful Route");

  var conn = DbConfig.createConnectDB();

  var q_user_id = req.body.userID;
  var q_room_id = req.body.roomID;
  var q_room_name = q_room_id;
  var q_now_str = genTimeStamp();

  conn.query(insert_sqlstr1_user_cr, [q_user_id, q_room_id, q_now_str, 
					q_room_name ], function (error, results, fields) {
         if (error) {
            console.log('Error message: ', error.sqlMessage);
            var conn2 = DbConfig.createConnectDB();
            conn2.query(update_sqlstr1_user_cr, [ q_user_id, q_room_id, q_now_str, 
						q_room_name, q_user_id], function (error, results, fields) {
             if (error) throw error;
               console.log('Rows changed for update: ', results.changedRows);
    	    });
			conn2.end();
         } 
         console.log('Rows affected for insert: ', results);
   }); 
  
  conn.end();  
  res.send("OK");
});

/*----------------------------------------------------------------
| roomLogout    (3)
|
|  delete from table +user_cr+ for the logged out user
|  send back status
----------------------------------------------------------------*/
const delete_sqlstr1_user_cr = "delete from user_cr where user_id = ? ";

router.post('/roomLogout', function(req, res) {

  var q_user_id = req.body.userID;
  var conn = DbConfig.createConnectDB();

    conn.query(delete_sqlstr1_user_cr, [q_user_id], function (error, results, fields) {
     if (error) throw error;
     console.log('rows affected for deletion: ', results.affectedRows);
    });

  conn.end();

  res.send("OK");
});

/* ------------------------------------------------------------------
| sendMsg      (4)
|
| send message  from client to all other clients logged into chatroom
| the process ->
| a)  gather all clients logged into chatroom via +user_cr+ table and  4a
| b) insert into queue table +chat_room_queue+ via sql insert for     4b
| for all logged in users 
| JSON
| DONE -4
-----------------------------------------------------------------------*/
const select_sqlstr1_send_user_cr = "select user_id from user_cr where room_id = ? " ;
const insert_sqlstr1_chatroom_queue = "insert into chat_room_queue (user_id, room_id, insert_ts, chat_text, msg_user_id) values (?,?,?,?,?) ";

router.post('/sendMsg', function(req, res, next) {
  console.log("Post Send Message chat server Successful Route");

   var q_user_id = req.body.userID;
   var q_room_id = req.body.roomID;
   var q_chat_text = req.body.msgText;
   var q_insert_ts = genTimeStamp();
   var q_msg_user_id;
   var conn = DbConfig.createConnectDB();
   var conn2 = DbConfig.createConnectDB();

   console.log("------------------------------", q_user_id, q_room_id, q_chat_text,q_insert_ts);
   conn.query(select_sqlstr1_send_user_cr, [q_room_id], function (error, msg_user_array, fields) {

    if (error) throw error;
      
      for(var i=0; i <msg_user_array.length; i++) {
         q_msg_user_id = msg_user_array[i].user_id;

         conn2.query(insert_sqlstr1_chatroom_queue, [q_user_id, q_room_id, q_insert_ts, 
				q_chat_text, q_msg_user_id], function (error, results, fields) {
          if (error) throw error;
          console.log('chat text for all users in given room: ', results);

         }); // end insert
      }
      conn2.end();
   }); //end org select

   conn.end(); 
   res.send("OK");
});

/* ------------------------------------------------------------------
| Invalid Session     (5)
|
|
| DONE -5
|-------------------------------------------------------------------*/



module.exports = router;
