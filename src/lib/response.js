module.exports.success = body => {
  const res = {
    statusCode: 200
  };

  if (body) {
    res.body = JSON.stringify(body);
  }

  return res;
};

module.exports.failure = (statusCode, body) => {
  const res = { statusCode };

  if (body) {
    res.body = JSON.stringify(body);
  }

  return res;
};
