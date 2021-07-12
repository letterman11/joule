var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
//  res.render('index', { title: 'Express' });
  res.render('index', { title: 'Express' });
});

router.get('/expressChat', function(req, res, next) {
//  res.render('index', { title: 'Express' });
  res.render('chatterbox', { title: 'Express' });
});

module.exports = router;
