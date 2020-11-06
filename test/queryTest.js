const expect = require('chai').expect;

const app = require('../app.js');
const chai = require('chai');
const api = require('../api.js')
const helper = require('./testHelper.js');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const persistence = require('../db/persistence.js');
let data = null;
let db = null;

(async () => {
  db = await persistence.loadDB('test');
})();

describe('PLAYER: QUERY operations', () => {

    beforeEach(done => {
      (async () => {
        await persistence.populateDB();
        await api.setDB('test');
        data = persistence.getPlayerData();
        done();
    })();
  });

  afterEach(done => {
    (async () => {
      await persistence.emptyDB();
      data = [];
      done();
    })();
  });

  it('Query players by team name [case 1]', done => {
    chai
      .request(app)
      .get('/api/players?teamName=RED')
      .end((err, res) => {
          
          expect(res.status).to.equal(200);

          const result = res.body;

          const expected = [data[2], data[4]]; 
          
          expect(helper.arraysEqual(result, expected)).to.be.true;

          done();
      });
  });

  it('Query player by team name [case 2]', done => {
    chai
      .request(app)
      .get('/api/players?teamName=GREEN')
      .end((err, res) => {
          
          expect(res.status).to.equal(200);

          const expected = [data[5]]; 
          const result = res.body;


          expect(helper.arraysEqual(result, expected)).to.be.true;

          done();
      });
  });

  it('Query player by team name [case 3]', done => {
    chai
      .request(app)
      .get('/api/players?teamName=BRONZE')
      .end((err, res) => {
          
          expect(res.status).to.equal(200);

          const expected = []; 
          const result = res.body;

          expect(helper.arraysEqual(result, expected)).to.be.true;

          done();
      });
  });

  it('Query player by team name and score higher than [case 1]', done => {
    chai
      .request(app)
      .get('/api/players?teamName=BLUE&scoreHigherThan=12000')
      .end((err, res) => {
          
        expect(res.status).to.equal(200);

        const expected = [data[0], data[3]]; 
        const result = res.body;

        expect(helper.arraysEqual(result, expected)).to.be.true;
          
        done();

      });
  });

  it('Query player by team name and score higher than [case 2]', done => {
    chai
      .request(app)
      .get('/api/players?teamName=RED&scoreHigherThan=13000')
      .end((err, res) => {
          
        expect(res.status).to.equal(200);

        const expected = [data[2]]; 
        const result = res.body;

        expect(helper.arraysEqual(result, expected)).to.be.true;
          
        done();
        
      });
  });

  it('Query players who started playing before [case 1]', done => {
      chai
        .request(app)
        .get('/api/players?startedBefore=01-02-2020')
        .end((err, res) => {
            
          expect(res.status).to.equal(200);

          const expected = [data[1], data[2], data[3], data[5], data[7], data[8]]; 
          const result = res.body;
  
          expect(helper.arraysEqual(result, expected)).to.be.true;
            
          done();
      });
  });

  it('Query players who started playing before [case 2]', done => {
    chai
      .request(app)
      .get('/api/players?startedBefore=01-06-2019')
      .end((err, res) => {
          
        expect(res.status).to.equal(200);

        const expected = [data[2], data[8]]; 
        const result = res.body;

        expect(helper.arraysEqual(result, expected)).to.be.true;
          
        done();
      });
  });

  it('Query players by team name, started before and score greater than [case 1]', done => {
    chai
      .request(app)
      .get('/api/players?teamName=BLUE&startedBefore=01-05-2020&scoreHigherThan=12000')
      .end((err, res) => {
          
        expect(res.status).to.equal(200);

        const expected = [data[3]]; 
        const result = res.body;

        expect(helper.arraysEqual(result, expected)).to.be.true;

        done();
      });
  });

  it('Query players by team name, started before and score greater than [case 2]', done => {
    chai
      .request(app)
      .get('/api/players?teamName=BLUE&startedBefore=01-05-2020&scoreHigherThan=12000')
      .end((err, res) => {
          
        expect(res.status).to.equal(200);

        const expected = [data[3]]; 
        const result = res.body;

        expect(helper.arraysEqual(result, expected)).to.be.true;

        done();
      });
  });

  it('Query players by team name, started before and score greater than [case 3]', done => {
    chai
      .request(app)
      .get('/api/players?teamName=BLUE&startedBefore=01-02-2020&scoreHigherThan=12000')
      .end((err, res) => {
          
        expect(res.status).to.equal(200);

        const expected = [data[3]]; 
        const result = res.body;

        expect(helper.arraysEqual(result, expected)).to.be.true;

        done();
      });
  });

  it('Query players by team name, started before and score greater than [case 4]', done => {
    chai
      .request(app)
      .get('/api/players?teamName=PURPLE&startedBefore=01-02-2020&scoreHigherThan=8000')
      .end((err, res) => {
          
        expect(res.status).to.equal(200);

        const expected = [data[8]]; 
        const result = res.body;

        expect(helper.arraysEqual(result, expected)).to.be.true;

        done();
      });
  });

  });