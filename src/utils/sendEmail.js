// snippet-start:[ses.JavaScript.email.sendEmailV3]
const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient.js");

const createSendEmailCommand = (fromAddress, subject, emailBody) => {
  console.log("Mayank");
  return new SendEmailCommand({
    Destination: {
      CcAddresses: [
        /* more cc email address */
      ],
      ToAddresses: ["mayank051raj@gmail.com"],
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: "UTF-8",
          Data: emailBody,
        },
        Text: {
          Charset: "UTF-8",
          Data: "",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
      /* more items */
    ],
  });
};

const run = async (subject, emailBody) => {
  const sendEmailCommand = createSendEmailCommand(
    "support@mayankraj-dev.in",
    subject,
    emailBody
  );
  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      /** @type { import('@aws-sdk/client-ses').MessageRejected} */

      const messageRejectedError = caught;
      console.log("Getting error", messageRejectedError);
      return messageRejectedError;
    }
    throw caught;
  }
};

// snippet-end:[ses.JavaScript.email.sendEmailV3]
module.exports = { run };
