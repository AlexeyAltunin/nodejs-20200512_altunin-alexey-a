const url = require('url');
const http = require('http');
const path = require('path');
const fse = require('fs-extra');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
      if (req.url.split('/').length > 2) {
        res.statusCode = 400;
        res.end('nested directories are not supported');

        break;
      }

      fse.unlink(filepath, (error) => {
        if (error) {
          if (error.code === 'ENOENT') {
            res.statusCode = 404;
            res.end('Not found');
          } else {
            res.statusCode = 500;
            res.end('Internal error');
          }
        } else {
          res.statusCode = 200;
          res.end('Ok');
        }
      });

      break;
    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
