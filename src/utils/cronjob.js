const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const ConnectionRequest = require("../models/connectionRequest");
const sendEmail = require("./sendEmail");

//Schedule a cron job for 5AM everyday
cron.schedule("0 5 * * *", async () => {
  //Send email to all people who got requests the previous day

  try {
    const yesterday = subDays(new Date(), 1);
    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    const pendingRequestsOfYesterday = await ConnectionRequest.find({
      status: "interested",
      createdAt: {
        $gte: yesterdayStart,
        $lte: yesterdayEnd,
      },
    }).populate("fromUserId toUserId");

    const listOfEmails = [
      ...new Set(pendingRequestsOfYesterday.map((req) => req.toUserId.emailId)),
    ];

    const emailBody = `
      <html>
      <body>
        <p>Hi,</p>
        <p>
         You have pending connection requests, please login to your DevTinder account and can accept or reject
        </p>
        <p>Thanks<br/>
        Support Team<br/>
        DevTinder</p>
      </body>
      </html>
    `;

    for (const email of listOfEmails) {
      //Send Emails
      try {
        const res = await sendEmail.run(
          email + "You have pending connection Requests",
          emailBody
        );
        console.log(res);
      } catch (err) {
        console.error("Email sending failed", err);
      }
    }
  } catch (err) {
    console.error(err);
  }
});
