'use strict';

const superagent = require('superagent');
const app = require('../src/app.js');

describe('Simple Web Server', () => {

  beforeAll( () => {
    app.start(3001);
  });

  afterAll( () => {
    app.stop();
  });

  it('GET: handles an invalid get request with a 404', () => {

    return superagent.get('http://localhost:3001/foo')
      .catch(response => expect(response.status).toEqual(404));
  });

  it('GET: handles a valid get request', () => {

    return superagent.get('http://localhost:3001/')
      .then(response => {
        expect(response.statusCode).toEqual(200);
        expect(response.text).toEqual(expect.stringContaining('h1'));
      })
      .catch(console.err);

  });

  it('GET: handles a get request with a query string', () => {

    return superagent.get('http://localhost:3001/?you=here')
      .then(response => {
        console.log('RESPONSE status:  ',response.status);
        expect(response.status).toEqual(200);
        
        console.log('RESPONSE TEXT:  ',response.text);
        expect(response.text).toEqual(expect.stringContaining('here'));
      })
      .catch(console.err);

  });

  it('POST: handles a good post request', () => {
    let obj = {name:'Fred'};
    let expected = JSON.stringify(obj);
    return superagent.post('http://localhost:3001/data')
      .send(obj)
      .then(response => {
        expect(response.text).toEqual(expected);
      })
      .catch(console.err);
  });

  it('POST: handles a bad post request', () => {
    // let obj = {name:'Fred'};
    // let expected = JSON.stringify(obj);
    return superagent.post('http://localhost:3001/data')
      // .send(obj)
      // .then(response => {
      //   expect(response.text).toEqual(expected);
      // })
      .catch(error => {
        console.log(error.status);
        expect(error.status).toEqual(500);
      });
  });

  it('POST: handles a bad post request URL', () => {
    let obj = {name:'Fred'};
    return superagent.post('http://localhost:3001/daa')
      .send(obj)
      .catch(error => {
        console.log(error.status);
        expect(error.status).toEqual(404);
      });
  });

});