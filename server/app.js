const express = require("express");
const app = express();
const webpush = require("web-push");
const cors = require("cors");

const port = 3000;

// generate a vapid of public and private key
// console.log(webpush.generateVAPIDKeys()) 

webpush.setVapidDetails(
  "mailto:YOUR_MAILTO_STRING",
  process.env.publicKey,
  process.env.privateKey
);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello world");
});

const subscriptionDatabase = new Map();

app.post("/save-subscription", (req, res) => {
  const { userId, subscription } = req.body;
  console.log({ userId, subscription });
  subscriptionDatabase.set(userId, subscription);
  res.json({ status: "Success", message: "Subscription saved!" });
});

app.get("/send-notification/:userId", (req, res) => {
  const { userId } = req.params;
  const subscription = subscriptionDatabase.get(userId);
  if (subscription) {
    webpush.sendNotification(subscription, "Hello world")
      .then(response => {
        res.json({ status: "Success", message: "Message sent to push service" });
      })
      .catch(error => {
        console.error("Error sending notification:", error);
        res.status(500).json({ status: "Failure", message: "Failed to send notification" });
      });
  } else {
    res.status(404).json({ status: "Failure", message: "Subscription not found" });
  }
});

app.listen(port, () => {
  console.log("Server running on port 3000!");
});
