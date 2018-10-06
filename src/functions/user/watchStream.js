module.exports.handler = (event, context, callback) => {
  // check how many videos the user is already watching

  const response = {
    statusCode: 200,
    body: JSON.stringify({ video_id: event.body.video_id })
  };
  callback(null, response);
};
