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

const addPoleToDb = async (poleData, userName, context) => {
  try {
    const { villageId } = poleData;
    const params = {
      TableName: TABLE_NAME,
      Item: {
        PK: villageId,
        SK: `POLE##${new Date().getTime()}`,
        poleId: `POLE##${new Date().getTime()}`,
        createdOn: Date.now(),
        createdBy: userName,
        ...poleData,
      },
    };
    console.log(JSON.stringify(params));
    await ddb.put(params).promise();

    context.done(null, buildSuccessResponse(params.Item));
  } catch (error) {
    console.log(JSON.stringify(error));
    context.done(null, buildErrorResponse("POLE_NOT_ENTERED", error));
  }
};

const checkVolunteerEligibility = async ({ userName, villageId }) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      PK: "USER",
      SK: `VOLUNTEER##${userName}`,
    },
  };
  let userData = await ddb.get(params).promise();
  console.log(userData);
  if (Object.keys(userData).length === 0) {
    throw Error(
      JSON.stringify(
        buildErrorResponse("USER_NOT_FOUND", "The user doesn't exists")
      )
    );
  }
  let user = userData.Item;
  console.log(user);
  if (!user.volunteerVillages.includes(villageId)) {
    throw Error(
      JSON.stringify(
        buildErrorResponse(
          "USER_NOT_AUTHORIZED",
          "The user is not authorized to add poles to this village"
        )
      )
    );
  }
};

const getUserFromEvent = (event) => {
  try {
    const auth_claims = event.requestContext.authorizer.claims;
    const userName = auth_claims["cognito:username"];
    if (!userName) {
      throw new Error("can't parse user name");
    }
    return userName;
  } catch (ex) {
    throw Error(
      JSON.stringify(buildErrorResponse("AUTH_CLAIMS_NOT_FOUND", ex.message))
    );
  }
};
exports.handler = async (event, context) => {
  console.log(event);
  const poleData = JSON.parse(event.body);

  try {
    const userName = getUserFromEvent(event);
    const { villageId } = poleData;
    await checkVolunteerEligibility({ userName, villageId });
    await addPoleToDb(poleData, userName, context);
  } catch (ex) {
    context.done(null, JSON.parse(ex.message));
  }
};
