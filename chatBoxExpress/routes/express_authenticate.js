const express = require('express');
const router = express.Router();

const mysql = require('mysql');


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



router.get('/chatterBox/authenticate', function(req, res, next) {
  res.render('chatterbox', { title: 'Express' });


});











 
connection.end();


module.exports = router;
