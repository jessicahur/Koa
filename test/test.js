var chai = require('chai');
var chaiHttp = require('chai-http');
var fs = require('fs');
var assert = chai.assert;

var app = require('../app');
var expect = chai.expect;
var dataStorage = './dataStorage/';

chai.use(chaiHttp);

describe('KOA JS CRUD & STATIC SERVE', function() {

  it('should send back a list of files in dataStorage for GET /notes', function(done) {
    chai.request(app.callback())
        .get('/notes')
        .end(function(err, res) {
          expect(err).to.be.null;

          fs.readdir(dataStorage, function(err, filesList) {
            expect(err).to.be.null;
            filesList = filesList.filter(function(file){
              return file.charAt(0) !== '.';
            });
            var compare = 'Files in data storage: '+filesList.join(', ');
            assert.equal(res.text, compare);
            done();
          });

        });
  });

  it('should accept json data and save it into a new file', function(done) {
    var rand = Math.floor((Math.random() * 10));
    chai.request(app.callback())
        .post('/notes')
        .send({number: rand})
        .end(function(err, res) {

          expect(err).to.be.null;
          var jsonReceived = res.text;

          fs.readdir(dataStorage, function(err, filesList) {
            expect(err).to.be.null;
            filesList = filesList.filter(function(file){
              return file.charAt(0) !== '.';
            });

            filesList.forEach(function(fileName, index) {
              var name = parseInt(fileName.split('.')[0]);
              filesList[index] = name;
            });

            var fileToInspect = filesList[filesList.length-1];
            var path = dataStorage+fileToInspect+'.json';

            fs.readFile(path, function(err, data) {
              expect(err).to.be.null;
              var compareString = 'SUCCESS! Data written to server storage: '+data.toString()+ ' in '+ fileToInspect+'.json';
              assert.equal(jsonReceived, compareString);
              done();
            });//end of read file

          });//end of readdir
        });//end of chai request
  });

  it('should send back the content of the requested file', function(done) {
    var file = '1';
    chai.request(app.callback())
        .get('/notes/'+file)
        .end(function(err, res) {

          expect(err).to.be.null;

          fs.readFile(dataStorage+file+'.json', function(err, data){
            expect(err).to.be.null;
            var compare = JSON.parse(data.toString());
            assert.deepEqual(res.body, compare);
            done();
          });

        });
  });

  it('should update the content of the requested file via PUT', function(done) {
    var file = '1';
    var rand = Math.floor((Math.random() * 10));
    chai.request(app.callback())
        .put('/notes/'+file)
        .send({number: rand})
        .end(function(err, res){

          expect(err).to.be.null;

          fs.readFile(dataStorage+file+'.json', function(err, data){
            expect(err).to.be.null;
            var compare = data.toString();
            assert.deepEqual(res.text, compare);
            done();
          });
        });
  });

  it('should delete the file specified in the URL', function(done) {
      before(function(done){
        chai.request(app.callback())
            .post('/notes')
            .send({test : true})
            .end(function(err, res){
              done();
            });
      });
      fs.readdir(dataStorage, function(err, filesList){
        filesList = filesList.filter(function(file) {
          return file.charAt(0) !== '.';
        });
        var file = filesList[filesList.length-1].split('.')[0];
        chai.request(app.callback())
          .delete('/notes/'+file)
          .end(function(err, res){
            fs.readFile(dataStorage+file+'.json', function(err, data) {
              expect(err).to.exist;
              done();
            });
          });

      });
  });

  it('should serve static index.html', function(done){
    chai.request(app.callback())
        .get('/index.html')
        .end(function(err, res){

          fs.readFile('./public/index.html', function(err, data){
            var html = data.toString();
            assert.equal(html, res.text);
            done();
          });

        });
  });

});
