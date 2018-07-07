

/* NOT EXPRESS SERVER */


'use strict';

// 1st Party library
const http = require('http');

const cowsay = require('cowsay');
// Local Libraries
// parser will tear the URL apart and give us back an object with things like path, query params, etc.
// it will also deal with POST data and append JSON to req.body if sent
const parser = require('./lib/parser');

function htmlResponse(res) {
  res.setHeader('Content-Type', 'text/html');
  res.statusCode = 200;
  res.statusMessage = 'OK';
}
const requestHandler = (req,res) => {

  // Take a look here if you're interested to see what some parts of the request object are.
  // console.log(req.method);
  // console.log(req.headers);
  // console.log(req.url);

  // In all cases, parse the URL
  parser(req)
    .then( req => {

      /* The "if" statements below are our "routes" and do the same things that express does (below) but 100% manually
           app.get('/', (req,res) => res.send('Hello From the Gutter'));
           app.get('/foo/bar/baz', (req,res) => res.send('Hello From the Gutter'));
      */
      if ( req.method === 'GET' && req.url.pathname === '/' ) {
        htmlResponse(res);

        // // Send out some random HTML (actually, it's not totally random. Note how it includes req.url.query.you ...
        // // That would show whatever you have in the URL after you = (http://localhost:3000?this=that&you=cool

        // let message = req.url.query.you;

        let markup = `<!DOCTYPE html>
        <html>
          <head>
            <title> cowsay </title>  
          </head>
          <body>
           <header>
             <nav>
               <ul> 
                 <li><a href="/cowsay">cowsay</a></li>
               </ul>
             </nav>
           <header>
           <main>
             <p> Cowsay Lab 07 HTTP Vanilla Server </p>
           </main>
          </body>
        </html>`;
        //USE this for /cowsay?text=whatever

        res.write(markup);
        // // ... Instead of doing manual HTML like that, you could have used the "fs" module to read a file
        // // and "res.write()" the contents of that file.

        //send back HTML with a link

        res.end();
        return;
      }

      else if(req.method === 'GET' && req.url.pathname === '/cowsay') {
        // cowsay with query text
        // copy all the header stuff from the generic GET above
        htmlResponse(res);

        let cowMessage = req.url.query.text || 'I need something good to say!';


        let markup =`<!DOCTYPE html>
        <html>
          <head>
            <title> cowsay </title>  
          </head>
          <body>
            <h1> cowsay </h1>
            <pre>
              ${cowsay.say({text: cowMessage})}
            </pre>
          </body>
        </html>`;

        res.write(markup);
        res.end();
        return;

      }

      // Here, we have a "POST" request which will always return a JSON object.  That object will either be
      // the JSON that you posted in (just spitting it back out), or an error object, formatted to look like JSON
      else if ( req.method === 'POST' && req.url.pathname === '/api/cowsay' ) {
        // console.log(req);
        res.setHeader('Content-Type', 'text/json');
        res.statusCode = 200;
        res.statusMessage = 'OK';

        if (req.body.text) {
          let cowMessage = cowsay({text: req.body.text, 
          });
          res.write( JSON.stringify({
            content : cowMessage,
          }));

        } else {
          res.statusCode = 400;
          res.write(JSON.stringify({
            error : 'invalid request: text query required',
          }));
        }
        //send back JSON
        // res.write( JSON.stringify(req.body) );
        res.end();
        return;
      }

      else {
        res.setHeader('Content-Type', 'text/html');
        res.statusCode = 404;
        res.statusMessage = 'Not Found';
        res.write('Resource Not Found');
        res.end();
      }

    }) // closes the "then" of the parser promise
    .catch(err => {
      console.log(err);
      res.writeHead(400);
      res.write(JSON.stringify({
        error : 'invalid request: body required',
      }));
      res.end();
    });
};

// Server callback
const app = http.createServer(requestHandler);

// Expose the start and stop methods.  index.js will call on these.
module.exports = {
  start: (port,callback) => app.listen(port,callback),
  stop: (callback) => app.close(callback),
};
