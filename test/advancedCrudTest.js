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

    it('Mass update', done => {
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

    it('Get all players sorted by score descendings', done => {
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
  });

function playersEqual(p1, p2){
  return p1.name === p2.name &&
          p1.score === p2.score &&
          p1.teamName === p2.teamName &&
          p1.uuid === p2.uuid

}