const videoStreamRepository = require("../../lib/videoStreamRepository");
const log = require("../../lib/log");

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
  const req = JSON.parse(event.body);

  return videoStreamRepository
    .getVideoStreamsFromUser(userId, process.env.videoStreamsTableName)
    .then(results => {
      if (results.Count === 3) {
        return Promise.resolve(
          callback(
            null,
            response(403, {
              message: "User watching too many video streams."
            })
          )
        );
      }
      return videoStreamRepository
        .insertVideoStream(
          userId,
          req.video_id,
          process.env.videoStreamsTableName
        )
        .then(() => {
          callback(
            null,
            response(200, {
              video_id: req.video_id
            })
          );
        })
        .catch(err => {
          log.Error(
            "Error inserting a new video stream into the database.",
            userId,
            req.video_id,
            err
          );

          callback(null, response(500));
        });
    })
    .catch(err => {
      log.Error(
        "Error reading video streams from the database.",
        userId,
        req.video_id,
        err
      );

      callback(null, response(500));
    });
};
