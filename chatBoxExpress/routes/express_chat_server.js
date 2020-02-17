/*------------------------------------------/
| file: express_chat_server.js
| author: Angus Brooks
-------------------------------------------*/
var express = require('express');
var router = express.Router();

var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'dococt',
  password : 'dococt',
  database : 'dcoda_acme'
});


connection.connect();

//connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
connection.query('SELECT count(*) from dcoda_acme.WM_BOOKMARK ', function (error, results, fields) {
 if (error) throw error;
//  console.log('The solution is: ', results[0].solution);
  console.log('The solution is: ', results[0]);
});

/* ------------------------------------------------------------------
|if roomIDs              (1)
|
|-------------------------------------------------------------------*/
var sqlstr1_sel_chatroom = "select room_id from dcoda_acme.chat_room";

/************************************************************
* Initial state of application once user signs into chatterBox
* generation of room IDs send back to client from table +chat_room+
* JSON
* DONE -1
************************************************************/

connection.query(sqlstr1_sel_chatroom, function (error, results, fields) {
  if (error) throw error;
  console.log('rooms: ', results);
});

/* ---------------------------------------------------------------
|elsif roomLogin         (2)
|
|-----------------------------------------------------------------*/
var sqlstr1_insert_user_cr = "insert into user_cr values (?, ?, ?), [q_user_id, q_room_id, q_now_str, q_room_id ]" ;

/*************************************************************************************************
* insert of client into link table +user_cr+ to associate client with a chat room
*  thus creating an entry in the chatroom queue table
*
**************************************************************************************************/
/*
connection.query(sqlstr1_insert_user_cr, function (error, results, fields) {
  if (error) throw error;
  console.log('rooms: ', results);
});
*/
//     if fail because user_id already present then update
        var sqlstr1_update_user_cr = "update user_cr set  user_id = ?, room_id = ?, date_ts = ?, room_name = ?, where user_id = ?', [ q_user_id, q_room_id, q_date_ts, q_room_name, q_user_id] ";
/*       
       connection.query(sqlstr1_update_user_cr, function (error, results, fields) {
          if (error) throw error;
       console.log('rooms: ', results);
      });
        

//	   else success
         var sqlstr2_sel_user_cr = "select user_id from user_cr where room_id = ? " ;
connection.query(sqlstr2_sel_user_cr, function (error, results, fields) { if (error) throw error;
       console.log('rooms: ', results);
      });
*/
/********************************************************
* generate user_id from table +user_cr+ and send back to client 
* JSON
* DONE -2
********************************************************/
/*----------------------------------------------------------------
|elsif roomLogout      (3)
|
---------------------------------------------------------------- */
var sqlstr1_del_user_cr = "delete from user_cr where user_id = ?, [q_user_id] ";
/*
*  delete from table +user_cr+ for the logged out user
*  send back status
*  DONE -3
*******************************************************/
/*
connection.query(sqlstr1_del_user_cr, function (error, results, fields) {
  if (error) throw error;
  console.log('rooms: ', results);
});
*/
/* ------------------------------------------------------------------
|elsif sendMsg         (4)
|
|-------------------------------------------------------------------*/

var sqlstr1_sel_send_user_cr = "select user_id from user_cr where room_id = ?, [q_room_id] " ;
var sqlstr_insert_chatroom_queue = "insert into chat_room_queue (user_id, room_id, insert_ts, chat_text, msg_user_id) values (?,?,?,?,?), [q_user_id, q_room_id, q_insert_ts, q_chat_text, q_mag_user_id] ";
/********************************************************
* send message  from client to all other clients logged into chatroom
* the process ->
* a)  gather all clients logged into chatroom via +user_cr+ table and  4a
* b) insert into queue table +chat_room_queue+ via sql insert for     4b
* for all logged in users 
* JSON
* DONE -4
********************************************************/
/*
connection.query(sqlstr1_sel_send_user_cr, function (error, results, fields) {
  if (error) throw error;
  console.log('rooms: ', results);
});


connection.query(sqlstr1_insert_chatroom_queue, function (error, results, fields) {
  if (error) throw error;
  console.log('rooms: ', results);
});

*/
/* ------------------------------------------------------------------
|else Error      (5)
|
|-------------------------------------------------------------------*/

/********************************************************
| An error occurred report back to client     
* DONE -5
********************************************************/


module.exports = router;
