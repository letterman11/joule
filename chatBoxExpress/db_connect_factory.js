/*-------------
| db connection factory
|
-------------*/

const mysql = require('mysql');
const fs = require('fs');

const fileConfig = 'stockDbConfig.dat';
const regEx = /([A-Za-z_0-9]+)=([A-Za-z_0-9\*\-\/\.\*\:\\]+)/;
var rd = new Map(); 

readDbConfig()

var DbConfig = {

     host 		: rd.get('hostname'),
     user 		: rd.get('user'),
     password	: rd.get('password'),
     database 	: rd.get('database'),
     port       : rd.get('port'),



    createConnectDB: function () {
   
     connection = mysql.createConnection({
     host       : this.host,
     user       : this.user,
     password   : this.password,
     database   : this.database,
     port       : this.port
    });

  return connection;
   }

};

function readDbConfig()
{

    try {
      // Specify 'utf8' encoding to get a string
        const data = fs.readFileSync(fileConfig, 'utf8');
        arr_lines = data.split(/\n/)  
        
        for (var i=0;  i < arr_lines.length; i++) {
            if ( arr_lines[i].match(/^[#|\s]+/))
                continue

            var match =  arr_lines[i].match(regEx);
            if (match)
                rd.set(match[1], match[2])     
            
        }
      
    } catch (err) {
      console.error('Error reading file:', err);
    }

}


module.exports = DbConfig
