class Request {
  constructor(type, payload, path) {
    this.type    = type;
    this.payload = payload;
    this.path    = path;
  }
}

module.exports = Request;
