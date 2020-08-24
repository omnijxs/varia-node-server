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
