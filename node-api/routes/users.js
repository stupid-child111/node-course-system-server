const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/hello', function (req, res, next) {
  res.json({ message: 'Hello 长乐未央111' });
});


module.exports = router;
