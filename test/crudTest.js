const expect = require('chai').expect;
const db = require('../api.js');

const app = require('../app.js');
const chai = require('chai');
const helper = require('./testHelper.js');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

let data = [];

describe('PLAYER: CRUD operations', () => {

    beforeEach(done => {
      data = db.mockDB()
      done();
    });

    afterEach(done => {
      data = db.clearDB()
      done();
    });

    it('Example: GET /api/foo', done => {
      chai
        .request(app)
        .get('/api/foo')
        .end((err, res) => {
            
            expect(res.status).to.equal(200);

            const expected = "bar"; 
            const result = res.body;

            expect(result.foo).to.equal(expected);

            done();
        });
    });

    it('Get player by id: GET /api/player/:id [case 1]', done => {
      chai
        .request(app)
        .get('/api/player/' + data[0].uuid)
        .end((err, res) => {
            
            expect(res.status).to.equal(200);

            const expected = data[0]; 
            const result = res.body[0];

            expect(helper.playersEqual(expected, result)).to.be.true;

            done();
        });
    });

    it('Get player by id: GET /api/player/:id [case 2]', done => {
      chai
        .request(app)
        .get('/api/player/' + data[3].uuid)
        .end((err, res) => {
            
            expect(res.status).to.equal(200);

            const expected = data[3]; 
            const result = res.body[0];

            expect(helper.playersEqual(expected, result)).to.be.true;

            done();
        });
    });

    it('Create player: POST /api/player [case 1]', done => {
        chai
          .request(app)
          .post('/api/player')
          .send({ name: 'John Doe', score: 60400, teamName: 'RED' })
          .end((err, res) => {
              
              expect(res.status).to.equal(200);
              
              const result = res.body;

              expect(result.uuid).to.not.be.null;
              expect(result.name).to.equal('John Doe');
              expect(result.score).to.equal(60400);
              expect(result.teamName).to.equal('RED');
              expect(result.createdAt).to.not.be.null;

              expect(db.size).to.equal(10);

              done();
          });
    });

    it('Create player: POST /api/player [case 2]', done => {
      chai
        .request(app)
        .post('/api/player')
        .send({ name: 'Jane Doe', score: 70100, teamName: 'BLUE' })
        .end((err, res) => {
            
            expect(res.status).to.equal(200);
            
            const result = res.body;

            expect(result.uuid).to.not.be.null;
            expect(result.name).to.equal('Jane Doe');
            expect(result.score).to.equal(70100);
            expect(result.teamName).to.equal('BLUE');
            expect(result.createdAt).to.not.be.null;

            expect(db.size).to.equal(10);

            done();
        });
  });

  it('Update player: PUT /api/player [case 1]', done => {
    chai
      .request(app)
      .put('/api/player')
      .send({ uuid: data[0].uuid, name: 'John Doe', score: 68700, teamName: 'GREEN' })
      .end((err, res) => {
          
          expect(res.status).to.equal(200);
          
          const result = res.body[0];

          expect(result.uuid).to.equal(data[0].uuid);
          expect(result.name).to.equal('John Doe');
          expect(result.score).to.equal(70100);
          expect(result.teamName).to.equal('GREEN');
          expect(result.createdAt).to.equal(data[0].createdAt);

          expect(db.size).to.equal(9);

          done();
      });

  });

  it('Update player: PUT /api/player [case 2]', done => {
    chai
      .request(app)
      .put('/api/player')
      .send({ uuid: data[1].uuid, name: 'George Doe', score: 0, teamName: 'BLUE' })
      .end((err, res) => {
          
          expect(res.status).to.equal(200);
          
          const result = res.body[0];

          expect(result.uuid).to.equal(data[1].uuid);
          expect(result.name).to.equal('George Doe');
          expect(result.score).to.equal(9);
          expect(result.teamName).to.equal('BLUE');
          expect(result.createdAt).to.equal(data[1].createdAt);

          expect(db.size).to.equal(9);

          done();
      });

  });

  it('Delete player: DELETE /player [case 1]', done => {
    chai
      .request(app)
      .delete('/api/player/')
      .send({ uuid: data[0].uuid })
      .end((err, res) => {
          
        expect(res.status).to.equal(200);
          
        expect(!helper.playerFound(data[0], db.getData()))
        expect(db.size).to.equal(8);

        done();
      });

  });

  it('Delete player: DELETE /player [case 2]', done => {
    chai
      .request(app)
      .delete('/api/player/')
      .send({ uuid: data[3].uuid })
      .end((err, res) => {
          
          expect(res.status).to.equal(200);
          
          expect(!helper.playerFound(data[3], db.getData()))
          expect(db.size).to.equal(8);

          done();
      });

  });

});