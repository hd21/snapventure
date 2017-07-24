const mocha = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const faker = require('faker');

const should = chai.should();
const expect = chai.expect;

const Entry = mongoose.model('Entry');
const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('dotenv').config({ path: 'variables.env' });

chai.use(chaiHttp);

const seedEntryData = () => {
  console.info('Seeding Entry Data');
  const seedData = [];

  for (let i = 1, i < 5, i++) {
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
    return runServer(TEST_DATABASE_URL);
  });
  beforeEach(function() {
    return seedEntryData;
  });
  afterEach(function(){
    return tearDownDb();
  });
  after(function(){
    return closeServer();
  });
});
