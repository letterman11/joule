var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
//  res.render('index', { title: 'Express' });
  res.render('chatterbox', { title: 'Express' });
});

router.get('/chatterBox', function(req, res, next) {
//  res.render('index', { title: 'Express' });
  res.render('chatterbox', { title: 'Express' });
});

module.exports = router;


/*

require()
router.get()
res.render()



*/
