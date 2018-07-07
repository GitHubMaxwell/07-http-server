'use strict';

// First Party Modules
const url = require('url');
const queryString = require('querystring');
//require but dont need to install

module.exports = (req) => {

  return new Promise( (resolve,reject) => {

    // if( !(req || req.url) ) {
    if( !req || !req.url ) {
      reject('Invalid Request Object. Cannot Parse'); 
    }

    // if (!req.url.query) {
    //   //needs to be a resolve in here
    //   //resolve()
    //   req.url.query = 'i dont know what to say';
    // }

    // console.log('pre', req.url);
    req.url = url.parse(req.url);
    // console.log('post', req.url);
    req.url.query = queryString.parse(req.url.query);//?
    // console.log('url.query', Object.values(req.url.query).toString());
    
    //so if the method is anything BUT POST PUT PATCH
    console.log(req.method);
    if(!req.method.match(/POST/) ) {
      resolve(req);
    }
    

    let text = '';
    //data event?
    req.on('data', (buffer) => {
      text += buffer.toString();
    });
    req.on('end', () => {
      try{
        req.body = JSON.parse(text);//?
        resolve(req);
      }
      catch(err) { reject(err); }
    });
    req.on('err', reject);
  });
};