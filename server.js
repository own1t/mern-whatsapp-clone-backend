import express from "express";
import mongoose from "mongoose";
import Messages from "./dbMessages.js";
import cors from "cors";
import Pusher from "pusher";
// var Pusher = require('pusher');

// App Config
const app = express();
const port = 8000;

const pusher = new Pusher({
  appId: "1076046",
  key: "cb6ab0b0f095d65082cd",
  secret: "4236b3196eddbf9550f3",
  cluster: "us3",
  encrypted: true,
});

const db = mongoose.connection;

db.once("open", () => {
  console.log("DB Connected");

  const msgCollection = db.collection("messagecontents");
  const changeStream = msgCollection.watch();

  changeStream.on("change", (change) => {
    // console.log(change);

    if (change.operationType === "insert") {
      const messageDetails = change.fullDocument;
      pusher.trigger("messages", "inserted", {
        id: messageDetails._id,
        name: messageDetails.user,
        message: messageDetails.message,
        timestamp: messageDetails.timestamp,
        received: messageDetails.received,
      });
    } else {
      console.log("Error triggering Pusher");
    }
  });
});

// Middleware
app.use(express.json());
app.use(cors());

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Headers", "*");
//   next();
// });

// DB Config
const connection_url = `mongodb+srv://admin:LBXwawfRXV4GL77f@cluster0.d82cs.mongodb.net/whatsappdb?retryWrites=true&w=majority`;
mongoose.connect(connection_url, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// API Routes
app.get("/", (req, res) => res.status(200).send("Hello World"));

app.get("/api/messages", (req, res) => {
  Messages.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

app.post("/api/messages/new", (req, res) => {
  const dbMessage = req.body;

  Messages.create(dbMessage, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

// Listener
app.listen(port, () => console.log(`Listening on port: ${port}`));
