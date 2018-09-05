'use strict';
//node_modules\httpx\lib
const zlib = require('zlib');
const http = require('http');
const https = require('https');
const parse = require('url').parse;
const format = require('url').format;

const debug = require('debug')('httpx');

const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });

const TIMEOUT = 15000; // 15s

var append = function (err, name, message) {
  err.name = name + err.name;
  err.message = message + '\n' + err.message;
  return err;
};

exports.request = function (url, opts) {
  // request(url)
  opts || (opts = {});

  const parsed = typeof url === 'string' ? parse(url) : url;

  const timeout = opts.timeout || TIMEOUT;
  const isHttps = parsed.protocol === 'https:';
  const method = (opts.method || 'GET').toUpperCase();
  const defaultAgent = isHttps ? httpsAgent : httpAgent;
  const agent = opts.agent || defaultAgent;

  var options = {
    host: parsed.hostname || 'localhost',
    path: parsed.path || '/',
    method: method,
    port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
    agent: agent,
    headers: opts.headers || {}
  };

  if (opts.compression) {
    options.headers['accept-encoding'] = 'gzip,deflate';
  }

  const httplib = isHttps ? https : http;

  if (typeof opts.beforeRequest === 'function') {
    options = opts.beforeRequest(options);
  }

  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const request = httplib.request(options);
    const body = opts.data;

    var timer;

    var cleanup = () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    };

    var fulfilled = (response) => {
      cleanup();
      const responseTime = Date.now() - startTime;
      debug(`${options.method} ${response.statusCode} ${responseTime}ms ${format(parsed)}`);
      resolve(response);
    };

    var rejected = (err) => {
      cleanup();
      reject(err);
    };

    var abort = (err) => {
      request.abort();
      rejected(err);
    };

    // string
    if (!body || 'string' === typeof body || body instanceof Buffer) {
      request.end(body);
    } else if ('function' === typeof body.pipe) { // stream
      body.pipe(request);
      body.once('error', (err) => {
        abort(append(err, 'HttpX', 'Stream occor error'));
      });
    }

    request.on('response', fulfilled);
    request.on('error', rejected);
    // for timeout
    timer = setTimeout(() => {
      timer = null;
      var err = new Error();
      var message = `request ${format(parsed)} timeout(${timeout}).`;
      abort(append(err, 'RequestTimeout', message));
    }, timeout);
  });
};

exports.read = function (response, encoding) {
  var readable = response;
  switch (response.headers['content-encoding']) {
  // or, just use zlib.createUnzip() to handle both cases
  case 'gzip':
    readable = response.pipe(zlib.createGunzip());
    break;
  case 'deflate':
    readable = response.pipe(zlib.createInflate());
    break;
  default:
    break;
  }

  return new Promise((resolve, reject) => {
    var cleanup = function () {
      // cleanup
      readable.removeListener('error', onError);
      readable.removeListener('data', onData);
      readable.removeListener('end', onEnd);
    };

    const bufs = [];
    var size = 0;

    var onData = function (buf) {
      bufs.push(buf);
      size += buf.length;
    };

    var onError = function (err) {
      cleanup();
      reject(err);
    };

    var onEnd = function () {
      cleanup();
      var buff = Buffer.concat(bufs, size);

      if (encoding) {
        return resolve(buff.toString(encoding));
      }
      resolve(buff);
    };

    readable.on('error', onError);
    readable.on('data', onData);
    readable.on('end', onEnd);
  });
};
