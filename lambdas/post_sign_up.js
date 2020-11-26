const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME;

const addPersonToDb = async ({ userName, request: { userAttributes } }) => {

  const params = {
    TableName: TABLE_NAME,
    Item: {
      PK: "USER",
      SK: `VOLUNTEER##${userName}`,
      createdOn: Date.now(),
      userAttributes,
      volunteerVillages: ["V1"],
    },
  };
  console.log(JSON.stringify(params));
  await ddb.put(params).promise();
};

exports.handler = async (event, context) => {
  console.log(event);
  try {
    await addPersonToDb(event);
    context.done(null, event);
  } catch (ex) {
    context.done(null, ex.message);
  }
};
