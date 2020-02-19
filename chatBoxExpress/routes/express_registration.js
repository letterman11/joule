var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  console.log("Get registration server Successful Route");
  res.send('Get registration  Route AA CC DD');

});

router.post('/', function(req, res, next) {
  console.log("Post registration server Successful Route");
  res.send('Post  registration Route AA CC DD');

});



module.exports = router;
