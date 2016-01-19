var chai = require('chai');
var chaiHttp = require('chai-http');
var fs = require('fs');
var assert = chai.assert;

var app = require('../app');
var expect = chai.expect;
var dataStorage = './dataStorage/';

