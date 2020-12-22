const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME;
const buildErrorResponse = (errorCode, errorMessage) => {
  return {
    isBase64Encoded: false,
    statusCode: 400,
    body: JSON.stringify({
      status: "FAILURE",
      errorCode: errorCode,
      errorMessage: [errorMessage],
    }),
  };
};

const buildSuccessResponse = (responseData) => {
  return {
    isBase64Encoded: false,
    statusCode: 200,
    body: JSON.stringify({
      status: "SUCCESS",
      data: responseData,
    }),
  };
};

const getPoles = async (villageId) => {
  var params = {
    TableName: TABLE_NAME,

    ExpressionAttributeValues: {
      ":sk": "POLE",
      ":hkey": villageId,
    },
    ExpressionAttributeNames: {
      "#hk": "PK",
      "#sk": "SK",
    },
    KeyConditionExpression: "#hk = :hkey AND begins_with (#sk, :sk)",
  };

  let data = await ddb.query(params).promise();
  console.log(data.Items);
  return data;
};

exports.handler = async (event, context) => {
  console.log(event);
  const {
    queryStringParameters: { villageId },
  } = event;

  try {
    const poles = await getPoles(villageId);
    context.done(null, buildSuccessResponse(poles.Items));
  } catch (ex) {
    context.done(null, buildErrorResponse("SERVER_ERROR", ex));
  }
};
