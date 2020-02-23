/*-------------
| db connection factory
|
-------------*/

const mysql = require('mysql');

var DbConfig = {

     host 		: "localhost",
     user 		: "dococt",
     password	: "dococt",
     database 	: "dcoda_acme",



    createConnectDB: function () {
   
     connection = mysql.createConnection({
      host     : this.host,
      user     : this.user,
      password : this.password,
      database : this.database
    });

  return connection;
   }

};


module.exports = DbConfig
