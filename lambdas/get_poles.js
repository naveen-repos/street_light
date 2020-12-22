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
const getPowerConsumption = (data1) => {
  let total_loss = 0;
  data1.forEach((pole) => {
    if (pole.poleStatus === "DIRECT_CONNECTION") {
      const { lights } = pole;
      for (let itaration = 0; itaration < lights.length; itaration += 1) {
        if (lights[itaration].status === "WORKING") {
          total_loss += lights[itaration].energy_consumption;
        }
      }
    }
  });
  return total_loss;
};

exports.handler = async (event, context) => {
  console.log(event);
  const {
    queryStringParameters: { villageId },
  } = event;

  try {
    const poles = await getPoles(villageId);
    const powerConsumption = await getPowerConsumption(poles.Items);
    context.done(
      null,
      buildSuccessResponse({ poles: poles.Items, powerConsumption })
    );
  } catch (ex) {
    context.done(null, buildErrorResponse("SERVER_ERROR", ex));
  }
};
