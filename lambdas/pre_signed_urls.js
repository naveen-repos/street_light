const AWS = require('aws-sdk');
var s3 = new AWS.S3({ apiVersion: '2006-03-01' });

const buildErrorResponse = (errorCode, errorMessage) => {
  return {
    isBase64Encoded: false,
    statusCode: 400,
    body: JSON.stringify({
      status: 'FAILURE',
      errorCode: errorCode,
      errorMessage: [errorMessage]
    })
  };
};

const buildSuccessResponse = (responseData) => {
  return {
    isBase64Encoded: false,
    statusCode: 200,
    body: JSON.stringify({
      status: 'SUCCESS',
      data: responseData
    })
  };
};

const s3GetPresignedURL = (s3Params) => {
  return new Promise((resolve, reject) => {
    s3.getSignedUrl('putObject', s3Params, (err, urlObj) => {
      if (err) {
        reject(err);
      } else {
        resolve(urlObj);
      }
    });
  });
};

const getS3Params = ({ villageName, fileInputs }) => {
  return {
    Bucket: "tl-street-lights",
    Key: `${villageName}/POLE/${new Date().getTime()}/${fileInputs.fileName}.${
      fileInputs.fileExtension
    }`,
    ContentType: fileInputs.contentType,
    ACL: "public-read",
    Metadata: fileInputs.metaData || {},
  };
};

const getPreSignedURLs = async (inputs, context) => {
  const s3URLs = await Promise.all(
    inputs.files.map((element) => {
      const s3Params = getS3Params({
        fileInputs: element,
        villageName: inputs.village
      });
      return s3GetPresignedURL(s3Params);
    })
  );
  const result = [];
  for (let iterator = 0; iterator < inputs.files.length; iterator += 1) {
    result.push({
      ...inputs.files[iterator],
      url: s3URLs[iterator]
    });
  }
  context.done(null, buildSuccessResponse(result));
};

exports.handler = async (event, context) => {
  console.log(event);

  const inputs = JSON.parse(event.body);
  //   {
  //       village : "",
  //       files : [
  //           {
  //              fileExtension : "",
  //              fileName : "",
  //              contentType:"",
  //              metaData : {}
  //         },
  //       ]
  //   }

  try {
    await getPreSignedURLs(inputs, context);
  } catch (ex) {
    context.done(null, buildErrorResponse('SERVER_ERROR', ex));
  }
};
