const mocha = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should();
const expect = chai.expect;

const Entry = require('../models/Entry');
const { app, runTestServer, closeTestServer } = require('../test-server');
const { TEST_DATABASE_URL } = require('dotenv').config({ path: 'variables.env' });

chai.use(chaiHttp);

const seedEntryData = () => {
  console.info('Seeding Entry Data');
  const seedData = [];

// See if you can use map instead of for
  for (let i = 1; i < 5; i++) {
    seedData.push(createEntryData());
  }
  return Entry.insertMany(seedData);
};

const createEntryData = () => {
  return {
    title: faker.random.words(),
    entered: faker.date.recent(),
    photo: faker.image.image(),
    description: faker.lorem.sentences()
  };
};

const tearDownDb = () => {
  console.log('Tearing down database!');
  return mongoose.connection.dropDatabase();
};

describe('Entries API Resource', function() {

  before(function() {
    return runTestServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return seedEntryData();
  });

  afterEach(function(){
    return tearDownDb();
  });

  after(function(){
    return closeTestServer();
  });

  describe('GET endpoint', function(){
    it('Should return exisiting entries', function(){
      let res;
      return chai
        .request(app)
        .get('/dashboard')
        .then(function(res){
          res.should.have.status(200);
        });
      });

      it('Should return entries with correct fields', function(){
        let resEntry;
        return chai
          .request(app)
          .get('/dashboard')
          .then(function(res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.entries.should.be.a('array');
            res.body.entries.forEach(function(entry) {
              entry.should.be.a('object');
              entry.should.include.keys('id', 'title', 'entered', 'photo', 'description');
            });

            resEntry = res.body.entries[0];
            return Entry.findById(resEntry.id).exec();
          })
          .then(entry => {
            resEntry.title.should.equal(entry.title);
          });

      });
  });

  describe('POST endpoint', function(){
    it('Should create an entry on POST', function(done){
      const newEntry = createEntryData();

      chai
        .request(app)
        .post('/add')
        .send(newEntry)
        .then(function(res) {
            res.should.have.status(201);
            res.should.be.json;
            res.should.be.a('object');
            res.body.should.include.keys('id','title', 'entered', 'photo', 'descrption');
            res.body.id.should.not.be.null;
            res.body.title.should.equal(newEntry.title);
            console.log(res.body);
        });
        done();
      });
  });

});
