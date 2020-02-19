/*------------------------------------------/
| file: express_chat_server.js
| author: Angus Brooks
-------------------------------------------*/
var express = require('express');
var router = express.Router();
var mysql = require('mysql');


function createConnectDB() {

    var connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'dococt',
      password : 'dococt',
      database : 'dcoda_acme'
    });

    return connection;
}


/* ------------------------------------------------------------------
| roomIDs              (1)
| load room names
|-------------------------------------------------------------------*/

var sqlstr_sel_chatroom = "select room_id from dcoda_acme.chat_room";
router.get('/', function(req, res) {

  connection = createConnectDB();
  var roomIdArray = [];
  console.log("Get chat server Successful Route");
  if(req.query.req == "roomIDs") 
  {
   	 connection.query(sqlstr_sel_chatroom, function (error, results, fields) {
	     if (error) throw error;
  	     console.log('The room IDs: ', results);
	     results.forEach(function(elem) {
          roomIdArray.push(elem.room_id);
          console.log(roomIdArray);
         });

       console.log("bank ", roomIdArray);
       res.json(roomIdArray);
    });
    
  }
  connection.end();

});

/* ---------------------------------------------------------------
| roomLogin         (2)
|
| insert of client into link table +user_cr+ to associate client 
| with a chat room   thus creating an entry in the chatroom queue table
|-----------------------------------------------------------------*/

var sqlstr1_insert_user_cr = "insert into user_cr values (?, ?, ?)";
var sqlstr1_update_user_cr = "update user_cr set  user_id = ?, room_id = ?, date_ts = ?, room_name = ?, where user_id = ?";

router.post('/roomLogin', function(req, res, next) {
  console.log("Post RoomLogin chat server Successful Route");

    connection.query(sqlstr1_sel_chatroom, [q_user_id, q_room_id, q_now_str, q_room_id ], function (error, results, fields) {
     if (error) throw error;
     
     console.log('rooms: ', results);
    });

    //if fail update instead of insert
       connection.query(sqlstr1_update_user_cr, [ q_user_id, q_room_id, q_date_ts, q_room_name, q_user_id], function (error, results, fields) {
          if (error) throw error;
       console.log('rooms: ', results);
      });

	//   else success
         var sqlstr2_sel_user_cr = "select user_id from user_cr where room_id = ? " ;
        connection.query(sqlstr2_sel_user_cr, function (error, results, fields) { if (error) throw error;
       console.log('rooms: ', results);
     });
});

/*----------------------------------------------------------------
| roomLogout    (3)
|
|  delete from table +user_cr+ for the logged out user
|  send back status
----------------------------------------------------------------*/
var sqlstr1_del_user_cr = "delete from user_cr where user_id = ? ";

router.post('/roomLogout', function(req, res, next) {
  console.log("Post RoomLogout chat server Successful Route");


    connection.query(sqlstr1_del_user_cr, [q_user_id], function (error, results, fields) {
     if (error) throw error;
     console.log('rooms: ', results);
    });





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
var sqlstr1_sel_send_user_cr = "select user_id from user_cr where room_id = ? " ;
var sqlstr_insert_chatroom_queue = "insert into chat_room_queue (user_id, room_id, insert_ts, chat_text, msg_user_id) values (?,?,?,?,?) ";

router.post('/sendMsg', function(req, res, next) {

  console.log("Post Send Message chat server Successful Route");


   connection.query(sqlstr1_sel_send_user_cr, [q_room_id], function (error, results, fields) {
    if (error) throw error;
    console.log('rooms: ', results);
   });


    connection.query(sqlstr1_insert_chatroom_queue, [q_user_id, q_room_id, q_insert_ts, q_chat_text, q_mag_user_id], function (error, results, fields) {
     if (error) throw error;
     CONSOle.log('rooms: ', results);
    });

});

/* ------------------------------------------------------------------
| Error    (5)
|
|
| An error occurred report back to client     
| DONE -5
|-------------------------------------------------------------------*/



module.exports = router;
