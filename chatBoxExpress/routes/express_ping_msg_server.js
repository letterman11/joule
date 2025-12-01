/*--------------------------------------/
|  file: express_ping_msg_server.js 
|  author: Angus Brooks
|  refactored: Using Promises/async-await -claude-ai
---------------------------------------*/

const express = require('express');
const router = express.Router();
const DbConfig = require('../db_connect_factory');
const util = require('util');

function genTimeStamp(newStamp) {
  // 2020-2-20 13:13:58
  const ts = newStamp || new Date();
  const timeStr = ts.toTimeString().substr(0, 9);
  const year = ts.getFullYear();
  const month = ts.getMonth() + 1; // Fixed: was getUTCMonth, now using local time consistently
  const day = ts.getDate();
  const timeStamp = `${year}-${month}-${day} ${timeStr}`;
  return timeStamp;
}

router.get('/', function(req, res, next) {
  console.log("Get express ping msg server Successful Route");
  res.send('Get Ping MSG Route AA CC DD');
});

/* -- message sent back to client for each client logged into a given chat room --
{
  "messages": [
    {
      "user_id": "jenjen",
      "room_id": "basketball",
      "msg_text": "the bee",
      "msg_q_id": "75",
      "time_stamp": "2020-02-21 11:33:52"
    }
  ],
  "msg_user_ids": ["jenjen", "jonjon"]
}
*/

function genJSonMsg(resMsgArray, resultsUserId) {
  const jsonObj = {
    msg_user_ids: resultsUserId.map(u => u.user_id)
  };

  if (resMsgArray && resMsgArray.length > 0) {
    jsonObj.messages = [{
      user_id: resMsgArray[0].USER_ID,
      room_id: resMsgArray[0].ROOM_ID,
      msg_text: resMsgArray[0].CHAT_TEXT,
      msg_q_id: resMsgArray[0].CR_QUEUE_ID,
      time_stamp: genTimeStamp(resMsgArray[0].INSERT_TS)
    }];
  }

  console.log("JSON object sent back to client", jsonObj);
  return jsonObj;
}

const SELECT_USER_CR = "SELECT * FROM user_cr WHERE user_id = ?";
const SELECT_ROOM_USERS = "SELECT user_id FROM user_cr WHERE room_id = ?";
const SELECT_MESSAGES = "SELECT * FROM chat_room_queue WHERE msg_user_id = ? AND insert_ts >= ? ORDER BY cr_queue_id DESC LIMIT 2";
const DELETE_MESSAGE = "DELETE FROM chat_room_queue WHERE cr_queue_id = ?";

/*----------------------------------------------------
the dequeue process for the chat room queue table
----------------------------------------------------*/
router.post('/', async function(req, res, next) {
  console.log("Post express ping msg server Successful Route");

  const qUserId = req.body.userID;
  const qRoomId = req.body.roomID;
  
  let connection;

  try {
    // Create a single connection and promisify the query method
    connection = DbConfig.createConnectDB();
    const query = util.promisify(connection.query).bind(connection);

    // Query 1: Get user chat room info
    console.log("Querying user_cr for user:", qUserId);
    const resultsUCr = await query(SELECT_USER_CR, [qUserId]);
    
    if (!resultsUCr || resultsUCr.length === 0) {
      return res.status(404).json({ error: 'User not found in chat room' });
    }

    console.log("Results from link table", resultsUCr, resultsUCr[0].USER_ID);

    // Query 2: Get all users in the room
    console.log("Querying users in room:", qRoomId);
    const resultsUserId = await query(SELECT_ROOM_USERS, [qRoomId]);

    // Query 3: Get messages for the user
    const qTimeStamp = resultsUCr[0].DATE_TS;
    const qMsgUserId = resultsUCr[0].USER_ID;
    
    console.log("Querying messages for user since:", qTimeStamp);
    const resultsMsgArray = await query(SELECT_MESSAGES, [qUserId, qTimeStamp]);

    console.log("Message array", resultsMsgArray);

    // Query 4: Delete the message if it exists
    let qMsgQId = null;
    if (resultsMsgArray && resultsMsgArray.length > 0) {
      console.log("Message array has been created", resultsMsgArray[0].CR_QUEUE_ID);
      qMsgQId = resultsMsgArray[0].CR_QUEUE_ID;

      const resultsDel = await query(DELETE_MESSAGE, [qMsgQId]);
      console.log("Rows affected by deletion", resultsDel.affectedRows);
    }

    // Generate and send response
    const jsonObj = genJSonMsg(resultsMsgArray, resultsUserId);
    res.json(jsonObj);

  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: 'Database operation failed', details: error.message });
  } finally {
    // Always close the connection
    if (connection) {
      connection.end();
    }
  }
});

module.exports = router;
