const url = require('url');
const http = require('http');
const path = require('path');
const fse = require('fs-extra');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      if (req.url.split('/').length > 2) {
        res.statusCode = 400;
        res.end('nested directories are not supported');

        break;
      }

      const readStream = fse.createReadStream(filepath);

      readStream.on('error', function(err) {
        if (err.code === 'ENOENT') {
          res.statusCode = 404;
        }

        res.end('file is not found');
      });

      res.statusCode = 200;
      readStream.pipe(res);

      break;
    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;