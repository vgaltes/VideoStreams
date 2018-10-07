module.exports.error = (message, userId, videoId, err) => {
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
};
