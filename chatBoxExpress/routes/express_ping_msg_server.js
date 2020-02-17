/*--------------------------------------/
|  file: express_ping_msg_server.js 
|  author: Angus Brooks
|
---------------------------------------*/

var express = require('express');
var router = express.Router();

var mysql = require('mysql');


var sqlstr1_sel_user_cr = "select * from user_cr where user_id = ?, [q_user_id] ";
var sqlstr2_sel_user_cr = "select user_id from user_cr where room_id = ?, [q_room_id] ";
var sqlstr3_sel_chat_room = "select * from chat_room_queue  where msg_user_id = ?, and insert_ts >= ?, order by cr_queue_id desc limit 2, [q_msg_user_id, q_time_stamp ]";
var sqlstr4_del_chat_room  = "delete from chat_room_queue where cr_queue_id = ?, [q_queue_id or loop an array] ";


module.exports = router;
