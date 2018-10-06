module.exports.handler = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({ message: `OK User ${event.pathParameters.user_id}` })
  };
  callback(null, response);
};
