import express from "express";
import mongoose from "mongoose";

// App Config
const app = express();
const port = 8000;

// Middleware

// DB Config
const connection_url = `mongodb+srv://admin:LBXwawfRXV4GL77f@cluster0.d82cs.mongodb.net/whatsappdb?retryWrites=true&w=majority`;
mongoose.connect(connection_url, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// API Routes
app.get("/", (req, res) => res.status(200).send("Hello World"));

// Listener
app.listen(port, () => console.log(`Listening on port: ${port}`));
