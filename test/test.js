const expect = require('chai').expect;
const Player = require('../data/player.js');
const db = require('../routes.js');

const app = require('../app.js');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

describe('GET api/foobar', () => {

    beforeEach(done => {
      db.initDB()
      done();
    });

    afterEach(done => {
      db.clearDB()
      done();
    });

    it('GET: Happy path', done => {
      chai
        .request(app)
        .get('/api/players')
        .end((err, res) => {
            const expected = '{"foo":"bar"}'; 
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal(expected);
            done();
        });
    });

     it('should return foobaz', done => {
      chai
        .request(app)
        .get('/api/players')
        .end((err, res) => {
            const expected = '{"foo":"baz"}'; 
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal(expected);
            done();
        });
    });
  });


  // Test Cases
  /**
   * 

   CRUD
  1. Get Player by id
  2. Create a new Player
  3. Update a player
  4. Delete a player

    QUERY
  1. Query all players by team name
  2. Query all players with score higher than user input
  3. Query all players by team name and score less than user input
  4. Query all players who were created after date

    DASHBOARD

   */