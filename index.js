var _request = require('request');
var util = require('util');

util.inherits(VectorWatchRequest, _request);

function VectorWatchRequest (uri, options, callback) {
  if (typeof uri === 'undefined') {
    throw new Error('undefined is not a valid uri or options object.')
  }

  var params = _request.initParams(uri, options, callback)

  if (process.env.BROWSER_PROXY == true) {
    if (params.headers == undefined) {
      params.headers = {};
    }
    params.headers.ProxyUrl = params.uri;
    params.uri = "http://localhost:9000/";
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