var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  //Make this render a different welcome page
  res.render('welcome', { title: 'Back to the Drawing Board' });
});
//This path can be a regular expression
router.get('/XXXX', function (req, res, next) {
  res.render('index', { title: 'Back to the Drawing Board' });
});
router.get('/XXXX', function (req, res, next) {
  res.render('index', { title: 'Back to the Drawing Board' });
});
router.get('/XXXX', function (req, res, next) {
  res.render('index', { title: 'Back to the Drawing Board' });
});
router.get('/canvas-*', function (req, res, next) {
  res.render('index', { title: 'Back to the Drawing Board' });
});
router.get('/history-*', function (req, res, next) {
  res.render('history', { title: 'Back to the Drawing Board' });
});


module.exports = router;
