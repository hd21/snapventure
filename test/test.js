const mocha = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const faker = require('faker');
const Entry = mongoose.model('Entry');

const should = chai.should();
const expect = chai.expect;

const { app, runServer, closeServer } = require('./server');

chai.use(chaiHttp);
