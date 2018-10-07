# VideoStreams

## Live demo

You can find a live version of the service in the address `https://8yocvbb1xb.execute-api.eu-west-1.amazonaws.com/dev/`.
In the `test/postman` folder there's a Postman collection with examples of both calls.

## Run tests

To run the integration tests you should run the command `AWS_PROFILE=<aws_profile> npm test`. If you're using the default profile you don't need to specify it in this call.

To run the acceptance tests you should run the command `AWS_PROFILE=<aws_profile> API_BASE_PATH=https://8yocvbb1xb.execute-api.eu-west-1.amazonaws.com/dev/ npm run test:acceptance`. If you're using the default profile you don't need to specify it in this call. You'll need to change the API base path to yours.

In both cases you will need to deploy the service. To do that, you should run `npm run deploy -- --aws-profile=<aws_profile>`. If you're using the default profile you don't need to specify it in this call.

## Assumptions

- Every video has only one stream.
- A user can request the same video all the times she wants.
- We can't delete a video stream from a user.

## Other considerations

- Integration and acceptance tests are basically the same. The difference is that the acceptance tests call the API endpoint and the integration tests call the lambda function. We could have only one suite of tests parametrized.
- I haven't used SSM because I'm not storing any sensible information in environment variables. In case there was a need to change some configuration on the fly (for example, the maximum number of videos a user can watch), we could have this value on SSM and load it in the lambda function, so we shouldn't redeploy the function to make the change.
- I haven't added any debug logging, just error logging.I could've added some and sample it as explained [here](https://theburningmonk.com/2018/04/you-need-to-sample-debug-logs-in-production/)
- I haven't added x-ray tracing. We could do that by using the serverless plugin `serverless-plugin-tracing` and giving the service the right permissions. We can also think on using other services like IOPipe or Epsagon.
- In case we need it to absorb more traffic, we should tune the throughput of our DynamoDB table. We can do this via the serverless.yml file, and assign different values on the different environments.
- In case DynamoDB wasn't enough, we could move the data storage to something like ElastiCache.
- Finally you can go multi-region. To do that you should set your DynamoDB table as Global Table, then deploy the API to multiple regions and finally configure Route 53.
