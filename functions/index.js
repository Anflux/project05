const nodemailer = require('nodemailer');
const functions = require('firebase-functions');

const smtpConfig = nodemailer.createTransport({
  host: 'localhost',
  port: 1025,
  secure: false, // use SSL
  tls: {
    rejectUnauthorized: false, // do not fail on invalid certs
  },
});

const transporter = nodemailer.createTransport(smtpConfig);

exports.sendEmailNotification = functions.firestore
  .document("Activities/{activityId}/joinedUsers/{userId}")
  .onCreate(async (snap, context) => {
    const activityId = context.params.activityId;
    const activityRef = snap.ref.parent.parent;
    const activitySnapshot = await activityRef.get();
    const activityData = activitySnapshot.data();
    const coordinatorEmail = "topmand@taikz.com";

    const mailOptions = {
      from: "topmand@taikz.com", // Replace with your 'from' address
      to: coordinatorEmail,
      subject: "New user joined your activity",
      text: `A new user has joined your activity: ${activityData.title}`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email: ", error);
    }
  });