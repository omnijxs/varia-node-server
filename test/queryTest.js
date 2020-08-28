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

    it('Query player by team name:', done => {
      chai
        .request(app)
        .get('/api/players?teamName=RED')
        .end((err, res) => {
            
            expect(res.status).to.equal(200);

            // 2
            // 

            const expected = data[0]; 
            const result = res.body[0];

            expect(playersEqual(expected, result)).to.be.true;

            done();
        });
    });

    it('Query player by team name and score higher than', done => {
      chai
        .request(app)
        .get('/api/players?teamName=RED&scoreHigherThan=1500')
        .end((err, res) => {
            
            expect(res.status).to.equal(200);

            const numberOfPlayers = 1; 

            expect(res.body.length).to.equal(numberOfPlayers);
            
            done();
        });
    });

  it('Query players who have been playing since 1.2.2020', done => {
      chai
        .request(app)
        .get('/api/players?createdOn=01-02-2020')
        .end((err, res) => {
            
            expect(res.status).to.equal(200);
            
            const result = res.body;

            expect(result.name).to.equal('John Doe');
            expect(result.score).to.equal(60400);

            done();
        });
    });

    it('Query players by team name, started before 1.11.2019 and score less than 1000', done => {
      chai
        .request(app)
        .get('/api/players?teamName=RED&createdOn=01-11-2019&scoreLessThan=1000')
        .end((err, res) => {
            
            expect(res.status).to.equal(200);

            const expected = data[0]; 
            const result = res.body[0];

            expect(playersEqual(expected, result)).to.be.true;

            done();
        });
    });

  });