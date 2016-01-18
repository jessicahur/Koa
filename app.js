var app = require('koa')();
var router = require('koa-router')();


// REST
router.get('/notes', function*(next) {

});

router.get('/notes/:id', function*(next) {

});

router.post('/notes', function*(next) {

});

router.put('/notes/:id', function*(next) {

});

router.del('notes/:id', function*(next) {

});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000, function() {
  console.log('Server started. Listening on port 3000');
});
