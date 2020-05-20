class Request {
  constructor(type, payload, headers, hostname, path) {
    this.type     = type;
    this.payload  = payload;
    this.headers  = headers || ''; // Optional
    this.hostname = hostname || ''; // Optional
    this.path     = path || ''; // Optional
  }
}

module.exports = Request;
