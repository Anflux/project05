const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/send-email", async (req, res) => {
  console.log("Received email request:", req.body);
  const { to, subject, text } = req.body;

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "anthicius.xuflan@gmail.com",
      pass: "iuuedrysqieevwci",
    },
  });

  const mailOptions = {
    from: "anthicius.xuflan@gmail.com",
    to,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(400).send("Error: Email not sent");
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).send("Email sent");
    }
  });
});

app.listen(3008, () => {
  console.log("Email server is running on port 3008");
});
