const expect = require('chai').expect;
const should = require('should');

const app = require('../app.js');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

describe('GET api/foobar', () => {
    it('should return foobar', done => {
      chai
        .request(app)
        .get('/api/foobar')
        .end((err, res) => {
            const expected = '{"foo":"bar"}'; 
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal(expected);
            done();
        });
    });
  });

  describe('GET api/foobaz', () => {
    it('should return foobaz', done => {
      chai
        .request(app)
        .get('/api/foobaz')
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