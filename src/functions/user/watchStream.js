const videoStreamRepository = require("../../lib/videoStreamRepository");

module.exports.handler = async (event, context, callback) => {
  const results = await videoStreamRepository.getVideoStreamsFromUser(
    event.pathParameters.user_id,
    process.env.videoStreamsTableName
  );

  if (results.Count === 3) {
    const response = {
      statusCode: 403,
      body: JSON.stringify({ message: "User watching too many video streams." })
    };
    callback(null, response);
  }

  const req = JSON.parse(event.body);

  await videoStreamRepository.insertVideoStream(
    event.pathParameters.user_id,
    req.video_id,
    process.env.videoStreamsTableName
  );

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      video_id: req.video_id
    })
  };
  callback(null, response);
};
