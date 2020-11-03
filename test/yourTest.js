const expect = require('chai').expect;
const db = require('../api.js');

const helper = require('./testHelper.js');
const app = require('../app.js');
const chai = require('chai');
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
  it('Query players by score, sort by descending [case 1]', done => {
    chai
      .request(app)
      .get('/api/sort')
      .end((err, res) => {
          
        expect(res.status).to.equal(200);

        const expected = [data[5], data[6], data[0], data[2], data[3], data[4], data[8], data[1], data[7]]; 
        const result = res.body;

        expect(helper.arraysEqualSort(result, expected)).to.be.true;
          
        done();

      });
  });
  it('Query players by team name, change team name to onion [case 1]', done => {
    chai
      .request(app)
      .put('/api/change')
      .send({fromTeamName: 'GREEN',toTeamName: 'ONION' })
      .end((err, res) => {
          
        expect(res.status).to.equal(200);

        const result = res.body;

        const expected = [data[5]];

        expect(helper.arraysEqual(result, expected)).to.be.true;
          
        done();

      });
  });
  it('Query players by team name, change team name to onion [case 2]', done => {
    chai
      .request(app)
      .put('/api/change')
      .send({fromTeamName: 'ONION',toTeamName: 'GREEN' })
      .end((err, res) => {
          
        expect(res.status).to.equal(200);

        const result = res.body;

        const expected = [];

        expect(helper.arraysEqual(result, expected)).to.be.true;
          
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
   })