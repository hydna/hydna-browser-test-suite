
var statSync                  = require('fs').statSync;
var stat                      = require('fs').stat;
var readdir                   = require('fs').readdir;
var readFile                  = require('fs').readFile;
var readFileSync              = require('fs').readFileSync;
var writeFile                 = require('fs').writeFile;
var exists                    = require('fs').exists;
var existsSync                = require('fs').existsSync;
var unlink                    = require('fs').unlink;

var createServer              = require('http').createServer;

var parseUrl                  = require('url').parse;

var format                    = require('util').format;
var log                       = require('util').log;

var basename                  = require('path').basename;
var extname                   = require('path').extname;
var join                      = require('path').join;
var resolve                   = require('path').resolve;

var createClient              = require('redis').createClient;

var ROUTE                     = (function $(r,m,f,a){$[r+m]=[RegExp(r),m,f,a];});

var DIST_BASE                 = resolve(__dirname, 'dist');
var STATIC_BASE               = resolve(__dirname, 'static');
var TEMPLATE_BASE             = resolve(__dirname, 'templates');


var CONTENT_TYPES             = { '.html'       : 'text/html',
                                  '.js'         : 'application/javascript',
                                  '.css'        : 'text/css',
                                  '.swf'        : 'application/x-shockwave-flash'
                                };

var DEFAULT_OPTIONS           = { 'port'        : 8080,
                                  'database'    : ''
                                };

var options                   = Object.create(DEFAULT_OPTIONS);
var redis                     = null;


ROUTE('/$',                     'GET',      handleView, 'index.html');
ROUTE('/test-container$',       'GET',      handleView, 'test-container.html');
ROUTE('/tests$',                'POST',     handleTestResults);
ROUTE('/static/(.*)$',          'GET',      handleStatic, 'static');
ROUTE('/dist/(.*)$',            'GET',      handleStatic, 'dist');
ROUTE('/tests/(.*)$',           'GET',      handleStatic, 'tests');



function main () {
  var args = process.argv.slice(2);
  var arg;
  var http;

  while ((arg = args.shift())) {
    switch (arg) {

      case '-p':
      case '--port':
      options.port = parseInt(args.shift());
      break;

      case '--database':
      break;
    }
  }

  redis = createClient();

  http = createServer();

  http.on('request', onrequest);
  http.listen(options.port);

}


function handleStatic (req, res, expr, url, basepath) {
  var path;

  path = join(basepath || STATIC_BASE, expr[1]);
 
  exists(path, function (doexists) {

    if (doexists == false) {
      return handleError(req, res, 404, 'not found');
    }

    readFile(path, function (err, data) {

      if (err) {
        return handleError(req, res, 500, err.message);
      }

      res.setHeader('Content-Type', CONTENT_TYPES[extname(path)]);
      res.setHeader('Content-Length', data.length);
      res.writeHead(200);
      res.end(data);

    });
  });
}


function handleView (req, res, expr, url, templateName) {
  renderTemplate(res, templateName, {});
}


function handleTestResults (req, res, expr) {
  var data = '';
  req.on('data', function (chunk) {
    data += chunk.toString();
  });
  req.on('end', function () {
    var graph;

    try {
      graph = JSON.parse(data);
    } catch (err) {
      res.writeHead(400);
      res.end();
      return;
    }

    redis.incr('counters:testid', function (err, id) {
      if (err) {
        res.writeHead(500);
        res.end();
        return;
      }
      id = (parseInt(id) + 1000000).toString(16);
      graph.id = id;
      graph.timestamp = Date.now();
      redis.set('test:' + id, JSON.stringify(graph), function (err) {
        if (err) {
          res.writeHead(500);
          res.end();
          return;
        }
        res.writeHead(200);
        res.end(id);
      });
    });
  });
}


function handleError (req, res, code, message) {
  res.writeHead(code || 500);
  res.end(message || 'Unknown error');
}


function renderTemplate (res, name, ctx) {
  var path;

  path = join(TEMPLATE_BASE, name);

  readFile(path, function (err, data) {

    if (err) {
      return handleError(null, res, 500, err.message);
    }

    res.setHeader('Content-Type', CONTENT_TYPES[extname(path)]);
    res.setHeader('Content-Length', data.length);
    res.writeHead(200);
    res.end(data);
  });  
}


function onrequest (req, res) {
  var keys = Object.keys(ROUTE);
  var route;
  var expr;
  var method;
  var badmethod;
  var auth;
  var url;
  var arg;

  url = parseUrl(req.url, true);


  for (var i = 0, l = keys.length; i < l; i++) {
    route = ROUTE[keys[i]];
    if ((expr = route[0].exec(url.pathname))) {
      method = route[1];
      cmd = route[2];
      arg = route[3];

      if (method !== req.method) {
        badmethod = true;
        continue;
      }

      try {
        return cmd(req, res, expr, url, arg);
      } catch (err) {
        return handleError(req, res, 500, err.message);
      }
    }
  }

  handleError(req, res, badmethod ? 405 : 404);
}


if (process.argv[1] == __filename) {
  main();
}