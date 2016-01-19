var app = require('koa')();
var router = require('koa-router')();
var koaBody   = require('koa-body')();
var fs = require('fs');
var dataStorage = './dataStorage/';


// REST
router.get('/notes', function*(next) {

  yield new Promise((resolve, reject) => {

    fs.readdir(dataStorage, (err, filesList) => {
      if (err) {
        this.body = ('Cannot get notes list. Try again later.');
        return console.log('Cannot read directory of dataStorage: ',err.message);
      }
      filesList = filesList.filter(function(file){
        return file.charAt(0) !== '.';
      });
      this.body = 'Files in data storage: '+filesList.join(', ');
      resolve();
    });

  });
});


//GET specific file, PUT updates to a specific file, DELETE a specific file
router
  .param('file', function*(id, next) {
    this.file = id;
    yield next;
  })
  //GET
  .get('/notes/:file', function*(next) {
    var requestedFile = this.file+'.json';

    yield new Promise((resolve, reject) => {

      fs.readdir(dataStorage,  (err, filesList) => {
      if (filesList.indexOf(requestedFile) !== -1) {
        var path = dataStorage+requestedFile;

        fs.readFile(path, (err, data) => {
          if (err) {
            this.body = 'Cannot get requested file.';
            resolve();//NOT SURE IF NEEDED HERE
            return console.log('Cannot read requested file:',err.message);
          }
          var content = JSON.parse(data.toString());
          this.body = content;
          resolve();
        });
      }
      else{
        this.body = 'Cannot load file content';
        resolve();
      }
    });
    });
  })
  //PUT
  .put('/notes/:file', koaBody, function*(next) {
    var requestedFile = this.file+'.json';
    var dataBody = JSON.stringify(this.request.body);

    yield new Promise((resolve, reject) => {

      fs.readdir(dataStorage, (err, filesList) => {

        filesList = filesList.filter((file) => {
          return file.charAt(0) !== '.';
        });

        var existed = filesList.find((file) => {
          return file === requestedFile;
        });

        if (existed === undefined) {
          this.body = 'File does not exist in data storage';
          resolve();
          return console.log('File is not in data storage');
        }

        fs.writeFile(dataStorage+requestedFile, dataBody,(err) => {
          if(err) {
            this.body = err.message;
            resolve();
            return console.log('ERROR!', err.message);
          }
          this.body = 'Successfully updated data storage with new content: ' +dataBody+' ('+requestedFile+')';
          resolve();
        });

      });//end of readdir
    });//end of Promise
  })
  //DELETE existing file
  .del('/notes/:file', function*(next) {
    var requestedFile = this.file+'.json';

    yield new Promise((resolve, reject) => {

    });//end of Promise
  });

//POST
router.post('/notes', koaBody, function*(next) {

  var dataBody = JSON.stringify(this.request.body);

  yield new Promise( (resolve, reject) => {

    fs.readdir(dataStorage, (err, filesList) => {
      if (err) {
        resolve();
        return console.log('Cannot read directory of dataStorage: ',err.message);
      }
      //filter out any hidden file
      filesList = filesList.filter(function(file){
          return file.charAt(0) !== '.';
      });

      //if there is no json in data storage
      if (filesList.length === 0) { //annoying .DS_Store
        var fileName = '1.json';

        fs.writeFile(dataStorage+fileName, dataBody, (err) => {
          if (err) {
            this.body = 'Data failed to save. Try again later.';
            resolve();
            return console.log(err.message);
          }

          this.body = 'SUCCESS! Data written to server storage: '+ dataBody+' in '+fileName;
          resolve();
        });
      }

      //if there are json files in storage
      else {

        filesList.forEach(function(fileName, index){
           var name = parseInt(fileName.split('.')[0]);
           filesList[index] = name;
        });

        filesList.sort(function(a,b){return a-b});

        fileName = filesList[filesList.length-1];
        fileName = ++filesList.length;
        fileName = fileName.toString()+'.json';

        fs.writeFile(dataStorage+fileName, dataBody, (err) => {
          if (err) {
            this.body = 'Data failed to save. Try again later.';
            resolve();
            return console.log(err.message);
          }
          this.body = 'SUCCESS! Data written to server storage: '+ dataBody+' in '+fileName;
          resolve();
        });
      }
    });
  });
});


app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000, function() {
  console.log('Server started. Listening on port 3000');
});
