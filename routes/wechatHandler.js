var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {
   console.log(req.param);
   console.log(req);
	
  res.send('respond with a resource');
});

module.exports = router;
