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

describe('PLAYER: CRUD operations', () => {

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
  it('juhanin mongoDB teht [1]', done => {
    chai
      .request(app)
      .get('/api/DBTeht1')
      .end((err, res) => {

        expect(res.status).to.equal(200);

        const expected = [data[5],data[6],data[0],data[2],data[3],data[4],data[8],data[1],data[7]];
        const result = res.body;

        expect(helper.arraysEqual(result, expected)).to.be.true;

        done();
      });
  });
  it('juhanin mongo DB tehtävä [2]', done => {
    chai
      .request(app)
      .put('/api/updatingmongoDBTeht?')
      .send({fromTeamName: 'GREEN', toTeamName: 'BruhTeam'})
      .end((err, res) => {

        expect(res.status).to.equal(200);

        const expected = [data[5]];
        const result = res.body;
        expect(helper.arraysEqual(result, expected)).to.be.true;

        done();
      });
  });
  it('juhanin mongoDB tehtävä [3]', done => {
    chai
      .request(app)
      .get('/api/mahotonMongoDBTeht?')
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
        expect(result.teams[0].totalScore).to.be.equal(expected.teams[0].totalScore)
        expect(result.teams[1].totalScore).to.be.equal(expected.teams[1].totalScore)
        expect(result.teams[2].totalScore).to.be.equal(expected.teams[2].totalScore)
        expect(result.teams[3].totalScore).to.be.equal(expected.teams[3].totalScore)


        done();
      });
    });

  it('juhanin mongoDB tehtävä [4]', done => {
    chai
      .request(app)
      .get('/api/mahotonmongoDBTehtävä2?')
      .end((err, res) => {
  
          expect(res.status).to.equal(200);
  
          const expected = {
            "teams":[ 
  
              { name: 'BLUE', totalScore: 38100, members: [ 
                { uuid: 'uuid_1', name: 'John Doe', createdAtYear: 2020 },
                { uuid: 'uuid_2', name: 'Jane Doe', createdAtYear: 2019 },
                { uuid: 'uuid_4', name: 'George Doe', createdAtYear: 2020 }
            ]},
                { name: 'PURPLE', totalScore: 34660, members: [
                { uuid: 'uuid_3', name: 'John Coe', createdAtYear: 2019 },
                { uuid: 'uuid_5', name: 'Jane Coe', createdAtYear: 2020 }
              ]},
                { name: 'RED', totalScore: 24900, members: [
                { uuid: 'uuid_6', name: 'George Coe', createdAtYear: 2019 }
              ]},
                { name: 'GREEN', totalScore: 15440, members: [
                {uuid: 'uuid_7', name: 'George Daffodil', createdAtYear: 2020},
                { uuid: 'uuid_8', name: 'Mark Coe', createdAtYear: 2020 },
                { uuid: 'uuid_9', name: 'June Worth', createdAtYear: 2019 }] }
        ]}
        const result = res.body;
        expect(result["teams"].length).to.equal(expected["teams"].length)
        expect(result.teams[0].totalScore).to.be.equal(expected.teams[0].totalScore)
        expect(result.teams[1].totalScore).to.be.equal(expected.teams[1].totalScore)
        expect(result.teams[2].totalScore).to.be.equal(expected.teams[2].totalScore)
        expect(result.teams[3].totalScore).to.be.equal(expected.teams[3].totalScore)
  
  
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