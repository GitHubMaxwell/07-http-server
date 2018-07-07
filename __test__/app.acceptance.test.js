'use strict';

const superagent = require('superagent');
const app = require('../src/app.js');

describe('Simple Web Server', () => {

  beforeEach( () => {
    app.start(3001);
  });

  afterEach( () => {
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
        // expect(response.text).toEqual(expect.stringContaining('give'));
      })
      .catch(console.err);

  });

  it('GET: handles a get request with a query string', () => {

    return superagent.get('http://localhost:3001/cowsay?text=here')
      .then(response => {
        // console.log('RESPONSE status:  ',response.status);
        expect(response.status).toEqual(200);
        console.log('RESPONSE TEXT:  ',response.text);
        expect(response.text).toEqual(expect.stringContaining('here'));
      });
  });

  it('POST: handles a good post request', () => {
    let obj = {text:'Fred'};
    return superagent.post('http://localhost:3001/api/cowsay')
      .send(obj)
      .then(response => {
        console.log('ERROR: ', response.status);

        expect(response.text).toEqual(expect.stringContaining('{"content":"Fred"}'));
      })
      .catch(err => {
        //   console.log('ERROR: ', err.status);
        console.error(err);
      });
    //   expect(true).toBe(false);
    // });
  });

  it('POST: handles a bad post request', () => {
    return superagent.post('http://localhost:3001/api/cowsay')
      .catch(error => {
        console.log(error.status);
        expect(error.status).toEqual(400);
      });
  });

  it('POST: handles a bad post request URL', () => {
    let obj = {text:'Fred'};
    return superagent.post('http://localhost:3001/daa')
      .send(obj)
      .catch(error => {
        console.log(error.status);
        expect(error.status).toEqual(404);
      });
  });

});