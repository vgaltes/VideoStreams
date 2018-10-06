const videoStreamRepository = require("../../lib/videoStreamRepository");

function logError(message, userId, videoId, err) {
  console.log(
    JSON.stringify({
      message,
      errorName: err.name,
      errorMessage: err.message,
      stackTrace: err.stack,
      userId,
      videoId
    })
  );
}

function response(statusCode, body) {
  const res = {
    statusCode
  };

  if (body) {
    res.body = JSON.stringify(body);
  }

  return res;
}

module.exports.handler = async (event, context, callback) => {
  const userId = event.pathParameters.user_id;

  return videoStreamRepository
    .getVideoStreamsFromUser(userId, process.env.videoStreamsTableName)
    .then(results => {
      callback(
        null,
        response(200, {
          streams: results.Items.map(r => r.videoId)
        })
      );
    })
    .catch(err => {
      logError("Error reading video streams from the database.", userId, err);
      callback(null, response(500));
    });
};
