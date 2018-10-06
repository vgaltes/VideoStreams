module.exports.call = (lambda, pathParameters, body) => {
  const context = {};
  const event = {
    pathParameters
  };

  if (body) {
    event.body = JSON.stringify(body);
  }

  return new Promise((resolve, reject) => {
    lambda.handler(event, context, (err, response) => {
      if (err) {
        reject(err);
      } else {
        response.body = JSON.parse(response.body);
        resolve(response);
      }
    });
  });
};
