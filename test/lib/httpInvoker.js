const http = require("superagent");

module.exports.call = (url, verb, body) => {
  const request = http(verb, url).set("accept", "json");

  if (body) {
    request.send(JSON.stringify(body));
  }

  return request;
};
