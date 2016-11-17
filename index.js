var _request = require('./node_modules/request');
var util = require('util');

util.inherits(VectorWatchRequest, _request);

function VectorWatchRequest (uri, options, callback) {
  if (typeof uri === 'undefined') {
    throw new Error('undefined is not a valid uri or options object.')
  }

  var params = _request.initParams(uri, options, callback)
  if (!params.uri && params.url) {
    params.uri = params.url
    delete params.url
  }
  
  if (process.env.BROWSER_PROXY != undefined) {
    if (params.headers == undefined) {
      params.headers = {};
    }
    params.headers.ProxyUrl = params.uri;
    if (params.headers.Authorization) {
      params.headers.ProxyAuthorization = params.headers.Authorization;
    }
    
    params.uri = process.env.BROWSER_PROXY.uri;
    params.headers.Authorization = process.env.BROWSER_PROXY.authHeader;
  }

  return _request.call(this, params)
}

function verbFunc (verb) {
  var method = verb.toUpperCase()
  return function (uri, options, callback) {
    var params = _request.initParams(uri, options, callback)
    params.method = method
    return VectorWatchRequest(params, params.callback)
  }
}

VectorWatchRequest.get = verbFunc('get')
VectorWatchRequest.head = verbFunc('head')
VectorWatchRequest.post = verbFunc('post')
VectorWatchRequest.put = verbFunc('put')
VectorWatchRequest.patch = verbFunc('patch')
VectorWatchRequest.del = verbFunc('delete')
VectorWatchRequest['delete'] = verbFunc('delete')

module.exports = VectorWatchRequest;