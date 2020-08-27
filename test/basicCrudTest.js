const expect = require('chai').expect;
const db = require('../routes.js');

const app = require('../app.js');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

let data = [];

// https://github.com/louischatriot/nedb/

describe('PLAYER: CRUD operations', () => {

    beforeEach(done => {
      data = db.initDB()
      done();
    });

    afterEach(done => {
      data = db.clearDB()
      done();
    });

    it('Get player by id: GET /player/:id', done => {
      chai
        .request(app)
        .get('/api/player/' + data[0].uuid)
        .end((err, res) => {
            
            expect(res.status).to.equal(200);

            const expected = data[0]; 
            const result = res.body[0];

            expect(playersEqual(expected, result)).to.be.true;

            done();
        });
    });

    it('Get all players: GET /players', done => {
      chai
        .request(app)
        .get('/api/players')
        .end((err, res) => {
            
            expect(res.status).to.equal(200);

            const numberOfPlayers = 1; 

            expect(res.body.length).to.equal(numberOfPlayers);
            
            done();
        });
    });

  it('Create player: POST /player', done => {
      chai
        .request(app)
        .post('/api/player/')
        .send({ name: 'John Doe', score: 60400 })
        .end((err, res) => {
            
            expect(res.status).to.equal(200);
            
            const result = res.body;

            expect(result.name).to.equal('John Doe');
            expect(result.score).to.equal(60400);

            done();
        });
    });

    it('Update player: PUT /player', done => {
      chai
        .request(app)
        .put('/api/player/')
        .send({ uuid: data[0].uuid, name: 'John Moe', score: 70800, teamName: 'RED' })
        .end((err, res) => {
            
            expect(res.status).to.equal(200);
            
            const result = res.body[0];

            expect(result.uuid).to.equal(data[0].uuid);
            expect(result.name).to.equal('John Moe');
            expect(result.score).to.equal(70800);
            expect(result.teamName).to.equal('RED');

            done();
        });

    });

    it('Delete player: DELETE /player', done => {
      chai
        .request(app)
        .delete('/api/player/')
        .send({ uuid: data[0].uuid })
        .end((err, res) => {
            
            expect(res.status).to.equal(200);
            expect(res.body.numberOfRemoved).to.equal(1);

            done();
        });

    });

  });

function playersEqual(p1, p2){
  return p1.name === p2.name &&
          p1.score === p2.score &&
          p1.teamName === p2.teamName &&
          p1.uuid === p2.uuid

}


/* Phase one:
 
  * why don't tests work in VS Code 
  * Hardcoded objects
  * nedb
  * local mongoose (or docker)


*/ 
  // Test Cases
  /**
   * 

   CRUD
  1. Get Player by id
  2. Create a new Player
  3. Update a player
  4. Delete a player

    ADVANCED CRUD
  5. Mass update
  6. Sorted by score

    QUERY
  1. Query all players by team name
  2. Query all players with score higher than user input
  3. Query all players by team name and score less than user input
  4. Query all players who were created after date

    DASHBOARD

   */