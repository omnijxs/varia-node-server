const expect = require('chai').expect;
const db = require('../routes.js');

const app = require('../app.js');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

let data = [];

describe('PLAYER: QUERY operations', () => {

  beforeEach(done => {
    data = db.mockDB()
    done();
  });

  afterEach(done => {
    data = db.clearDB()
    done();
  });

  it('Query player by team name [case 1]', done => {
    chai
      .request(app)
      .get('/api/players?teamName=RED')
      .end((err, res) => {
          
          expect(res.status).to.equal(200);

          const expected = [data[2], data[4]]; 
          const result = res.body;

          expect(playerArraysEqual).to.be.true;

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

          expect(playerArraysEqual).to.be.true;

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

        expect(playerArraysEqual).to.be.true;
          
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

        expect(playerArraysEqual).to.be.true;
          
        done();
        
      });
  });

  it('Query players who started playing before [case 1]', done => {
      chai
        .request(app)
        .get('/api/players?startedBefore=01-02-2020')
        .end((err, res) => {
            
          expect(res.status).to.equal(200);

          const expected = [data[1], data[2], data[3], data[5]]; 
          const result = res.body;
  
          expect(playerArraysEqual).to.be.true;
            
          done();
      });
  });

  it('Query players who started playing before [case 2]', done => {
    chai
      .request(app)
      .get('/api/players?startedBefore=01-06-2019')
      .end((err, res) => {
          
        expect(res.status).to.equal(200);

        const expected = [data[2]]; 
        const result = res.body;

        expect(playerArraysEqual).to.be.true;
          
        done();
      });
  });

  /** */

  function mockDB(){
    const p1 = new Player('uuid_1', 'John Doe', 14240, 'BLUE', new Date('2020-08-20T00:00:00.000Z'));
    const p2 = new Player('uuid_2', 'Jane Doe', 11200, 'BLUE', new Date('2019-11-27T00:00:00.000Z'));
    const p3 = new Player('uuid_3', 'John Coe', 13200, 'RED', new Date('2019-04-01T00:00:00.000Z'));
    const p4 = new Player('uuid_4', 'George Doe', 12660, 'BLUE', new Date('2020-01-19T00:00:00.000Z'));
    const p5 = new Player('uuid_5', 'Jane Coe', 11700, 'RED', new Date('2020-02-15T00:00:00.000Z'));
    const p6 = new Player('uuid_6', 'George Coe', 15440, 'GREEN', new Date('2019-09-20T00:00:00.000Z'));
    db = [p1, p2, p3, p4, p5, p6];
    return db;
}

  it('Query players by team name, started before and score greater than [case 1]', done => {
    chai
      .request(app)
      .get('/api/players?teamName=BLUE&startedBefore=01-05-2020&scoreHigherThan=12000')
      .end((err, res) => {
          
        expect(res.status).to.equal(200);

        const expected = [data[3]]; 
        const result = res.body;

        expect(playerArraysEqual).to.be.true;
          

        done();
      });
  });

  });