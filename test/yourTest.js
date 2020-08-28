const expect = require('chai').expect;
const db = require('../routes.js');

const app = require('../app.js');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

let data = [];

describe('PLAYER: Complex operations', () => {

  /** 
   * Implement the following TESTS and endpoint:
   * 
   * 1.
   * An endpoint which returns all players sorted by score in descending order.
   * 
   * 2.
   * An endpoint which updates all players with a given team name to another team name.
   * For example, all those with a team name RED changed to PURPLE.
   *
   * 3. 
   * An endpoint which returns players grouped by team. 
   * response should be. you might want to create a new class in the data folder.
   * Score calculated
   * 
   * {
  *       "teams" : [{
  *               "name": "BANANA",
  *               "totalScore": 110002,
  *               "members": [{
  *                   "name": "Gimli Gloin"
  *                   }] 
  *       ]
  *       
  *          
    * }
    * 
    * 
    *
    */

});