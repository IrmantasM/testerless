const Request  = require('./Request');
const Response = require('./Response');

class Test {
  constructor(name, request, response) {
    this.name     = name;
    this.request  = new Request(request.type, request.payload, request.headers, request.hostname, request.path);
    this.response = new Response(response.body);
  }
}

module.exports = Test;
