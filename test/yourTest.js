const expect = require('chai').expect;
const db = require('../api.js');

const app = require('../app.js');
const chai = require('chai');
const helper = require('./testHelper.js');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

let data = [];

describe('PLAYER: Complex operations', () => {
  beforeEach(done => {
    data = db.mockDB()
    done();
  });

  afterEach(done => {
    data = db.clearDB()
    done();
  });

  it('test', done => {
    chai
      .request(app)
      .get('/api/juhaninTeht?name=June+Worth')
      .end((err, res) => {
          
        expect(res.status).to.equal(200);

        const expected = [data[8]]; 
        const result = res.body;

        expect(helper.arraysEqual(result, expected)).to.be.true;

        done();
      });
  });

  it('juhanin tehtävä [1]', done => {
    chai
      .request(app)
      .get('/api/teht')
      .end((err, res) => {
          
        expect(res.status).to.equal(200);

        const expected = [data[5],data[6],data[0],data[2],data[3],data[4],data[8],data[1],data[7]];
        const result = res.body;

        expect(helper.arraysEqualNew(result, expected)).to.be.true;

        done();
      });
  });

  it('juhanin tehtävä [2]', done => {
    chai
      .request(app)
      .put('/api/updatingTeht?')
      .send({fromTeamName: 'GREEN', toTeamName: 'BruhTeam'})
      .end((err, res) => {
          
        expect(res.status).to.equal(200);

        const expected = [data[5]];
        const result = res.body;
        expect(helper.arraysEqualNew(result, expected)).to.be.true;

        done();
      });
  });

  it('juhanin tehtävä [3]', done => {
    chai
      .request(app)
      .get('/api/mahotonTeht?')
      .end((err, res) => {
          
        expect(res.status).to.equal(200);

        const expected = {
          "teams":[ 
     
        { "name": 'BLUE', totalScore: 38100 },
        { "name": 'PURPLE', totalScore: 34660 },
        { "name": 'RED', totalScore: 24900 },
        { "name": 'GREEN', totalScore: 15440 }
      ]}
        const result = res.body;
        expect(result["teams"].length).to.equal(expected["teams"].length)


        done();
      });
    });
  it('juhanin tehtävä [4]', done => {
    chai
      .request(app)
      .get('/api/mahotonTehtävä2?')
      .end((err, res) => {
          
          expect(res.status).to.equal(200);

          const expected = {
            "teams":[ 
     
        { "name": 'BLUE', totalScore: 38100 },
        { "name": 'PURPLE', totalScore: 34660 },
        { "name": 'RED', totalScore: 24900 },
        { "name": 'GREEN', totalScore: 15440 }
      ]}
        const result = res.body;
        expect(result["teams"].length).to.equal(expected["teams"].length)


        done();
      });
    });
  /** 
   * Implement the following TESTS and ENDPOINTS:
   * 
   * 1. An endpoint which returns all players sorted by score in descending order.
   * 
   * 2. An endpoint which updates all players with a given team name to another team name.
   *    For example, all those with a team name RED changed to PURPLE.
   *
   * 3. An endpoint which returns players grouped by team and team total score and sorted by score descending
   *    The response data structure should be like:
   * 
   *    "teams" : [
   *        {
   *          "name": "a", 
   *          "totalScore": 11000
   *        }, ...
   * 
   *      ]
   * 
   * Protip 1: You have to implement the calculation of total score
   * Protip 2: Create two new classes into data-folder which represent the return value
   *
   * 4. An endpoint which returns players grouped by team and team total score and sorted by score descending AND team member information
   *    The response data structure should be like:
   * 
   *    "teams" : [
   *        {
   *          "name": "a", 
   *          "totalScore": 11000
   *          "members": [
   *            {
   *              "uuid": "uuid_10",
   *              "name": "Malcolm Doe",
   *              "createdAtYear": "2020"
   *            }
   *          ]
   *        }, ...
   * 
   *      ]
   * 
   * Protip 1: Use the same calculation logic for team score as in the above test case
   * Protip 2: Think what data classes you can reuse from the above test case.
   * Protip 3: Do not use the player.js class in the member.
   *
   *
   */

});