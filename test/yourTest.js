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

/***** MyTest *****/
 it('Score In Descending Order', done => {
    chai
      .request(app)
      .get('/api/sort')
      .end((err, res) => {
          
          expect(res.status).to.equal(200);

          const expected = [data[5], data[6], data[0], data[2], data[3], data[4], data[8], data[1], data[7]];
          
          const result = res.body;

          expect(helper.arraysEqual(result, expected)).to.be.true;


          done();
      });
  }); 

  it('Updates Players To Another Team Name', done => {
    chai
      .request(app)
      .put('/api/update')
      .send({ fromTeamName: 'RED', toTeamName: 'YELLOW'})
      .end((err, res) => {
          
          expect(res.status).to.equal(200);

          const expected = [data[2], data[4]];
          expected[0].teamName = 'YELLOW'
          expected[1].teamName = 'YELLOW'
          
          const result = res.body;

          expect(helper.arraysEqual(result, expected)).to.be.true;


          done();
      });
  });

  it('Returns Players Grouped By Team And Team Total Sorted Score', done => {
   chai
     .request(app)
     .get('/api/group')
     .end((err, res) => {

       expect(res.status).to.equal(200);

       const expected = {
         "teams":[
       { "name": 'BLUE', totalScore: 38100 },
       { "name": 'PURPLE', totalScore: 34660 },
       { "name": 'RED', totalScore: 24900 },
       { "name": 'GREEN', totalScore: 15440 }
     ]};
       const result = res.body;
       done();
     });
    });


  
 it('pdates Players To Another Team Name', done => {
  chai
    .request(app)
    .get('/api/update')
    .end((err, res) => {


        expect(res.status).to.equal(200);


        const expected = {
          "teams": [
            { "name": 'BLUE', totalScore: 38100, members:[{uuid:"uuid_1"}, {uuid:"uuid_2"}, {uuid:"uuid_4"}]},
            { "name": 'PURPLE', totalScore: 34660, members:[{uuid:"uuid_3"},{uuid:"uuid_5"}]},
            { "name": 'RED', totalScore: 24900, members:[{uuid:"uuid_7"},{uuid:"uuid_8"},{uuid:"uuid_9"} ] },
            { "name": 'GREEN', totalScore: 15440, members:[{uuid:"uuid_6"}] }
          ]}
        const result = res.body;


        expect(result.teams[0].totalScore).to.be.equal(expected.teams[0].totalScore)
        expect(result.teams[1].totalScore).to.be.equal(expected.teams[1].totalScore)
        expect(result.teams[2].totalScore).to.be.equal(expected.teams[2].totalScore)
        expect(result.teams[3].totalScore).to.be.equal(expected.teams[3].totalScore)
        expect(result.teams.length === expected.teams.length)
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

